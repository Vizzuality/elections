# coding: UTF-8

require File.dirname(__FILE__) + "/common"

base_path = FileUtils.pwd
version_path = "#{base_path}/../graphs/provincias/#{$graphs_next_version}"
current_path = "#{base_path}/../graphs/provincias/current"
FileUtils.mkdir_p(version_path)
FileUtils.rm(current_path)
FileUtils.ln_s version_path, current_path, :force => true


cartodb        = get_cartodb_connection
processes      = get_processes
autonomies     = get_autonomies
provinces      = get_provinces
real_variables, fake_variables = get_variables(2)
parties        = get_parties
parties_known  = get_known_parties(parties)

query = <<-SQL
select votantes_totales, censo_total, #{PROVINCES_VOTATIONS}.gadm2_cartodb_id, proceso_electoral_id, lavinia_url,
       primer_partido_id, primer_partido_votos, tercer_partido_id, 
       segundo_partido_id, segundo_partido_votos, tercer_partido_votos,
       censo_total, votantes_totales, resto_partido_votos,
       #{real_variables.join(',')}
from #{PROVINCES_VOTATIONS}, vars_socioeco_x_provincia, gadm2
where #{PROVINCES_VOTATIONS}.gadm2_cartodb_id = vars_socioeco_x_provincia.gadm2_cartodb_id and #{PROVINCES_VOTATIONS}.gadm2_cartodb_id = gadm2.cartodb_id
SQL
votes_per_province = cartodb.query(query)[:rows]


### PROVINCES
#############
puts
evolution = {}
# variables_json = {}
(fake_variables + real_variables).each do |variable|
  if real_variables.include?(variable)
    is_real_variable = true
  else
    is_real_variable = false
  end
  year = nil
  puts
  custom_variable_name = variable.gsub(/_\d+$/,'')
  
  if !is_real_variable
    real_variable = real_variables.select{ |v| v.include?(custom_variable_name) }.sort.max
  else
    real_variable = variable
  end
  
  # variables_json[custom_variable_name] ||= []
  evolution[custom_variable_name] ||= {} 
  all_evolutions = get_provinces_variable_evolution(custom_variable_name)
  unless proceso_electoral_id = processes[variable.match(/\d+$/)[0].to_i]  
    year = variable.match(/\d+$/)[0].to_i
    while proceso_electoral_id.nil? && year > 1974
      year -= 1
      proceso_electoral_id = processes[year]
    end
  end
  next if year == 1974 || proceso_electoral_id.nil?
  year ||= variable.match(/\d+$/)[0].to_i
  puts "Variable: #{variable} - #{year} - #{proceso_electoral_id} - #{(!is_real_variable ? "Found fake variable. Real variable is #{real_variable}" : "")}"
  # variables_json[custom_variable_name] << variable.match(/\d+$/)[0].to_i
  autonomies.each do |autonomy_hash|
    autonomy_name = autonomy_hash[:name_1].normalize
    authonomy_results = get_authonomy_results(autonomy_name, year, autonomy_hash[:name_1], proceso_electoral_id)
    max_y = votes_per_province.map{ |h| h[real_variable.to_sym ].to_f }.compact.max
    min_y = votes_per_province.map{ |h| h[real_variable.to_sym ].to_f }.compact.min
    max_x = votes_per_province.select{|h| h[:proceso_electoral_id] == proceso_electoral_id }.map{|h| h[:primer_partido_votos].to_f - h[:segundo_partido_votos].to_f }.compact.max
    json = {}
    provinces.select{ |p| p[:id_1] == autonomy_hash[:id_1] }.each do |province|
      row = votes_per_province.select{|h| h[:gadm2_cartodb_id] == province[:cartodb_id] && h[:proceso_electoral_id] == proceso_electoral_id }.first
      unless row
        putc 'x'
        next
      end
      putc '.'
      province_name = province[:name_2].normalize
      evolution[custom_variable_name][province[:name_2]] ||= all_evolutions[province[:name_2]]
      json[province_name] ||= {}
      json[province_name][:cartodb_id]   = province[:cartodb_id]
      json[province_name][:name]         = province[:name_2] 
      json[province_name][:x_coordinate] = x_coordinate = get_x_coordinate(row, max_x, parties)
      json[province_name][:y_coordinate] = get_y_coordinate(row, real_variable.to_sym, max_y, min_y)
      json[province_name][:radius]       = get_radius(row)
      json[province_name][:color]        = get_color(row, x_coordinate, parties)
      json[province_name][:children_json_url] = municipalities_path(province_name,variable)
      json[province_name][:censo_total]  = row[:censo_total]
      json[province_name][:porcentaje_participacion] = ("%.2f" % (row[:votantes_totales].to_f / row[:censo_total].to_f * 100.0)).to_f
      json[province_name][:partido_1] = [parties[row[:primer_partido_id]], row[:primer_partido_votos].to_f]
      json[province_name][:partido_2] = [parties[row[:segundo_partido_id]],row[:segundo_partido_votos].to_f]
      json[province_name][:partido_3] = [parties[row[:tercer_partido_id]], row[:tercer_partido_votos].to_f]
      json[province_name][:resto_partidos_percent] = row[:resto_partido_votos]
      json[province_name][:info] = ""
      json[province_name][:parent] = [autonomy_name]
      json[province_name][:parent_url] = [autonomies_path(variable)]
      json[province_name][:parent_results] = authonomy_results
      json[province_name][:lavinia_url] = row[:lavinia_url]
      json[province_name][:evolution] = evolution[custom_variable_name][province[:name_2]].join(',')
    end
    fd = File.open('../' + provinces_path(autonomy_name,variable),'w+')
    fd.write(Yajl::Encoder.encode(json))
    fd.close        
  end
end

# variables_json.each do |k,v|
#   variables_json[k] = v.compact.uniq.sort
# end
# fd = File.open('../graphs/meta/provincias.json','w+')
# fd.write(Yajl::Encoder.encode(variables_json))
# fd.close