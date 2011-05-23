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
prov_array = []
total_prov = provinces.size
spain_count = {1 => 'primer', 2 => 'segundo', 3 => 'tercer'}

provinces.each_with_index do |prov, i|
  puts "#{i}/#{total_prov}"
  
  prov_doc = Nokogiri::HTML(open("#{base_url}#{prov[:page]}"))
    
  prov_doc.css('#TVOTOS tbody tr:not(.noover)').each_with_index do |row, i|
    if i < 3
      counter = (spain_count[i+1] != nil) ? spain_count[i+1] : 'resto'  

      tmp = {"#{counter}_partido_nombre" => row.css('th').first.content,
             "#{counter}_alcaldes_absoluta" => row.css('.dip')[0].content.gsub('.',''),
             "#{counter}_alcaldes_relativa" => row.css('.dip')[1].content.gsub('.',''),
             "#{counter}_alcaldes_empate"   => row.css('.dip')[2].content.gsub('.','')               
            }
      tmp["#{counter}_alcaldes_total"] = tmp["#{counter}_alcaldes_absoluta"].to_i + tmp["#{counter}_alcaldes_relativa"].to_i + tmp["#{counter}_alcaldes_empate"].to_i     
            
      prov_array << tmp
    end      
  end        
  prov.merge!(prov_array.inject(:merge))
end

headers = provinces.first.keys
CSV.open("prov.csv", "wb") do |csv|
  csv << headers
  
  provinces.each do |p|
    csv << p.values
  end
end