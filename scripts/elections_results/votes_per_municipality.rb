#encoding: UTF-8
require "rubygems"
require "ruby-debug"
require "bundler/setup"
require "csv"
require "cartodb-rb-client"
require "progress_bar"

CartoDB::Settings = YAML.load_file('config/cartodb_config.yml')
CartoDB::Connection = CartoDB::Client::Connection.new

module VotesPerMunicipalityImporter

  COMMON_FIELDS = [
    "Nombre de Comunidad",
    "Código de Provincia",
    "Nombre de Provincia",
    "Código de Municipio",
    "Nombre de Municipio",
    "Población",
    "Número de mesas",
    "Total censo electoral",
    "Total votantes",
    "Votos válidos",
    "Papeletas a candidaturas",
    "Votos en blanco",
    "Votos nulos",
    "Votos a candidaturas"
  ]

  def self.start!

    Dir['data/municipales-*'].each do |data_file|
      VotesPerMunicipalityImporter.clean_vars

      type, year, month, comments = data_file.scan(/data\/(\w*)-(\d*)-(\d*)(\(\w*\))?.csv/).first
      puts ''
      puts "Importing data for #{type}#{comments}, #{month}-#{year}..."

      proceso_electoral = VotesPerMunicipalityImporter.generate_electoral_processes(type, year, month)

      VotesPerMunicipalityImporter.setup

      print "Reading csv file..."

      reading = Thread.new do
        while(true) do
          sleep 1
          print '.'
        end
      end

      @csv_data = CSV.read(data_file, :headers => true, :return_headers => false, :encoding => 'UTF-8')

      reading.terminate

      VotesPerMunicipalityImporter.create_political_parties(@csv_data.headers)

      progress = ProgressBar.new(@csv_data.count)
      @csv_data.each do |row|
        VotesPerMunicipalityImporter.store_votes(row, proceso_electoral)
        progress.increment!
      end
      VotesPerMunicipalityImporter.execute_sql_queries


      puts "... done importing data for #{type}, #{month}-#{year}"
      puts ''


    end

  end

  def self.generate_electoral_processes(type, year, month)

    electoral_process = CartoDB::Connection.query(<<-SQL
      SELECT cartodb_id, name, anyo, mes
      FROM procesos_electorales
      WHERE name = '#{type}' AND anyo = #{year} AND mes = #{month}
    SQL
    ).rows.first

    return electoral_process if electoral_process

    electoral_process = OpenStruct.new({:name => type, :anyo => year.to_i, :mes => month.to_i})

    electoral_process.cartodb_id = CartoDB::Connection.insert_row('procesos_electorales', electoral_process.marshal_dump)[:id]

    @electoral_processes << electoral_process

    electoral_process
  end

  def self.setup
    @municipalities = Hash[CartoDB::Connection.query('SELECT cartodb_id, ine_province_id, ine_municipality_id FROM gadm4;').rows.map{|m| ["#{m.ine_province_id},#{m.ine_municipality_id}", m]}]
    @current_votes = CartoDB::Connection.query('SELECT gadm4_cartodb_id, proceso_electoral_id FROM votaciones_por_municipio;').rows.map{|v| "#{v.gadm4_cartodb_id},#{v.proceso_electoral_id}"}
  end

  def self.create_political_parties(headers)
    puts ''

    csv_political_parties = headers - VotesPerMunicipalityImporter::COMMON_FIELDS

    csv_political_parties = csv_political_parties.reject{|p| political_parties[p]}

    return if csv_political_parties.empty?

    sql = []

    puts 'Creating political parties...'

    progress = ProgressBar.new(csv_political_parties.count)

    csv_political_parties.each do |party|
      inserted_party = CartoDB::Connection.insert_row 'partidos_politicos', :name => party.strip.gsub(/\\/, '\&\&').gsub(/'/, "''")
      @political_parties[party] = {:cartodb_id => inserted_party[:id], :name => party}
      progress.increment!
    end

    print '... creating political parties done!'
    puts ''
  end

  def self.political_parties
    @political_parties ||= Hash[CartoDB::Connection.query('SELECT cartodb_id, name FROM partidos_politicos;').rows.map{|pp| [pp.name, pp]}]
  end

  def self.store_votes(row, proceso_electoral)
    return false if row.nil? || proceso_electoral.nil?

    municipality = @municipalities["#{row["Código de Provincia"]},#{row["Código de Municipio"]}"]

    return false if municipality.nil?

    gadm4_cartodb_id   = municipality.cartodb_id
    mesas_electorales = row["Número de mesas"]
    censo_total       = row["Total censo electoral"]
    votantes_totales  = row["Total votantes"]
    votos_validos     = row["Votos válidos"]
    votos_en_blanco   = row["Votos en blanco"]
    votos_nulos       = row["Votos nulos"]
    primer_partido_id = primer_partido_votos = primer_partido_percent = segundo_partido_id = segundo_partido_votos = segundo_partido_percent = tercer_partido_id = tercer_partido_votos = tercer_partido_percent = cuarto_partido_id = cuarto_partido_votos = cuarto_partido_percent = quinto_partido_id = quinto_partido_votos = quinto_partido_percent = sexto_partido_id = sexto_partido_votos = sexto_partido_percent = 0

    return false if mesas_electorales.nil? || censo_total.nil? || votantes_totales.nil? || votos_validos.nil? || votos_en_blanco.nil? || votos_nulos.nil?

    mesas_electorales = mesas_electorales.to_i
    censo_total       = censo_total.to_i
    votantes_totales  = votantes_totales.to_i
    votos_validos     = votos_validos.to_i
    votos_en_blanco   = votos_en_blanco.to_i
    votos_nulos       = votos_nulos.to_i

    parties_votes = row.to_hash.delete_if{|key,value| VotesPerMunicipalityImporter::COMMON_FIELDS.include?(key) || value.nil?}
    more_voted = parties_votes.to_a.sort{|x,y| y[1].to_i <=> x[1].to_i }.first(3)

    if more_voted.length >= 1
      primer_partido_id       = political_parties[more_voted[0][0]].cartodb_id
      primer_partido_votos    = more_voted[0][1].to_i
      primer_partido_percent  = votos_validos > 0 ? more_voted[0][1].to_i * 100 / votos_validos : 0
    end

    if more_voted.length >= 2
      segundo_partido_id      = political_parties[more_voted[1][0]].cartodb_id
      segundo_partido_votos   = more_voted[1][1].to_i
      segundo_partido_percent = votos_validos > 0 ? more_voted[1][1].to_i * 100 / votos_validos : 0
    end

    if more_voted.length >= 3
      tercer_partido_id       = political_parties[more_voted[2][0]].cartodb_id
      tercer_partido_votos    = more_voted[2][1].to_i
      tercer_partido_percent  = votos_validos > 0 ? more_voted[2][1].to_i * 100 / votos_validos : 0
    end

    resto_partido_votos = votos_validos > 0 ? votos_validos - (primer_partido_votos + segundo_partido_votos + tercer_partido_votos) : 0
    resto_partido_percent = votos_validos > 0 ? resto_partido_votos * 100 / votos_validos : 0

    if @current_votes.include?("#{gadm4_cartodb_id},#{proceso_electoral[:cartodb_id]}")
      @votes_sql << <<-SQL.strip
        UPDATE votaciones_por_municipio
        SET (
          mesas_electorales,
          censo_total,
          votantes_totales,
          votos_validos,
          votos_en_blanco,
          votos_nulos,
          primer_partido_id,
          primer_partido_votos,
          primer_partido_percent,
          segundo_partido_id,
          segundo_partido_votos,
          segundo_partido_percent,
          tercer_partido_id,
          tercer_partido_votos,
          tercer_partido_percent,
          resto_partido_votos,
          resto_partido_percent
        ) = (
          #{mesas_electorales},
          #{censo_total},
          #{votantes_totales},
          #{votos_validos},
          #{votos_en_blanco},
          #{votos_nulos},
          #{primer_partido_id},
          #{primer_partido_votos},
          #{primer_partido_percent},
          #{segundo_partido_id},
          #{segundo_partido_votos},
          #{segundo_partido_percent},
          #{tercer_partido_id},
          #{tercer_partido_votos},
          #{tercer_partido_percent},
          #{resto_partido_votos},
          #{resto_partido_percent}
        )
        WHERE gadm4_cartodb_id = #{gadm4_cartodb_id} AND
              proceso_electoral_id = #{proceso_electoral[:cartodb_id]};
      SQL

    else
      @votes_sql << <<-SQL.strip
        INSERT INTO votaciones_por_municipio (
          gadm4_cartodb_id,
          proceso_electoral_id,
          mesas_electorales,
          censo_total,
          votantes_totales,
          votos_validos,
          votos_en_blanco,
          votos_nulos,
          primer_partido_id,
          primer_partido_votos,
          primer_partido_percent,
          segundo_partido_id,
          segundo_partido_votos,
          segundo_partido_percent,
          tercer_partido_id,
          tercer_partido_votos,
          tercer_partido_percent,
          resto_partido_votos,
          resto_partido_percent
        )
        VALUES (
          #{gadm4_cartodb_id},
          #{proceso_electoral[:cartodb_id]},
          #{mesas_electorales},
          #{censo_total},
          #{votantes_totales},
          #{votos_validos},
          #{votos_en_blanco},
          #{votos_nulos},
          #{primer_partido_id},
          #{primer_partido_votos},
          #{primer_partido_percent},
          #{segundo_partido_id},
          #{segundo_partido_votos},
          #{segundo_partido_percent},
          #{tercer_partido_id},
          #{tercer_partido_votos},
          #{tercer_partido_percent},
          #{resto_partido_votos},
          #{resto_partido_percent}
        );
      SQL

    end
  end


  def self.execute_sql_queries
    return if @votes_sql.empty?

    puts ''
    puts 'Storing data into CartoDB...'

    CartoDB::Connection.query @votes_sql

    print '... done!'
    puts ''
  end

  def self.clean_vars
    @csv_data = nil
    @votes_sql = ''
    @municipalities = nil
    @current_votes = nil
  end
end

class ProcesoElectoral
end

VotesPerMunicipalityImporter.start!