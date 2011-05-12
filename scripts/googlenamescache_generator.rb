# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb                                       = get_cartodb_connection
processes                                     = get_processes
variables, variables_hash, max_year, min_year = *variables_vars

def municipalities_data_sql
  <<-SQL
   SELECT
    g.id_4 as id,
    g.name_2 as provincia,
    g.name_4 as name,
    g.google_maps_name,
    pe.anyo proceso_electoral_year,
    censo_total,
    ((votantes_totales::NUMERIC / censo_total::NUMERIC) * 100)::INTEGER AS percen_participacion,
    primer_partido_percent,
    pp1.name AS primer_partido_name,
    segundo_partido_percent,
    pp2.name AS segundo_partido_name,
    tercer_partido_percent,
    pp3.name AS tercer_partido_name,
    0 AS otros_partido_percent,
    center_longitude,
    center_latitude,
    vsm.paro_normalizado_1996,
    vsm.paro_normalizado_1997,
    vsm.paro_normalizado_1998,
    vsm.paro_normalizado_1999,
    vsm.paro_normalizado_2000,
    vsm.paro_normalizado_2001,
    vsm.paro_normalizado_2002,
    vsm.paro_normalizado_2003,
    vsm.paro_normalizado_2004,
    vsm.paro_normalizado_2005,
    vsm.paro_normalizado_2006,
    vsm.paro_normalizado_2007,
    vsm.paro_normalizado_2008,
    vsm.paro_normalizado_2009,
    p_n_min_max.*
   FROM
    (SELECT
      max(paro_normalizado_1996) as paro_normalizado_1996_max,
      min(paro_normalizado_1996) as paro_normalizado_1996_min,
      max(paro_normalizado_1997) as paro_normalizado_1997_max,
      min(paro_normalizado_1997) as paro_normalizado_1997_min,
      max(paro_normalizado_1998) as paro_normalizado_1998_max,
      min(paro_normalizado_1998) as paro_normalizado_1998_min,
      max(paro_normalizado_1999) as paro_normalizado_1999_max,
      min(paro_normalizado_1999) as paro_normalizado_1999_min,
      max(paro_normalizado_2000) as paro_normalizado_2000_max,
      min(paro_normalizado_2000) as paro_normalizado_2000_min,
      max(paro_normalizado_2001) as paro_normalizado_2001_max,
      min(paro_normalizado_2001) as paro_normalizado_2001_min,
      max(paro_normalizado_2002) as paro_normalizado_2002_max,
      min(paro_normalizado_2002) as paro_normalizado_2002_min,
      max(paro_normalizado_2003) as paro_normalizado_2003_max,
      min(paro_normalizado_2003) as paro_normalizado_2003_min,
      max(paro_normalizado_2004) as paro_normalizado_2004_max,
      min(paro_normalizado_2004) as paro_normalizado_2004_min,
      max(paro_normalizado_2005) as paro_normalizado_2005_max,
      min(paro_normalizado_2005) as paro_normalizado_2005_min,
      max(paro_normalizado_2006) as paro_normalizado_2006_max,
      min(paro_normalizado_2006) as paro_normalizado_2006_min,
      max(paro_normalizado_2007) as paro_normalizado_2007_max,
      min(paro_normalizado_2007) as paro_normalizado_2007_min,
      max(paro_normalizado_2008) as paro_normalizado_2008_max,
      min(paro_normalizado_2008) as paro_normalizado_2008_min,
      max(paro_normalizado_2009) as paro_normalizado_2009_max,
      min(paro_normalizado_2009) as paro_normalizado_2009_min
    FROM vars_socioeco_x_municipio) AS p_n_min_max,
    gadm4 AS g
   INNER JOIN votaciones_por_municipio AS v ON g.cartodb_id = v.gadm4_cartodb_id
   INNER JOIN procesos_electorales AS pe ON pe.cartodb_id = v.proceso_electoral_id
   INNER JOIN vars_socioeco_x_municipio AS vsm ON vsm.gadm4_cartodb_id = v.gadm4_cartodb_id
   INNER JOIN partidos_politicos AS pp1 ON pp1.cartodb_id = v.primer_partido_id
   INNER JOIN partidos_politicos AS pp2 ON pp2.cartodb_id = v.segundo_partido_id
   INNER JOIN partidos_politicos AS pp3 ON pp3.cartodb_id = v.tercer_partido_id
  SQL
end


base_path = FileUtils.pwd
FileUtils.rm_rf("#{base_path}/../json/generated_data/google_names_cache")
FileUtils.mkdir_p("#{base_path}/../json/generated_data/google_names_cache")

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
    :center_latitude => records.first.center_latitude,
    :variables => variables_hash
  }
  json[:provincia] = records.first.provincia
  json[:data] = create_years_hash(records, variables, max_year, min_year)

  fd = File.open(google_cache_path(google_maps_name),'w+')
  fd.write(json.to_json)
  fd.close

end

puts '... caching finished!'
puts