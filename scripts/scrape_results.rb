# # encoding: UTF-8
# 
# 
# require 'rubygems'
# require 'pg'
# require 'typhoeus'
# require 'json'
# require 'fileutils'
# require 'nokogiri'
# require 'open-uri'
# require 'csv'
# 
# 
# base_url = "http://resultados2011.mir.es/99MU/"
# overall_page = "DMU11159PR_L1.htm?e=0"
# base_doc = Nokogiri::HTML(open("#{base_url}#{overall_page}"))
# 
# provinces = []
# base_doc.css('#listaLinks li a').each do |link|
#   provinces << {:name => link.content, :page => link['href']}
# end
# 
# # get iframe with municipalities
# prov_muni = []
# total_prov = provinces.size
# 
# # spinner
# cr = "\r"           
# clear = "\e[0K"     
# reset = cr + clear
#  
# #bad = [8, 32, 33, 43, 48, 51] 
# #bad = [8]
#  
# provinces.each_with_index do |prov, i|
#   #next unless bad.include? i
#   
#   puts "#{i}/#{total_prov}"
#   
#   prov_doc = Nokogiri::HTML(open("#{base_url}#{prov[:page]}"))
#   prov[:muni_list] = prov_doc.css('#frmmuni').first['src']
#   muni_list_doc = Nokogiri::HTML(open("#{base_url}#{prov[:muni_list]}"))
#   muni_size = muni_list_doc.css('.divmuni ul li a').size
#   
#   muni_list_doc.css('.divmuni ul li a').each_with_index do |muni_link, i|
#     main_tmp = {:province_name => prov[:name], 
#            :province_page => "#{base_url}#{prov[:page]}", 
#            :municipality_name => muni_link.content,
#            :municipality_page => "#{base_url}#{muni_link['href']}"}    
#     
#     muni_url = main_tmp[:municipality_page]
#     muni_doc = Nokogiri::HTML(open(muni_url))
#     print "#{reset}#{i}/#{muni_size}"
#      
#     # distribution of votes
#     muni_votes = []
#     spain_count = {1 => 'primer', 2 => 'segundo', 3 => 'tercer'}
#     muni_doc.css(".cajaavancesdos.cajapeque #TVOTOS tbody tr:not(.noover)").each_with_index do |row, i|
#       begin    
#         if i < 3
#           
#           counter = (spain_count[i+1] != nil) ? spain_count[i+1] : 'resto'  
#           # puts muni_url
#           votos =  row.css('td.vots').first.content.gsub('.','')
#           porc  =  row.css('td.porc').first.content.gsub(',','.').gsub(/(%)/,'')
#           tmp = {"#{counter}_partido_nombre" => row.css('th').first.content.strip,
#                  "#{counter}_votos" => votos.strip,
#                  "#{counter}_percent" => porc.strip
#                 }
#           begin
#             tmp["#{counter}_dip"] = row.css('.dip').first.content.strip
#             tmp["#{counter}_dip"] = 'unknown' if tmp["#{counter}_dip"] == ""
#           rescue
#             tmp["#{counter}_dip"] = 'unknown'            
#           end                         
#           muni_votes << tmp
#         end  
#       rescue
#         puts "failed to get votes for #{row}: #{muni_url}"        
#       end    
#     end
# 
#     muni_turnout = []
#     muni_doc.css(".cajadatosuno .datos1 tbody tr:not(.noover)").each_with_index do |row, i|
#       begin
#          tmp = {
#             "#{row.css('th').first.content.chomp.gsub(/\s+/, "_").downcase.strip}_number".to_sym => row.css('td')[0].content.chomp.gsub('.','').strip,
#             "#{row.css('th').first.content.chomp.gsub(/\s+/, "_").downcase.strip}_percent".to_sym => row.css('td')[1].content.chomp.gsub(',','.').gsub(/(%)/,'').strip
#           }
#         muni_turnout << tmp
#       rescue Exception  => e       
#         puts "#{e.message} #{e.backtrace.inspect}"
#         muni_turnout << tmp        
#       end    
#     end
# 
#     begin
#       muni_turnout << {} if muni_turnout.empty?
#       muni_votes   << {} if muni_votes.empty?
#       row_data = muni_turnout.inject(:merge).merge(muni_votes.inject(:merge))
#     rescue Exception => e 
#       puts "failed merge for: #{muni_url}: #{muni_turnout}, #{muni_votes}"
#       puts "exception: #{e.message}"
#       puts "#{e.backtrace.inspect}"
#     end  
#     
#     begin 
#       row_data[:concejales_a_elegir] = muni_doc.css('#idCar').first.content.match(/\d+/).to_s
#     rescue
#       row_data[:concejales_a_elegir] = 'unknown'
#     end  
#     
#     prov_muni << main_tmp.merge(row_data)
#   end            
# end
# 
# headers = prov_muni.first.keys
# CSV.open("prov_muni.csv", "wb") do |csv|
#   csv << headers
#   
#   prov_muni.each do |pm|
#     row = []
#     headers.each do |h|
#       val = (pm[h].nil? || pm[h].match(/\s+/)) ? 'unknown' : pm[h]      
#       row << val
#     end  
#     csv << row
#   end
# end
# 
# 
# # prov_muni = []
# # 
# # base_doc.css('#listaLinks li a').each do |link|
# #   provinces << {:name => link.content, :page => link['href']}
# # end


