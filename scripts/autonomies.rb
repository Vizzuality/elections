# coding: UTF-8

require File.dirname(__FILE__) + "/common"

base_path    = FileUtils.pwd
version_path = "#{base_path}/../graphs/autonomias/#{$graphs_next_version}"
current_path = "#{base_path}/../graphs/autonomias/current"
FileUtils.mkdir_p(version_path)
FileUtils.rm(current_path)
FileUtils.ln_s version_path, current_path, :force => true



cartodb        = get_cartodb_connection
processes      = get_processes
autonomies     = get_autonomies
provinces      = get_provinces
parties        = get_parties
variables      = get_variables(1)
parties_known  = get_known_parties(parties)

# votes per autonomy
query = <<-SQL
select votantes_totales, censo_total, #{AUTONOMIAS_VOTATIONS}.gadm1_cartodb_id, proceso_electoral_id, lavinia_url,
       primer_partido_id, primer_partido_votos, segundo_partido_id, segundo_partido_votos, 
       tercer_partido_id, tercer_partido_votos, censo_total, votantes_totales, resto_partido_votos, 
       #{variables.join(',')}
from #{AUTONOMIAS_VOTATIONS}, vars_socioeco_x_autonomia, gadm1
where #{AUTONOMIAS_VOTATIONS}.gadm1_cartodb_id = vars_socioeco_x_autonomia.gadm1_cartodb_id and #{AUTONOMIAS_VOTATIONS}.gadm1_cartodb_id = gadm1.cartodb_id
SQL

votes_per_autonomy = cartodb.query(query)[:rows]

## AUTONOMIES
#############
evolution = {}
puts
variables_json = {}
parties_results = {}

