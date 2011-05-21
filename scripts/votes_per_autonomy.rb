#encoding: UTF-8
require "rubygems"
#require "ruby-debug"
require "bundler/setup"
require "csv"
require "cartodb-rb-client"

CartoDB::Settings = YAML.load_file('cartodb_config.yml')
CartoDB::Connection = CartoDB::Client::Connection.new

CartoDB::Connection.query 'DELETE FROM votaciones_por_autonomia;'

module VotesPerProvinceImporter

  def self.start!

    CartoDB::Connection.query(<<-SQL
      INSERT INTO votaciones_por_autonomia
      ( proceso_electoral_id,
        gadm1_cartodb_id,
        mesas_electorales,
        censo_total,
        votantes_totales,
        votos_validos,
        votos_en_blanco,
        votos_nulos
      )
      (SELECT
        vm.proceso_electoral_id,
        g1.cartodb_id,
        SUM(vm.mesas_electorales),
        SUM(vm.censo_total),
        SUM(vm.votantes_totales),
        SUM(vm.votos_validos),
        SUM(vm.votos_en_blanco),
        SUM(vm.votos_nulos)
      FROM votaciones_por_municipio vm
      INNER JOIN ine_poly ip ON ip.ine_prov_int = vm.codineprov::NUMERIC AND ip.ine_muni_int = vm.codinemuni::NUMERIC
      INNER JOIN gadm2 g2 ON g2.cc_2 = ip.codineprov
      INNER JOIN gadm1 g1 ON g1.id_1 = g2.id_1
      GROUP BY
        vm.proceso_electoral_id,
        g1.cartodb_id);
    SQL
    )

    votaciones_por_autonomia = {}
    CartoDB::Connection.query(<<-SQL
      SELECT
        g1.cartodb_id as gadm1_cartodb_id,
        pe.cartodb_id as proceso_electoral_id,
        pp.cartodb_id as primer_partido_id,
        count(pp.cartodb_id) as primer_partido_votos
      FROM votaciones_por_municipio v
      INNER JOIN procesos_electorales pe ON pe.cartodb_id = v.proceso_electoral_id
      INNER JOIN partidos_politicos pp ON pp.cartodb_id = v.primer_partido_id
      INNER JOIN gadm2 g2 ON g2.cc_2::integer = v.codineprov
      INNER JOIN gadm1 g1 ON g1.id_1 = g2.id_1
      GROUP BY g1.cartodb_id, pe.cartodb_id, pp.cartodb_id
      ORDER BY gadm1_cartodb_id, count(pp.cartodb_id) DESC
    SQL
    ).rows.each do |r|
      if votaciones_por_autonomia[r.gadm1_cartodb_id]
        votaciones_por_autonomia[r.delete(:gadm1_cartodb_id)] << r
      else
        votaciones_por_autonomia[r.delete(:gadm1_cartodb_id)] = [r]
      end
    end

    votaciones_por_autonomia_proceso_electoral = {}
    votaciones_por_autonomia.each do |autonomia_id, data|
      votaciones_por_autonomia_proceso_electoral[autonomia_id] = {}

      data.each do |row|

        if votaciones_por_autonomia_proceso_electoral[autonomia_id][row[:proceso_electoral_id]]
          votaciones_por_autonomia_proceso_electoral[autonomia_id][row.delete(:proceso_electoral_id)] << row
        else
          votaciones_por_autonomia_proceso_electoral[autonomia_id][row.delete(:proceso_electoral_id)] = [row]
        end
      end
    end

    ganadores_por_autonomia = []
    votaciones_por_autonomia_proceso_electoral.each do |province_id, province_winners|

      province_winners.each do |proceso_electoral_id, data|
        total = data.map(&:primer_partido_votos).inject{|sum, n| sum + n}
        primer_partido_id = segundo_partido_id = tercer_partido_id = 'NULL'
        primer_partido_votos = segundo_partido_votos = tercer_partido_votos = 0
        primer_partido_id  = data[0][:primer_partido_id] if data[0]
        segundo_partido_id = data[1][:primer_partido_id] if data[1]
        tercer_partido_id  = data[2][:primer_partido_id] if data[2]
        primer_partido_votos  = data[0][:primer_partido_votos] if data[0]
        segundo_partido_votos = data[1][:primer_partido_votos] if data[1]
        tercer_partido_votos  = data[2][:primer_partido_votos] if data[2]

        resto_partido_votos = total - primer_partido_votos - segundo_partido_votos - tercer_partido_votos

        electoral_results = {}
        electoral_results[:gadm1_cartodb_id]        = province_id
        electoral_results[:proceso_electoral_id]    = proceso_electoral_id
        electoral_results[:primer_partido_id]       = primer_partido_id
        electoral_results[:primer_partido_votos]    = primer_partido_votos
        electoral_results[:primer_partido_percent]  = (primer_partido_votos.to_f/total.to_f*100).to_i
        electoral_results[:segundo_partido_id]      = segundo_partido_id
        electoral_results[:segundo_partido_votos]   = segundo_partido_votos
        electoral_results[:segundo_partido_percent] = (segundo_partido_votos.to_f/total.to_f*100).to_i
        electoral_results[:tercer_partido_id]       = tercer_partido_id
        electoral_results[:tercer_partido_votos]    = tercer_partido_votos
        electoral_results[:tercer_partido_percent]  = (tercer_partido_votos.to_f/total.to_f*100).to_i
        electoral_results[:resto_partido_votos]     = resto_partido_votos
        electoral_results[:resto_partido_percent]   = (resto_partido_votos.to_f/total.to_f*100).to_i

        ganadores_por_autonomia << OpenStruct.new(electoral_results)

      end
    end

    sql = []
    ganadores_por_autonomia.map do |province_winners|
      sql << <<-SQL
        UPDATE votaciones_por_autonomia
        SET primer_partido_id       = #{province_winners.primer_partido_id},
            primer_partido_votos    = #{province_winners.primer_partido_votos},
            primer_partido_percent  = #{province_winners.primer_partido_percent},
            segundo_partido_id      = #{province_winners.segundo_partido_id},
            segundo_partido_votos   = #{province_winners.segundo_partido_votos},
            segundo_partido_percent = #{province_winners.segundo_partido_percent},
            tercer_partido_id       = #{province_winners.tercer_partido_id},
            tercer_partido_votos    = #{province_winners.tercer_partido_votos},
            tercer_partido_percent  = #{province_winners.tercer_partido_percent},
            resto_partido_votos     = #{province_winners.resto_partido_votos},
            resto_partido_percent   = #{province_winners.resto_partido_percent}
        WHERE gadm1_cartodb_id = #{province_winners.gadm1_cartodb_id} AND
              proceso_electoral_id = '#{province_winners.proceso_electoral_id}'
      SQL
    end

    puts 'Updating votaciones_por_autonomia...'
    CartoDB::Connection.query sql.join(';')
    puts '... done!'
  end

end

VotesPerProvinceImporter.start!
