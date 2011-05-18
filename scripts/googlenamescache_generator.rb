# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb                                       = get_cartodb_connection
processes                                     = get_processes
variables, variables_hash, max_year, min_year = *variables_vars
json_folder                                   = next_folder('../json/generated_data/google_names_cache/')

def municipalities_data_sql
  <<-SQL
   SELECT
    i.cartodb_id AS id,
    i.nombre AS name,
    i.provincia_name AS provincia,
    i.google_maps_name,
    pe.anyo proceso_electoral_year,
    censo_total,
    ((votantes_totales::NUMERIC / censo_total::NUMERIC) * 100)::INTEGER AS percen_participacion,
    primer_partido_percent,
    pp1.name AS primer_partido_name,
    segundo_partido_percent,
    pp2.name AS segundo_partido_name,
    tercer_partido_percent,
    pp3.name AS tercer_partido_name,
    resto_partido_percent AS otros_partido_percent,
    center_longitude,
    center_latitude,
    #{vars_sql_select(4)}
   FROM ine_poly AS i
   INNER JOIN votaciones_por_municipio AS v ON i.ine_prov_int = v.codineprov AND i.ine_muni_int = v.codinemuni
   INNER JOIN procesos_electorales AS pe ON pe.cartodb_id = v.proceso_electoral_id
   INNER JOIN vars_socioeco_x_municipio AS vsm ON vsm.gadm4_cartodb_id = i.cartodb_id
   INNER JOIN partidos_politicos AS pp1 ON pp1.cartodb_id = v.primer_partido_id
   INNER JOIN partidos_politicos AS pp2 ON pp2.cartodb_id = v.segundo_partido_id
   INNER JOIN partidos_politicos AS pp3 ON pp3.cartodb_id = v.tercer_partido_id
  SQL
end

## MUNICIPALITIES GOOGLE NAMES CACHE GENERATOR
##############################################
puts
puts 'Caching gadm4 to json files:'

print 'Getting data...'

reading = Thread.new do
  while(true) do
    sleep 1
    print '.'
  end
end

max_min_vars = cartodb.query(max_min_vars_query(11)).rows.first

municipalities_data = {}

cartodb.query(municipalities_data_sql).rows.each do |row|
  google_maps_name = row.delete(:google_maps_name)
  data = municipalities_data[google_maps_name] || []
  data << row
  municipalities_data[google_maps_name] = data
end

reading.terminate
puts
puts 'done!'

progress = ProgressBar.new(municipalities_data.keys.count)

municipalities_data.each do |google_maps_name, records|
  json = {
    :id => records.first.id,
    :google_maps_name => google_maps_name,
    :name => records.first.name,
    :center_longitude => records.first.center_longitude,
    :center_latitude => records.first.center_latitude
  }
  json[:provincia] = records.first.provincia
  json[:data] = create_years_hash(records, variables, max_year, min_year, max_min_vars)

  fd = File.open("#{json_folder+google_maps_name.normalize}.json",'w+')
  fd.write(json.to_json)
  fd.close

end

puts '... caching finished!'
puts