# encoding: UTF-8


require 'rubygems'
require 'pg'
require 'typhoeus'
require 'json'
require 'fileutils'
require 'nokogiri'
require 'open-uri'
require 'csv'


base_url = "http://resultados2011.mir.es/99MU/"
overall_page = "DMU11159PR_L1.htm?e=0"
base_doc = Nokogiri::HTML(open("#{base_url}#{overall_page}"))

provinces = []
base_doc.css('#listaLinks li a').each do |link|
  provinces << {:name => link.content, :page => link['href']}  
end


# get iframe with municipalities
prov_muni = []
total_prov = provinces.size

# spinner
cr = "\r"           
clear = "\e[0K"     
reset = cr + clear
 
#bad = [8, 32, 33, 43, 48, 51] 
#bad = [8]
 
provinces.each_with_index do |prov, i|
 # next unless bad.include? i
  
  puts "#{i}/#{total_prov}"
  
  prov_doc = Nokogiri::HTML(open("#{base_url}#{prov[:page]}"))
  prov[:muni_list] = prov_doc.css('#frmmuni').first['src']
  muni_list_doc = Nokogiri::HTML(open("#{base_url}#{prov[:muni_list]}"))
  muni_size = muni_list_doc.css('.divmuni ul li a').size
  
  # get concurrent within a province
  hydra       = Typhoeus::Hydra.new(:max_concurrency => 20)
  queued_requests = []
  muni_list_doc.css('.divmuni ul li a').each_with_index do |muni_link, i|

    data_request = Typhoeus::Request.new("#{base_url}#{muni_link['href']}")
    data_request.on_complete do |response|
      print '.'
      
      main_tmp = {:province_name => prov[:name], 
                 :province_page => "#{base_url}#{prov[:page]}", 
                 :municipality_name => muni_link.content,
                 :municipality_page => "#{base_url}#{muni_link['href']}"}        
                 
      muni_url = main_tmp[:municipality_page]
      muni_doc = Nokogiri::HTML(response.body)      

      # distribution of votes
      muni_votes = []
      spain_count = {1 => 'primer', 2 => 'segundo', 3 => 'tercer'}
      muni_doc.css(".cajaavancesdos.cajapeque #TVOTOS tbody tr:not(.noover)").each_with_index do |row, i|
        begin    
          if i < 3

            counter = (spain_count[i+1] != nil) ? spain_count[i+1] : 'resto'  
            # puts muni_url
            votos =  row.css('td.vots').first.content.gsub('.','')
            porc  =  row.css('td.porc').first.content.gsub(',','.').gsub(/(%)/,'')
            tmp = {"#{counter}_partido_nombre" => row.css('th').first.content.strip,
                   "#{counter}_votos" => votos.strip,
                   "#{counter}_percent" => porc.strip
                  }
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

      muni_turnout = []
      muni_doc.css(".cajadatosuno .datos1 tbody tr:not(.noover)").each_with_index do |row, i|
        begin
           tmp = {
              "#{row.css('th').first.content.chomp.gsub(/\s+/, "_").downcase.strip}_number".to_sym => row.css('td')[0].content.chomp.gsub('.','').strip,
              "#{row.css('th').first.content.chomp.gsub(/\s+/, "_").downcase.strip}_percent".to_sym => row.css('td')[1].content.chomp.gsub(',','.').gsub(/(%)/,'').strip
            }
          muni_turnout << tmp
        rescue Exception  => e       
          puts "#{e.message} #{e.backtrace.inspect}"
          muni_turnout << tmp        
        end    
      end

      begin
        muni_turnout << {} if muni_turnout.empty?
        muni_votes   << {} if muni_votes.empty?
        row_data = muni_turnout.inject(:merge).merge(muni_votes.inject(:merge))
      rescue Exception => e 
        puts "failed merge for: #{muni_url}: #{muni_turnout}, #{muni_votes}"
        puts "exception: #{e.message}"
        puts "#{e.backtrace.inspect}"
      end  

      begin 
        row_data[:concejales_a_elegir] = muni_doc.css('#idCar').first.content.match(/\d+/).to_s
      rescue
        row_data[:concejales_a_elegir] = 'unknown'
      end  

      main_tmp.merge(row_data)  
    end
    hydra.queue data_request  
    queued_requests << data_request
  end  
  hydra.run
  
  queued_requests.each_with_index do |req|
    prov_muni << req.handled_response
  end
end

headers = prov_muni.first.keys
CSV.open("prov_muni_hydra.csv", "wb") do |csv|
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


# prov_muni = []
# 
# base_doc.css('#listaLinks li a').each do |link|
#   provinces << {:name => link.content, :page => link['href']}
# end
