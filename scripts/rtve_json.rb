# coding: UTF-8

require "rubygems"
require "bundler/setup"
require "cartodb-rb-client"
require "ruby-debug"
require "net/https"
require 'uri'

# Tables names
POLITICAL_PARTIES     = "partidos_politicos"
PROCESOS_NAME         = "procesos_electorales"
AUTONOMIAS_TABLE      = "gadm1"
AUTONOMIAS_VOTATIONS  = "votaciones_por_autonomia"
PROVINCES_TABLE       = "gadm2"
PROVINCES_VOTATIONS   = "votaciones_por_provincia"
MUNICIPALITIES_TABLE  = "gadm4"
MUNICIPALITIES_VOTATIONS = "votaciones_por_municipio"
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

# municipalities
# municipalities = cartodb.query("select cartodb_id, id_2, id_4, name_4 from #{MUNICIPALITIES_TABLE}")[:rows]

# votes per autonomy
votes_per_autonomy = cartodb.query("select votantes_totales, censo_total, gadm1_cartodb_id, proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent from #{AUTONOMIAS_VOTATIONS}")[:rows]

# votes per autonomy
votes_per_province = cartodb.query("select votantes_totales, censo_total, gadm2_cartodb_id, proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent from #{PROVINCES_VOTATIONS}")[:rows]

# votes per municipality
# votes_per_municipality = cartodb.query("select votantes_totales, censo_total, gadm4_cartodb_id, proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent from #{MUNICIPALITIES_VOTATIONS}")[:rows]

variables = [:age, :pib]

base_path = FileUtils.pwd
FileUtils.rm_rf("#{base_path}/../json/generated_data")
FileUtils.mkdir_p("#{base_path}/../json/generated_data")

### AUTONOMIES
##############
# 
# variables.each do |variable|
#   processes.each do |process_hash|
#     autonomies.each do |autonomy_hash|
#       dir_path = "#{base_path}/../json/generated_data/#{process_hash[:anyo]}/autonomies/#{autonomy_hash[:name_1]}"
#       FileUtils.mkdir_p(dir_path)
#       json = {}
#       row = votes_per_autonomy.select{|h| h[:gadm1_cartodb_id] == autonomy_hash[:cartodb_id] && h[:proceso_electoral_id] == process_hash[:cartodb_id] }.first
#       if row[:primer_partido_id].to_i != psoe_id && row[:primer_partido_id].to_i != pp_id
#         x_coordinate = 0
#       else
#         x_coordinate = ((row[:primer_partido_percent] - row[:segundo_partido_percent]).to_f * 300.0) / 100.0
#         x_coordinate = x_coordinate*-1 if row[:primer_partido_id] == psoe_id
#       end
#       radius = ((row[:votantes_totales].to_f / row[:censo_total].to_f) * 6000.0) / 100.0 + 20.0
#       json[autonomy_hash[:name_1]] ||= {}
#       json[autonomy_hash[:name_1]][:cartodb_id] = autonomy_hash[:cartodb_id]
#       json[autonomy_hash[:name_1]][:x_coordinate] = x_coordinate
#       json[autonomy_hash[:name_1]][:y_coordinate] = (rand(100.0) * rand(3)) + rand(10.0)
#       json[autonomy_hash[:name_1]][:radius] = radius.to_i
#       json[autonomy_hash[:name_1]][:parent_json_url] = nil
#       json[autonomy_hash[:name_1]][:children_json_url] = []
#       provinces.select{ |p| p[:id_1] == autonomy_hash[:id_1] }.each do |province|
#         json[autonomy_hash[:name_1]][:children_json_url] << "json/#{process_hash[:anyo]}/autonomies/#{autonomy_hash[:name_1]}/provinces/#{province[:name_2]}.json"
#       end
#       fd = File.open("#{dir_path}/#{variable}.json",'w+')
#       fd.write(json.to_json)
#       fd.close
#     end
#   end
# end
# 
# 
# ### PROVINCES
# #############
# 
# variables.each do |variable|
#   processes.each do |process_hash|
#     autonomies.each do |autonomy_hash|
#       provinces.select{ |p| p[:id_1] == autonomy_hash[:id_1] }.each do |province|
#         dir_path = "#{base_path}/../json/generated_data/#{process_hash[:anyo]}/autonomies/#{autonomy_hash[:name_1]}/provinces/#{province[:name_2]}"
#         FileUtils.mkdir_p(dir_path)
#         json = {}
#         row = votes_per_province.select{|h| h[:gadm2_cartodb_id] == province[:cartodb_id] && h[:proceso_electoral_id] == process_hash[:cartodb_id] }.first
#         if row[:primer_partido_id].to_i != psoe_id && row[:primer_partido_id].to_i != pp_id
#           x_coordinate = 0
#         else
#           x_coordinate = ((row[:primer_partido_percent] - row[:segundo_partido_percent]).to_f * 300.0) / 100.0
#           x_coordinate = x_coordinate*-1 if row[:primer_partido_id] == psoe_id
#         end
#         radius = ((row[:votantes_totales].to_f / row[:censo_total].to_f) * 6000.0) / 100.0 + 20.0
#         json[province[:name_2]] ||= {}
#         json[province[:name_2]][:cartodb_id] = province[:cartodb_id]
#         json[province[:name_2]][:x_coordinate] = x_coordinate
#         json[province[:name_2]][:y_coordinate] = (rand(100.0) * rand(3)) + rand(10.0)
#         json[province[:name_2]][:radius] = radius.to_i
#         json[province[:name_2]][:parent_json_url] = nil
#         fd = File.open("#{dir_path}/#{variable}.json",'w+')
#         fd.write(json.to_json)
#         fd.close        
#       end
#     end
#   end
# end

