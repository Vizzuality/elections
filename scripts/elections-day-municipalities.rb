# coding: UTF-8

require File.dirname(__FILE__) + "/common"
require "libxml"
require 'uri'
require 'logger'
require 'open-uri'
require 'csv'

include LibXML

require File.dirname(__FILE__) + "/elections-day/municipality-participation"
require File.dirname(__FILE__) + "/elections-day/municipality-votes"

rows = $cartodb.query("select cartodb_id, name, siglas from #{POLITICAL_PARTIES}")[:rows]
$parties_ids = rows.inject({}){ |h, row| h[row[:siglas]] = row[:cartodb_id]; h}
$parties = rows.inject({}){ |h, row| h[row[:cartodb_id]] = row[:name]; h}
$rparties = $parties.invert

block = ARGV[0].to_i

fd = File.open("inserts-#{block}.log", 'w+')

municipalities = CSV.read('elections-day/pueblos_reconciliados_lavinia_ine.csv', :headers => true, :return_headers => false, :encoding => 'UTF-8').inject({}) do |h,e| 
  h[e["union_url"]] = [e["cartodb_id"],e["ine_muni_int"],e["ine_prov_int"]]
  h
end

puts "Starting...."
File.read("urls/urls-#{block}.log").each_line do |raw_path|
  next if raw_path.include?('PARTICIPACION')
  puts "Parsing xmls/#{raw_path.split('/').last}"
  resultados_path = "xmls/#{raw_path.split('/').last}".strip
  participation_path = resultados_path.gsub(/RESULTADOS/,'PARTICIPACION')
  puts "Parsing #{participation_path}"
  next if !File.file?(resultados_path) || !File.file?(participation_path)
  
  url = raw_path.match(/-(([a-z\-]+){3})-/)[1]
  if municipalities[url].nil? || (municipalities[url][1].blank? || municipalities[url][2].blank?)
    puts "Skipping #{municipalities[url]}"
    next 
  end
  
  parser = XML::SaxParser.file(resultados_path)
  parser.callbacks = MunicipalityVotes.new(municipalities[url][0], municipalities[url][1], municipalities[url][2])
  parser.parse
  temporal_result = parser.callbacks.result
  parser = nil
  GC.start
  
  parser = XML::SaxParser.file(participation_path)
  parser.callbacks = MunicipalityParticipation.new
  parser.parse
  final_result = temporal_result.merge(parser.callbacks.result)
  names = []
  values = []
  final_result.each do |k,v|
    names << k
    values << (v.nil? ? "NULL" : v)
  end        
  fd.write "INSERT INTO votaciones_por_municipio (#{names.join(',')}) values (#{values.join(',')});"
  parser = nil
  GC.start
end

fd.close
