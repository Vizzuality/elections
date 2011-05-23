# encoding: UTF-8
# Copyright (C) 2011 by Vizzuality SL
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#

#
# A Ruby script to concurrently download 2011 municipal election 
# data for all Spanish municipalities
#
# Outputs a CSV containing nicely formatted data.
#
# to run: ruby spanish_municipal_elections_data_2011.rb 
#
# Gem dependencies:
#
# * pg
# * typhoeus
# * nokogiri
#

require 'rubygems'
require 'pg'
require 'typhoeus'
require 'json'
require 'fileutils'
require 'nokogiri'
require 'open-uri'
require 'csv'

# Introduction
puts "Downloading all Spanish municipal election results for 2011"

# Setup
base_url     = "http://resultados2011.mir.es/99MU/"
overall_page = "DMU11159PR_L1.htm?e=0"
base_doc     = Nokogiri::HTML(open("#{base_url}#{overall_page}"))

# parse list of provinces
provinces = []
base_doc.css('#listaLinks li a').each do |link|
  provinces << {:name => link.content, :page => link['href']}  
end

# main loop through each province
prov_muni = []
total_prov = provinces.size
provinces.each_with_index do |prov, i|  
  puts "#{i}/#{total_prov}\n"  # status
  
  # open the province page and iframe source for list of municipalities
  prov_doc = Nokogiri::HTML(open("#{base_url}#{prov[:page]}"))
  prov[:muni_list] = prov_doc.css('#frmmuni').first['src']
  
  # open municipalities iframe and extract all munipalities
  muni_list_doc = Nokogiri::HTML(open("#{base_url}#{prov[:muni_list]}"))
  muni_size = muni_list_doc.css('.divmuni ul li a').size
  
  # configure concurrent download of municipalities
  hydra       = Typhoeus::Hydra.new(:max_concurrency => 20)
  queued_requests = []
  
  # create one concurrent download job per municipality
  muni_list_doc.css('.divmuni ul li a').each_with_index do |muni_link, i|
    
    # specify url to download
    data_request = Typhoeus::Request.new("#{base_url}#{muni_link['href']}")
    
    # when the download has finished
    data_request.on_complete do |response|
      print '.' #status
    
      # setup    
      main_tmp = {:province_name      => prov[:name], 
                  :province_page      => "#{base_url}#{prov[:page]}", 
                  :municipality_name  => muni_link.content,
                  :municipality_page  => "#{base_url}#{muni_link['href']}"}                         
      muni_url    = main_tmp[:municipality_page]
      spain_count = {1 => 'primer', 2 => 'segundo', 3 => 'tercer'}      
      
      # parse the downloaded municipality document
      muni_doc = Nokogiri::HTML(response.body)      

      # extract distribution of votes
      muni_votes = []
      muni_doc.css(".cajaavancesdos.cajapeque #TVOTOS tbody tr:not(.noover)").each_with_index do |row, i|
        begin    
          if i < 3            
            counter = (spain_count[i+1] != nil) ? spain_count[i+1] : 'resto'              
            nombre  = row.css('th').first.content.strip
            votos   = row.css('td.vots').first.content.gsub('.','').strip
            porc    = row.css('td.porc').first.content.gsub(',','.').gsub(/(%)/,'').strip
            tmp = {"#{counter}_partido_nombre" => nombre,
                   "#{counter}_votos"          => votos,
                   "#{counter}_percent"        => porc.strip}

            begin
              tmp["#{counter}_dip"] = row.css('.dip').first.content.strip
              tmp["#{counter}_dip"] = 'unknown' if tmp["#{counter}_dip"] == ""
            rescue
              tmp["#{counter}_dip"] = 'unknown'            
            end                         
            
            muni_votes << tmp
          end  
        rescue
          puts "failed to get votes for #{row}: #{muni_url}"        
        end    
      end

      # extract distribution of turnout
      muni_turnout = []
      muni_doc.css(".cajadatosuno .datos1 tbody tr:not(.noover)").each_with_index do |row, i|
        begin
          key_name = row.css('th').first.content.chomp.gsub(/\s+/, "_").downcase.strip
          tmp = {
            "#{key_name}_number".to_sym  => row.css('td')[0].content.chomp.gsub('.','').strip,
            "#{key_name}_percent".to_sym => row.css('td')[1].content.chomp.gsub(',','.').gsub(/(%)/,'').strip
          }
          muni_turnout << tmp
        rescue Exception  => e       
          puts "#{e.message} #{e.backtrace.inspect}"
          muni_turnout << tmp        
        end    
      end

      # package together all the data into 1 big hash suitable for CSV
      begin
        muni_turnout << {} if muni_turnout.empty?
        muni_votes   << {} if muni_votes.empty?
        row_data      = muni_turnout.inject(:merge).merge(muni_votes.inject(:merge))
      rescue Exception => e 
        puts "failed merge for: #{muni_url}: #{muni_turnout}, #{muni_votes}"
        puts "exception: #{e.message}"
        puts "#{e.backtrace.inspect}"
      end  

      # finally, add concejales_a_elegir if present
      begin 
        row_data[:concejales_a_elegir] = muni_doc.css('#idCar').first.content.match(/\d+/).to_s
      rescue
        row_data[:concejales_a_elegir] = 'unknown'
      end  

      # return all the data mushed together with the province and municipality identifiers
      main_tmp.merge(row_data)  
    end
    
    # queue up concurrent request and maintain a record of data request to parse response
    hydra.queue data_request  
    queued_requests << data_request
  end  
  
  # fire concurrent download
  hydra.run
  
  # on complete of all downloads, iterate through the request objects and retrieve parsed data hash
  queued_requests.each_with_index do |req|
    prov_muni << req.handled_response
  end
end

# configure CSV output
headers   = prov_muni.first.keys
filename = "prov_muni.csv"
CSV.open(filename, "wb") do |csv|
  csv << headers
  
  prov_muni.each do |pm|
    row = []
    headers.each do |h|
      val = (pm[h].nil? || pm[h] == "") ? 'unknown' : pm[h]      
      row << val
    end  
    csv << row
  end
end

puts "done! Municipality data written to: #{filename}"