### MUNICIPALITIES
#############
puts

oauth_token = "oauth_token=#{cartodb.send(:access_token).token}"

uri = URI.parse('https://api.cartodb.com/')


municipalities_not_found = 0
autonomies.each do |autonomy_hash|
  provinces.select{ |p| p[:id_1] == autonomy_hash[:id_1] }.each do |province|
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    request = Net::HTTP::Get.new("/v1?sql=#{CGI.escape("select cartodb_id, id_2, id_4, name_4 from #{MUNICIPALITIES_TABLE} where id_2 = #{province[:id_2]}")}&#{oauth_token}")
    response = http.request(request)
    municipalities = JSON.parse(response.body)["rows"]
    municipalities.each do |municipality|
      query = <<-SQL
select votantes_totales, censo_total, gadm4_cartodb_id, proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent 
from #{MUNICIPALITIES_VOTATIONS}
where gadm4_cartodb_id = #{municipality['cartodb_id']}
SQL
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request = Net::HTTP::Get.new("/v1?sql=#{CGI.escape(query.strip)}&#{oauth_token}")
      response = http.request(request)
      votes_per_municipality = JSON.parse(response.body)["rows"]
      processes.each do |process_hash|
        dir_path = "#{base_path}/../json/generated_data/#{process_hash[:anyo]}/autonomies/#{autonomy_hash[:name_1]}/provinces/#{province[:name_2]}/municipalities/#{municipality['name_4']}"
        FileUtils.mkdir_p(dir_path)
        unless row = votes_per_municipality.select{|h| h["gadm4_cartodb_id"] == municipality['cartodb_id'] && h["proceso_electoral_id"] == process_hash[:cartodb_id] }.first
          municipalities_not_found += 1
          putc 'x'
          next
        end
        putc '.'
        if row["primer_partido_id"].to_i != psoe_id && row["primer_partido_id"].to_i != pp_id
          x_coordinate = 0
        else
          x_coordinate = ((row["primer_partido_percent"] - row["segundo_partido_percent"]).to_f * 300.0) / 100.0
          x_coordinate = x_coordinate*-1 if row["primer_partido_id"] == psoe_id
        end
        radius = ((row["votantes_totales"].to_f / row["censo_total"].to_f) * 6000.0) / 100.0 + 20.0
        variables.each do |variable|
          json = {}
          json[municipality["name_4"]] ||= {}
          json[municipality["name_4"]]["cartodb_id"] = municipality["cartodb_id"]
          json[municipality["name_4"]]["x_coordinate"] = x_coordinate
          json[municipality["name_4"]]["y_coordinate"] = (rand(100.0) * rand(3)) + rand(10.0)
          json[municipality["name_4"]]["radius"] = radius.to_i
          json[municipality["name_4"]]["parent_json_url"] = nil
          fd = File.open("#{dir_path}/#{variable}.json",'w+')
          fd.write(json.to_json)
          fd.close        
        end
      end
    end
  end
end

puts "Not found #{municipalities_not_found} municipalities"
