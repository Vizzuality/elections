# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb                                       = get_cartodb_connection
variables, variables_hash, max_year, min_year = *variables_vars
base_path                                     = FileUtils.pwd
json_folder                                   = next_folder('../json/generated_data/bubbles/')

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
          resto_partido_percent AS otros_partido_percent,
          center_longitude,
          center_latitude,
          #{vars_sql_select(1)}
         FROM gadm1 AS g
         LEFT JOIN votaciones_por_autonomia AS v ON g.cartodb_id = v.gadm1_cartodb_id
         LEFT JOIN procesos_electorales AS pe ON pe.cartodb_id = v.proceso_electoral_id
         LEFT JOIN vars_socioeco_x_autonomia AS vsm ON vsm.gadm1_cartodb_id = v.gadm1_cartodb_id
         LEFT JOIN partidos_politicos AS pp1 ON pp1.cartodb_id = v.primer_partido_id
         LEFT JOIN partidos_politicos AS pp2 ON pp2.cartodb_id = v.segundo_partido_id
         LEFT JOIN partidos_politicos AS pp3 ON pp3.cartodb_id = v.tercer_partido_id
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
          resto_partido_percent AS otros_partido_percent,
          center_longitude,
          center_latitude,
          #{vars_sql_select(2)}
         FROM gadm2 AS g
         LEFT JOIN votaciones_por_provincia AS v ON g.cartodb_id = v.gadm2_cartodb_id
         LEFT JOIN procesos_electorales AS pe ON pe.cartodb_id = v.proceso_electoral_id
         LEFT JOIN vars_socioeco_x_provincia AS vsm ON vsm.gadm2_cartodb_id = v.gadm2_cartodb_id
         LEFT JOIN partidos_politicos AS pp1 ON pp1.cartodb_id = v.primer_partido_id
         LEFT JOIN partidos_politicos AS pp2 ON pp2.cartodb_id = v.segundo_partido_id
         LEFT JOIN partidos_politicos AS pp3 ON pp3.cartodb_id = v.tercer_partido_id
         WHERE v_get_tile(#{x},#{y},#{z}) && centre_geom_webmercator
        SQL
      ),
    11 => (
      <<-SQL
         SELECT
          i.cartodb_id AS id,
          i.nombre AS name,
          i.provincia_name AS provincia,
          pe.anyo AS proceso_electoral_year,
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
         LEFT JOIN votaciones_por_municipio AS v ON i.ine_prov_int = v.codineprov AND i.ine_muni_int = v.codinemuni
         LEFT JOIN procesos_electorales AS pe ON pe.cartodb_id = v.proceso_electoral_id
         LEFT JOIN vars_socioeco_x_municipio AS vsm ON vsm.gadm4_cartodb_id = i.cartodb_id
         LEFT JOIN partidos_politicos AS pp1 ON pp1.cartodb_id = v.primer_partido_id
         LEFT JOIN partidos_politicos AS pp2 ON pp2.cartodb_id = v.segundo_partido_id
         LEFT JOIN partidos_politicos AS pp3 ON pp3.cartodb_id = v.tercer_partido_id
         WHERE v_get_tile(#{x},#{y},#{z}) && centre_geom_webmercator
        SQL
      )
  }

  queries[z]
end

# p queries_by_zoom(1, 1, 7)
# exit(0)

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

length = {
  0 => {
    6 => 9,
    7 => 30,
    11 => 6675
  },
  1 => {
    6 => 4,
    7 => 9,
    11 => 828
  }
}

zoom_levels = ARGV.map(&:to_i)

zoom_levels.each do |z|
  [0, 1].each do |i|
    progress = ProgressBar.new(length[i][z])

    max_min_vars = cartodb.query(max_min_vars_query(z)).rows.first

    y = start_y[z][i]
    while y <= end_y[z][i] do
      x = start_x[z][i]
      while x <= end_x[z][i] do

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
          data = {
            :id => id,
            :name => records.first.name,
            :center_longitude => records.first.center_longitude,
            :center_latitude => records.first.center_latitude
          }
          data[:provincia] = records.first.provincia if records.first[:provincia]
          data[:data] = create_years_hash(records, variables, max_year, min_year, max_min_vars)
          json << data
        end

        fd = File.open("#{json_folder}#{z}_#{x}_#{y}.json",'w+')
        fd.write(Yajl::Encoder.encode(json))
        fd.close

        progress.increment!

        x += 1
      end
      y += 1
    end
  end
end
