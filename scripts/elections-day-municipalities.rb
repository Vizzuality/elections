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

municipality_id = ARGV[0].to_i

fd = File.open("inserts-#{municipality_id}.log", 'w+')

municipalities = CSV.read("elections-day/matching-with-municipalities.csv", :encoding => "".encoding).inject({}) do |h,e| 
  h[e.first] = [e[1],e[2],e[3]]
  h
end

puts "Starting...."
File.read("urls/urls-#{municipality_id}.txt").each_line do |raw_path|
  next if raw_path.include?('PARTICIPACION')
  puts "Parsing xmls/#{raw_path.split('/').last}"
  resultados_path = "xmls/#{raw_path.split('/').last}".strip
  participation_path = resultados_path.gsub(/RESULTADOS/,'PARTICIPACION')
  puts "Parsing #{participation_path}"
  
  next if !File.file?(resultados_path) || !File.file?(participation_path)
  
  url = raw_path.strip
  municipio_id, codineprov, codinemuni = municipalities[url]
  
  raise "Erro! url not found (#{url}) in municipio_id #{municipio_id}" if municipalities[url].nil?
  
  parser = XML::SaxParser.file(resultados_path)
  parser.callbacks = MunicipalityVotes.new(municipio_id, codinemuni, codineprov)
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
