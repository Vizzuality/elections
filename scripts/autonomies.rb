# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb        = get_cartodb_connection
psoe_id, pp_id = get_psoe_pp_id
processes      = get_processes
autonomies     = get_autonomies
provinces      = get_provinces
variables      = get_variables

# votes per autonomy
votes_per_autonomy = cartodb.query("select votantes_totales, censo_total, gadm1_cartodb_id, proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent from #{AUTONOMIAS_VOTATIONS}")[:rows]

base_path = FileUtils.pwd
FileUtils.rm_rf("#{base_path}/../json/generated_data")
FileUtils.mkdir_p("#{base_path}/../json/generated_data")

## AUTONOMIES
#############

variables.each do |variable|
  processes.each do |process_hash|
    autonomies.each do |autonomy_hash|
      dir_path = "#{base_path}/../json/generated_data/#{process_hash[:anyo]}/autonomies/#{autonomy_hash[:name_1]}"
      FileUtils.mkdir_p(dir_path)
      json = {}
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
      fd = File.open("#{dir_path}/#{variable}.json",'w+')
      fd.write(json.to_json)
      fd.close
    end
  end
end
