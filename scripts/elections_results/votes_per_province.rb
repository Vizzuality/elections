#encoding: UTF-8
require "rubygems"
require "ruby-debug"
require "bundler/setup"
require "csv"
require "cartodb-rb-client"

CartoDB::Settings = YAML.load_file('config/cartodb_config.yml')
CartoDB::Connection = CartoDB::Client::Connection.new

CartoDB::Connection.query 'DELETE FROM votaciones_por_provincia;'

Dir['models/*'].each{|model| require model }

module VotesPerProvinceImporter

  def self.start!

    CartoDB::Connection.query(<<-SQL
      INSERT INTO votaciones_por_provincia
      ( proceso_electoral_id,
        gadm2_cartodb_id,
        mesas_electorales,
        censo_total,
        votantes_totales,
        votos_validos,
        votos_en_blanco,
        votos_nulos
      )
      (SELECT
        vm.proceso_electoral_id,
        g2.cartodb_id,
        SUM(vm.mesas_electorales),
        SUM(vm.censo_total),
        SUM(vm.votantes_totales),
        SUM(vm.votos_validos),
        SUM(vm.votos_en_blanco),
        SUM(vm.votos_nulos)
      FROM votaciones_por_municipio vm
      INNER JOIN gadm4 g4 ON g4.cartodb_id = vm.gadm4_cartodb_id
      INNER JOIN gadm3 g3 ON g3.id_0 = g4.id_0 AND g3.id_1 = g4.id_1 AND g3.id_2 = g4.id_2 AND g3.id_3 = g4.id_3
      INNER JOIN gadm2 g2 ON g2.id_0 = g3.id_0 AND g2.id_1 = g3.id_1 AND g2.id_2 = g3.id_2
      GROUP BY
        vm.proceso_electoral_id,
        g2.cartodb_id);
    SQL
    )

    results = []

    fields = %w(primer segundo tercer)

    fields.each do |field|
      results << CartoDB::Connection.query(<<-SQL
        SELECT
          vm.proceso_electoral_id,
          g2.cartodb_id as g2_cartodb_id,
          vm.#{field}_partido_id as partido_id,
          SUM(vm.#{field}_partido_votos) partido_votos
        FROM votaciones_por_municipio vm
        INNER JOIN gadm4 g4 ON g4.cartodb_id = vm.gadm4_cartodb_id
        INNER JOIN gadm3 g3 ON g3.id_0 = g4.id_0 AND g3.id_1 = g4.id_1 AND g3.id_2 = g4.id_2 AND g3.id_3 = g4.id_3
        INNER JOIN gadm2 g2 ON g2.id_0 = g3.id_0 AND g2.id_1 = g3.id_1 AND g2.id_2 = g3.id_2
        INNER JOIN partidos_politicos pp ON pp.cartodb_id = vm.#{field}_partido_id
        GROUP BY
          vm.proceso_electoral_id,
          g2_cartodb_id,
          partido_id
      SQL
      ).rows

    end

    votaciones_por_provincia = {}

    results.each do |result|
      result.each do |row|

        _votacion_provincia = votaciones_por_provincia[row.g2_cartodb_id.to_i]

        _proceso_electoral = _votacion_provincia ? (_votacion_provincia[row.proceso_electoral_id.to_i] || {row.partido_id => 0}) : {row.partido_id => 0}

        _votacion_partido = _proceso_electoral[row.partido_id.to_i] || 0

        _votacion_partido += row.partido_votos.to_i

        _proceso_electoral[row.partido_id.to_i] = _votacion_partido

        votaciones_por_provincia[row.g2_cartodb_id.to_i] = {} if votaciones_por_provincia[row.g2_cartodb_id.to_i].nil?

        votaciones_por_provincia[row.g2_cartodb_id.to_i][row.proceso_electoral_id.to_i] = _proceso_electoral
      end
    end

    sql = []
    votaciones_por_provincia.each do |gadm2_cartodb_id, procesos_electorales|
      procesos_electorales.each do |proceso_electoral_id, partidos|
        partidos_a_insertar = partidos.to_a.sort{|x, y| y[1] <=> x[1]}.first(6)
        votos_tres_primeros = partidos_a_insertar[0][1] + partidos_a_insertar[1][1] + partidos_a_insertar[2][1]
        sql << <<-SQL
          UPDATE votaciones_por_provincia
          SET primer_partido_id      = #{partidos_a_insertar[0][0]}, primer_partido_votos  = #{partidos_a_insertar[0][1]}, primer_partido_percent  = (#{partidos_a_insertar[0][1]} * 100 / votos_validos),
              segundo_partido_id     = #{partidos_a_insertar[1][0]}, segundo_partido_votos = #{partidos_a_insertar[1][1]}, segundo_partido_percent = (#{partidos_a_insertar[1][1]} * 100 / votos_validos),
              tercer_partido_id      = #{partidos_a_insertar[2][0]}, tercer_partido_votos  = #{partidos_a_insertar[2][1]}, tercer_partido_percent  = (#{partidos_a_insertar[2][1]} * 100 / votos_validos),
              resto_partido_votos    = (votos_validos - (#{(votos_tres_primeros)})),
              resto_partido_percent  = ((votos_validos - (#{(votos_tres_primeros)})) * 100 / votos_validos)
          WHERE gadm2_cartodb_id = #{gadm2_cartodb_id} AND proceso_electoral_id = '#{proceso_electoral_id}'
        SQL
      end
    end

    puts 'Updating votaciones_por_provincia...'
    CartoDB::Connection.query sql.join(';')
    puts '... done!'
  end

end

VotesPerProvinceImporter.start!