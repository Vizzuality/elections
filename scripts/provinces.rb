# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb        = get_cartodb_connection
processes      = get_processes
autonomies     = get_autonomies
provinces      = get_provinces
variables      = get_variables(2)
parties        = get_parties
parties_known  = get_known_parties(parties)

query = <<-SQL
select votantes_totales, censo_total, #{PROVINCES_VOTATIONS}.gadm2_cartodb_id, proceso_electoral_id, 
       primer_partido_id, primer_partido_percent, tercer_partido_id, 
       segundo_partido_id, segundo_partido_percent, tercer_partido_percent,
       censo_total, votantes_totales, resto_partido_percent,
       #{variables.join(',')}
from #{PROVINCES_VOTATIONS}, vars_socioeco_x_provincia
where #{PROVINCES_VOTATIONS}.gadm2_cartodb_id = vars_socioeco_x_provincia.gadm2_cartodb_id
SQL
votes_per_province = cartodb.query(query)[:rows]

base_path = FileUtils.pwd
FileUtils.mkdir_p("#{base_path}/../json/generated_data")

### PROVINCES
#############
puts
dir_path = "#{base_path}/../json/generated_data/provincias"
evolution = {}
FileUtils.mkdir_p(dir_path)
variables.each do |variable|
  puts
  puts "Variable: #{variable}"
  custom_variable_name = variable.gsub(/_\d+/,'')
  evolution[custom_variable_name] ||= {} 
  all_evolutions = get_provinces_variable_evolution(custom_variable_name)
  unless proceso_electoral_id = processes[variable.match(/\d+/)[0].to_i]  
    year = variable.match(/\d+/)[0].to_i - 1
    while proceso_electoral_id.nil? && year > 1974
      proceso_electoral_id = processes[year]
      year -= 1
    end
  end
  next if year == 1974
  autonomies.each do |autonomy_hash|
    autonomy_name = autonomy_hash[:name_1].tr(' ','_')    
    authonomy_results = get_authonomy_results(autonomy_hash[:name_1], proceso_electoral_id)
    max_y = votes_per_province.map{ |h| h[variable.to_sym ].to_f }.compact.max
    min_y = votes_per_province.map{ |h| h[variable.to_sym ].to_f }.compact.min
    max_x = votes_per_province.select{|h| h[:proceso_electoral_id] == proceso_electoral_id }.map{|h| h[:primer_partido_percent].to_f - h[:segundo_partido_percent].to_f }.compact.max
    json = {}
    provinces.select{ |p| p[:id_1] == autonomy_hash[:id_1] }.each do |province|
      row = votes_per_province.select{|h| h[:gadm2_cartodb_id] == province[:cartodb_id] && h[:proceso_electoral_id] == proceso_electoral_id }.first
      unless row
        putc 'x'
        next
      end
      putc '.'
      province_name = province[:name_2].tr(' ','_')
      evolution[custom_variable_name][province[:name_2]] ||= all_evolutions[province[:name_2]]
      json[province_name] ||= {}
      json[province_name][:cartodb_id]   = province[:cartodb_id]
      json[province_name][:x_coordinate] = x_coordinate = get_x_coordinate(row, max_x, parties_known)
      json[province_name][:y_coordinate] = get_y_coordinate(row, variable.to_sym, max_y, min_y)
      json[province_name][:radius]       = get_radius(row)
      json[province_name][:color]        = get_color(row, x_coordinate, parties)
      json[province_name][:children_json_url] = municipalities_path(province_name,variable)
      json[province_name][:censo_total]  = row[:censo_total]
      json[province_name][:porcentaje_participacion] = ("%.2f" % (row[:votantes_totales].to_f / row[:censo_total].to_f * 100.0)).to_f
      json[province_name][:partido_1] = [parties[row[:primer_partido_id]], row[:primer_partido_percent].to_f]
      json[province_name][:partido_2] = [parties[row[:segundo_partido_id]],row[:segundo_partido_percent].to_f]
      json[province_name][:partido_3] = [parties[row[:tercer_partido_id]], row[:tercer_partido_percent].to_f]
      json[province_name][:resto_partidos_percent] = row[:resto_partido_percent]
      json[province_name][:info] = ""
      json[province_name][:parent] = [autonomy_name]
      json[province_name][:parent_url] = [autonomies_path(variable)]
      json[province_name][:parent_results] = authonomy_results
      json[province_name][:evolution] = evolution[custom_variable_name][province[:name_2]].join(',')
    end
    fd = File.open('../' + provinces_path(autonomy_name,variable),'w+')
    fd.write(json.to_json)
    fd.close        
  end
end
