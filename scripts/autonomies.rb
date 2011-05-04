# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb        = get_cartodb_connection
psoe_id, pp_id = get_psoe_pp_id
processes      = get_processes
autonomies     = get_autonomies
provinces      = get_provinces
variables      = get_variables(1)

# votes per autonomy
query = <<-SQL
select votantes_totales, censo_total, #{AUTONOMIAS_VOTATIONS}.gadm1_cartodb_id, proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent,
       #{variables.join(',')}
from #{AUTONOMIAS_VOTATIONS}, vars_socioeco_x_autonomia
where #{AUTONOMIAS_VOTATIONS}.gadm1_cartodb_id = vars_socioeco_x_autonomia.gadm1_cartodb_id
SQL

votes_per_autonomy = cartodb.query(query)[:rows]

base_path = FileUtils.pwd
FileUtils.rm_rf("#{base_path}/../json/generated_data")
FileUtils.mkdir_p("#{base_path}/../json/generated_data")

## AUTONOMIES
#############
puts
variables.each do |variable|
  puts
  puts "Variable: #{variable}"
  json = {}
  autonomies.each do |autonomy_hash|
    dir_path = "#{base_path}/../json/generated_data"
    proceso_electoral_id = processes[variable.match(/\d+/)[0].to_i]
    row = votes_per_autonomy.select{|h| h[:gadm1_cartodb_id] == autonomy_hash[:cartodb_id] && h[:proceso_electoral_id] == proceso_electoral_id }.first
    unless row
      putc 'x'
      next
    end
    putc '.'
    if row[:primer_partido_id].to_i != psoe_id && row[:primer_partido_id].to_i != pp_id
      x_coordinate = 0
    else
      x_coordinate = ((row[:primer_partido_percent] - row[:segundo_partido_percent]).to_f * 300.0) / 100.0
      x_coordinate = x_coordinate*-1 if row[:primer_partido_id] == psoe_id
    end
    radius = ((row[:votantes_totales].to_f / row[:censo_total].to_f) * 6000.0) / 100.0 + 20.0
    autonomy_name = autonomy_hash[:name_1].tr(' ','_')
    json[autonomy_name] ||= {}
    json[autonomy_name][:cartodb_id] = autonomy_hash[:cartodb_id]
    json[autonomy_name][:x_coordinate] = x_coordinate
    json[autonomy_name][:y_coordinate] = get_y_coordinate(row, variable.to_sym)
    json[autonomy_name][:radius] = radius.to_i
    json[autonomy_name][:color] = "#D94B5F"
    json[autonomy_name][:parent_json_url] = nil
    json[autonomy_name][:children_json_url] = []
    fd = File.open("#{dir_path}/autonomies_#{variable}.json",'w+')
    fd.write(json.to_json)
    fd.close
  end
end
