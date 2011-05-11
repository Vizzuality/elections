# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb        = get_cartodb_connection

base_path = FileUtils.pwd
FileUtils.rm_rf("#{base_path}/../json/generated_data/tiles")
FileUtils.mkdir_p("#{base_path}/../json/generated_data/tiles")

def queries_by_zoom(x, y, z)
  queries = {
    6 => (
      <<-SQL
         SELECT
          id_1 AS id,
          name_1 AS name,
          pe.anyo AS proceso_electoral_year,
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
          FROM vars_socioeco_x_autonomia) AS p_n_min_max,
          gadm2 AS g
         INNER JOIN votaciones_por_autonomia AS v ON g.cartodb_id = v.gadm1_cartodb_id
         INNER JOIN procesos_electorales AS pe ON pe.cartodb_id = v.proceso_electoral_id
         INNER JOIN vars_socioeco_x_autonomia AS vsm ON vsm.gadm1_cartodb_id = v.gadm1_cartodb_id
         INNER JOIN partidos_politicos AS pp1 ON pp1.cartodb_id = v.primer_partido_id
         INNER JOIN partidos_politicos AS pp2 ON pp2.cartodb_id = v.segundo_partido_id
         INNER JOIN partidos_politicos AS pp3 ON pp3.cartodb_id = v.tercer_partido_id
         WHERE v_get_tile(#{x},#{y},#{z}) && centre_geom_webmercator
        SQL
      ),
      7 => (
        <<-SQL
         SELECT
          id_2 AS id,
          name_2 AS name,
          pe.anyo AS proceso_electoral_year,
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
          FROM vars_socioeco_x_provincia) AS p_n_min_max,
          gadm2 AS g
         INNER JOIN votaciones_por_provincia AS v ON g.cartodb_id = v.gadm2_cartodb_id
         INNER JOIN procesos_electorales AS pe ON pe.cartodb_id = v.proceso_electoral_id
         INNER JOIN vars_socioeco_x_provincia AS vsm ON vsm.gadm2_cartodb_id = v.gadm2_cartodb_id
         INNER JOIN partidos_politicos AS pp1 ON pp1.cartodb_id = v.primer_partido_id
         INNER JOIN partidos_politicos AS pp2 ON pp2.cartodb_id = v.segundo_partido_id
         INNER JOIN partidos_politicos AS pp3 ON pp3.cartodb_id = v.tercer_partido_id
         WHERE v_get_tile(#{x},#{y},#{z}) && centre_geom_webmercator
        SQL
      ),
    11 => (
      <<-SQL
         SELECT
          id_4 AS id,
          name_4 AS name,
          name_2 AS provincia,
          pe.anyo AS proceso_electoral_year,
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
         WHERE v_get_tile(#{x},#{y},#{z}) && centre_geom_webmercator
        SQL
      )
  }

  queries[z]
end

supported_variables = %w('paro_normalizado')
variables = cartodb.query("SELECT codigo, min_year, max_year, min_gadm, max_gadm FROM variables WHERE codigo IN (#{supported_variables.join(', ')})").rows
max_year = variables.map(&:max_year).sort.last
min_year = variables.map(&:min_year).sort.first

def create_years_hash(records, variables, max_year, min_year)

  years = {}

  min_year.upto(max_year) do |year|
    data = years[year] || {}

    variables.each do |variable|
      data[variable.codigo.to_sym] = records.first["#{variable.codigo}_#{year}".to_sym]
      data["#{variable.codigo}_max".to_sym] = records.first["#{variable.codigo}_#{year}_max".to_sym]
      data["#{variable.codigo}_min".to_sym] = records.first["#{variable.codigo}_#{year}_min".to_sym]
    end

    records.each do |row|
      data[:censo_total]             = nil
      data[:percen_participacion]    = nil
      data[:primer_partido_percent]  = nil
      data[:primer_partido_name]     = nil
      data[:segundo_partido_percent] = nil
      data[:segundo_partido_name]    = nil
      data[:tercer_partido_percent]  = nil
      data[:tercer_partido_name]     = nil
      data[:otros_partido_percent]   = nil

      if row.proceso_electoral_year == year || row.proceso_electoral_year < year
        data[:censo_total]             = row.censo_total
        data[:percen_participacion]    = row.percen_participacion
        data[:primer_partido_percent]  = row.primer_partido_percent
        data[:primer_partido_name]     = row.primer_partido_name
        data[:segundo_partido_percent] = row.segundo_partido_percent
        data[:segundo_partido_name]    = row.segundo_partido_name
        data[:tercer_partido_percent]  = row.tercer_partido_percent
        data[:tercer_partido_name]     = row.tercer_partido_name
        data[:otros_partido_percent]   = row.otros_partido_percent
        break
      end
    end

    years[year] = data
  end

  years
end


zoom_levels = [6,7,11]

start_x = {
  6 =>  [30,28],
  7 =>  [60,57],
  11 => [964,916]
}

end_x = {
  6 =>  [32,29],
  7 =>  [65,59],
  11 => [1052,951]
}

start_y = {
  6 =>  [23,26],
  7 =>  [46,52],
  11 => [741,844]
}

end_y = {
  6 =>  [25,27],
  7 =>  [50,54],
  11 => [815,866]
}

length = [6714, 841]

counter = 0
i = ARGV.first.to_i
max_requests = ARGV[1].to_i if ARGV.count > 1

progress = ProgressBar.new(max_requests || length[i])

zoom_levels.each do |z|
  y = start_y[z][i]
  while y <= end_y[z][i] do
    x = start_x[z][i]
    while x <= end_x[z][i] do

      exit(0) if max_requests && counter >= max_requests

      json = {}

      query = queries_by_zoom(x, y, z)

      json = nil

      municipalities = {}

      cartodb.query(query).rows.each do |r|
        if municipalities[r.id]
          municipalities[r.delete(:id)] << r
        else
          municipalities[r.delete(:id)] = [r]
        end
      end

      json = []

      municipalities.each do |id, records|
        json << {
          :id => id,
          :name => records.first.name,
          :center_longitude => records.first.center_longitude,
          :center_latitude => records.first.center_latitude,
          :max_year => max_year,
          :min_year => min_year,
          :data => create_years_hash(records, variables, max_year, min_year)
        }
      end

      fd = File.open("../json/generated_data/tiles/#{z}_#{x}_#{y}.json",'w+')
      fd.write(json.to_json)
      fd.close

      progress.increment!

      x += 1
      counter += 1
    end
    y += 1
  end
end