variables.each do |variable|
  custom_variable_name = variable.gsub(/_\d+$/,'')
  variables_json[custom_variable_name] ||= []
  evolution[custom_variable_name] ||= {} 
  all_evolutions = get_autonomies_variable_evolution(variable)
  unless proceso_electoral_id = processes[variable.match(/\d+$/)[0].to_i]  
    year = variable.match(/\d+$/)[0].to_i - 1
    while proceso_electoral_id.nil? && year > 1975
      proceso_electoral_id = processes[year]
      year -= 1
    end
  end
  puts "Variable: #{variable} - #{year} - #{proceso_electoral_id}"
  parties_results[proceso_electoral_id] ||= {}
  if parties_results[proceso_electoral_id].empty?
    query = "select cartodb_id,primer_partido_id,segundo_partido_id,segundo_partido_votos,tercer_partido_id from votaciones_por_autonomia where proceso_electoral_id=#{proceso_electoral_id}"
    cartodb.query(query).rows.each do |row|
      parties_results[proceso_electoral_id][row[:primer_partido_id]] ||= 0
      parties_results[proceso_electoral_id][row[:primer_partido_id]] += 1
      # parties_results[proceso_electoral_id][row[:segundo_partido_id]] ||= 0
      # parties_results[proceso_electoral_id][row[:segundo_partido_id]] += 1
      # parties_results[proceso_electoral_id][row[:tercer_partido_id]] ||= 0
      # parties_results[proceso_electoral_id][row[:tercer_partido_id]] += 1
      parties_results[proceso_electoral_id]["Otros"] ||= 0
      parties_results[proceso_electoral_id]["Otros"] += 1
    end
    sorted_parties_results = parties_results[proceso_electoral_id].sort{|a,b| b[1] <=> a[1] }
    parties_results[proceso_electoral_id] = {}
    keys = [:primer_partido_id, :segundo_partido_id, :tercer_partido_id]
    i_keys = 0
    if sorted_parties_results.size < 5
      sorted_parties_results.each do |r|
        if r[0] == "Otros" || r[0].nil?
          parties_results[proceso_electoral_id]["Otros"] ||= 0
          parties_results[proceso_electoral_id]["Otros"] += r[1].to_i
        else
          parties_results[proceso_electoral_id][keys[i_keys]] = [r[0], r[1]]
          i_keys += 1
        end
      end
    else
      sorted_parties_results.each do |r|
        if r[0] == "Otros" || i_keys == keys.size || r[0].nil?
          parties_results[proceso_electoral_id]["Otros"] ||= 0
          parties_results[proceso_electoral_id]["Otros"] += r[1].to_i
        else
          parties_results[proceso_electoral_id][keys[i_keys]] = [r[0], r[1]]
          i_keys += 1
        end
      end
    end
  end
  
  variables_json[custom_variable_name] << variable.match(/\d+$/)[0].to_i
  max_y = votes_per_autonomy.map{ |h| h[variable.to_sym ].to_f }.compact.max
  min_y = votes_per_autonomy.map{ |h| h[variable.to_sym ].to_f }.compact.min
  max_x = votes_per_autonomy.select{|h| h[:proceso_electoral_id] == proceso_electoral_id }.map{|h| h[:primer_partido_votos].to_f - h[:segundo_partido_votos].to_f }.compact.max
  json = {}
  autonomies.each do |autonomy_hash|
    unless row = votes_per_autonomy.select{|h| h[:gadm1_cartodb_id] == autonomy_hash[:cartodb_id] && h[:proceso_electoral_id] == proceso_electoral_id }.first
      putc 'x'
      next
    end
    putc '.'
    autonomy_name = autonomy_hash[:name_1].normalize
    evolution[custom_variable_name][autonomy_hash[:name_1]] ||= all_evolutions[autonomy_hash[:name_1]]
    json[autonomy_name] ||= {}
    json[autonomy_name][:cartodb_id]   = autonomy_hash[:cartodb_id]
    json[autonomy_name][:name] = autonomy_hash[:name_1]
    json[autonomy_name][:x_coordinate] = x_coordinate = get_x_coordinate(row, max_x, parties_known)
    json[autonomy_name][:y_coordinate] = get_y_coordinate(row, variable.to_sym, max_y, min_y)
    json[autonomy_name][:radius]       = get_radius(row)
    json[autonomy_name][:color]        = get_color(row, x_coordinate, parties)
    json[autonomy_name][:children_json_url] = provinces_path(autonomy_name,variable)
    json[autonomy_name][:censo_total]  = row[:censo_total]
    json[autonomy_name][:porcentaje_participacion] = ("%.2f" % (row[:votantes_totales].to_f / row[:censo_total].to_f * 100.0)).to_f
    json[autonomy_name][:partido_1]    = [parties[row[:primer_partido_id]], row[:primer_partido_votos].to_f]
    json[autonomy_name][:partido_2]    = [parties[row[:segundo_partido_id]],row[:segundo_partido_votos].to_f]
    json[autonomy_name][:partido_3]    = [parties[row[:tercer_partido_id]], row[:tercer_partido_votos].to_f]
    json[autonomy_name][:resto_partidos_percent] = row[:resto_partido_votos]
    json[autonomy_name][:info] = ""
    json[autonomy_name][:parent] = []
    json[autonomy_name][:parent_url] = []

    other = 18 - parties_results[proceso_electoral_id][:primer_partido_id][1] - parties_results[proceso_electoral_id][:segundo_partido_id][1] - parties_results[proceso_electoral_id][:tercer_partido_id][1]
    other = 0 if other < 0
    json[autonomy_name][:parent_results] = {
      :partido_1 => [parties[parties_results[proceso_electoral_id][:primer_partido_id][0]],parties_results[proceso_electoral_id][:primer_partido_id][1]],
      :partido_2 => [parties[parties_results[proceso_electoral_id][:segundo_partido_id][0]],parties_results[proceso_electoral_id][:segundo_partido_id][1]],
      :partido_3 => [parties[parties_results[proceso_electoral_id][:tercer_partido_id][0]],parties_results[proceso_electoral_id][:tercer_partido_id][1]],
      :otros     => ["Otros", other]
    }    
    json[autonomy_name][:lavinia_url] = autonomy_hash[:lavinia_url]
    json[autonomy_name][:evolution] = evolution[custom_variable_name][autonomy_hash[:name_1]].join(',')
   end
  fd = File.open('../' + autonomies_path(variable),'w+')
  fd.write(Yajl::Encoder.encode(json))
  fd.close
end

puts 

variables_json.each do |k,v|
  variables_json[k] = v.compact.uniq.sort
end
fd = File.open('../graphs/meta/autonomias.json','w+')
fd.write(Yajl::Encoder.encode(variables_json))
fd.close
