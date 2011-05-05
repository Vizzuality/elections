# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb        = get_cartodb_connection
processes      = get_processes
autonomies     = get_autonomies
provinces      = get_provinces
variables      = get_variables(1)
psoe_id, pp_id = get_psoe_pp_id

# votes per autonomy
query = <<-SQL
select votantes_totales, censo_total, #{AUTONOMIAS_VOTATIONS}.gadm1_cartodb_id, proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent,
       #{variables.join(',')}
from #{AUTONOMIAS_VOTATIONS}, vars_socioeco_x_autonomia
where #{AUTONOMIAS_VOTATIONS}.gadm1_cartodb_id = vars_socioeco_x_autonomia.gadm1_cartodb_id
SQL

votes_per_autonomy = cartodb.query(query)[:rows]

base_path = FileUtils.pwd
FileUtils.mkdir_p("#{base_path}/../json/generated_data")

## AUTONOMIES
#############
puts
variables.each do |variable|
  puts
  puts "Variable: #{variable}"
  proceso_electoral_id = processes[variable.match(/\d+/)[0].to_i]  
  max_y = votes_per_autonomy.map{ |h| h[variable.to_sym ] }.max
  max_x = votes_per_autonomy.select{|h| h[:proceso_electoral_id] == proceso_electoral_id }.map{|h| h[:primer_partido_percent].to_f - h[:segundo_partido_percent].to_f }.max
  json = {}
  autonomies.each do |autonomy_hash|
    dir_path = "#{base_path}/../json/generated_data"
    unless row = votes_per_autonomy.select{|h| h[:gadm1_cartodb_id] == autonomy_hash[:cartodb_id] && h[:proceso_electoral_id] == proceso_electoral_id }.first
      putc 'x'
      next
    end
    putc '.'
    autonomy_name = autonomy_hash[:name_1].tr(' ','_')
    json[autonomy_name] ||= {}
    json[autonomy_name][:cartodb_id]   = autonomy_hash[:cartodb_id]
    json[autonomy_name][:x_coordinate] = x_coordinate = get_x_coordinate(row, max_x, psoe_id, pp_id)
    json[autonomy_name][:y_coordinate] = get_y_coordinate(row, variable.to_sym, max_y)
    json[autonomy_name][:radius]       = get_radius(row)
    json[autonomy_name][:color]        = get_color(x_coordinate)
    json[autonomy_name][:children_json_url] = provinces_path(autonomy_name,variable)[3..-1] # hack to remove ../ from path
  end
  fd = File.open(autonomies_path(variable),'w+')
  fd.write(json.to_json)
  fd.close
end

puts 