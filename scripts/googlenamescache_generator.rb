# coding: UTF-8

require File.dirname(__FILE__) + "/common"

crono = Time.now

cartodb                                       = get_cartodb_connection
variables, variables_hash, max_year, min_year = *variables_vars
json_folder                                   = next_folder("#{root_data_path}/google_names_cache/")

def municipalities_data_sql
  <<-SQL
   SELECT
    i.cartodb_id AS id,
    i.nombre AS name,
    g2.name_2 AS provincia,
    g2.name_1 AS autonomia,
    i.google_maps_name,
    i.lavinia_url,
    pe.anyo proceso_electoral_year,
    censo_total,
    CASE WHEN censo_total >0 THEN
      ((votantes_totales::NUMERIC / censo_total::NUMERIC) * 100)::INTEGER 
    ELSE
      0
    END AS percen_participacion,
    primer_partido_votos,
    primer_partido_percent,
    pp1.name AS primer_partido_name,
    segundo_partido_votos,
    segundo_partido_percent,
    pp2.name AS segundo_partido_name,
    tercer_partido_votos,
    tercer_partido_percent,
    pp3.name AS tercer_partido_name,
    resto_partido_votos AS otros_partido_votos,
    resto_partido_percent AS otros_partido_percent,
    i.center_longitude,
    i.center_latitude,
    #{vars_sql_select(4)}
   FROM ine_poly AS i
   INNER JOIN gadm2 g2 ON g2.cc_2 = i.codineprov
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
  json[:provincia]   = records.first.provincia
  json[:autonomia]   = records.first.autonomia
  json[:lavinia_url] = records.first.lavinia_url
  json[:data]        = create_years_hash(records, variables, max_year, min_year)

  unless json.nil? || json.empty?
    fd = File.open("#{json_folder+google_maps_name.normalize}.json",'w+')
    fd.write(Yajl::Encoder.encode(json))
    fd.close
  end
end

puts '... caching finished!'
puts

puts "Elapsed time: #{(Time.now - crono)} seconds"