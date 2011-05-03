# coding: UTF-8

# # rtve
# 
# - Crear por años
# - JSON de autonomías (gadm1), provincias (gadm2) y municipios (gadm4)
# - Campos:
#   - nombre
#   - resultados electorales:
#     - quién ha ganado
#     - con cuánta diferencia
#   - url al padre
#   - url de los hijos
#   - eje Y: variación respecto a la media
#   - radio bola: nº de votantes / nº de habitantes normalizado (20 - 80) votantes_totales / censo_total

require "rubygems"
require "bundler/setup"
require "cartodb-rb-client"

# Tables names
POLITICAL_PARTIES     = "partidos_politicos"
PROCESOS_NAME         = "procesos_electorales"
AUTONOMIAS_TABLE      = "gadm1"
AUTONOMIAS_VOTATIONS  = "votaciones_por_autonomia"
PROVINCES_TABLE       = "gadm2"
#####

CartoDB::Settings = YAML.load_file('cartodb_config.yml')
cartodb = CartoDB::Client::Connection.new

# political parties
political_parties = cartodb.query("select cartodb_id, name from #{POLITICAL_PARTIES}")[:rows]
psoe_id = political_parties.select{ |h| h[:name] == "PSOE"}.first[:cartodb_id].to_i
pp_id   = political_parties.select{ |h| h[:name] == "PP"}.first[:cartodb_id].to_i

# years from the processes
processes = cartodb.query("select cartodb_id, anyo from #{PROCESOS_NAME}")[:rows]

# autonomies
autonomies = cartodb.query("select cartodb_id, id_1, name_1 from #{AUTONOMIAS_TABLE}")[:rows]

# provinces
provinces = cartodb.query("select cartodb_id, id_1, id_2, name_2 from #{PROVINCES_TABLE}")[:rows]

# votes per autonomy
votes_per_autonomy = cartodb.query("select votantes_totales, censo_total, gadm1_cartodb_id, proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent from #{AUTONOMIAS_VOTATIONS}")[:rows]

variables = [:age, :pib]

base_path = FileUtils.pwd
FileUtils.rm_rf("#{base_path}/../json/generated_data")
FileUtils.mkdir_p("#{base_path}/../json/generated_data")

variables.each do |variable|
  processes.each do |process_hash|
    dir_path = "#{base_path}/../json/generated_data/#{process_hash[:anyo]}/autonomies"
    FileUtils.mkdir_p(dir_path)
    puts "Generating JSON #{dir_path}/#{variable}.json"
    json = {}
    autonomies.each do |autonomy_hash|
      row = votes_per_autonomy.select{|h| h[:gadm1_cartodb_id] == autonomy_hash[:cartodb_id] && h[:proceso_electoral_id] == process_hash[:cartodb_id] }.first
      if row[:primer_partido_id].to_i != psoe_id && row[:primer_partido_id].to_i != pp_id
        x_coordinate = 0
      else
        x_coordinate = ((row[:primer_partido_percent] - row[:segundo_partido_percent]).to_f * 300.0) / 100.0
        x_coordinate = x_coordinate*-1 if row[:primer_partido_id] == psoe_id
      end
      radius = ((row[:votantes_totales].to_f / row[:censo_total].to_f) * 6000.0) / 100.0 + 20.0
      json[autonomy_hash[:name_1]] ||= {}
      json[autonomy_hash[:name_1]][:cartodb_id] = autonomy_hash[:cartodb_id]
      json[autonomy_hash[:name_1]][:x_coordinate] = x_coordinate
      json[autonomy_hash[:name_1]][:y_coordinate] = (rand(100.0) * rand(3)) + rand(10.0)
      json[autonomy_hash[:name_1]][:radius] = radius.to_i
      json[autonomy_hash[:name_1]][:parent_json_url] = nil
      json[autonomy_hash[:name_1]][:children_json_url] = []
      provinces.select{ |p| p[:id_1] == autonomy_hash[:id_1] }.each do |province|
        json[autonomy_hash[:name_1]][:children_json_url] << "json/#{process_hash[:anyo]}/autonomies/#{autonomy_hash[:name_1]}/provinces/#{province[:name_2]}.json"
      end
    end
    fd = File.open("../#{dir_path}/#{variable}.json",'w+')
    fd.write(json.to_json)
    fd.close
  end
end
