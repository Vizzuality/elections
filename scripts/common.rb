# coding: UTF-8

require "rubygems"
require "bundler/setup"
require "cartodb-rb-client"
require "ruby-debug"
require "net/https"
require 'uri'
require "progress_bar"
require File.dirname(__FILE__) + "/array_ext"
require File.dirname(__FILE__) + "/hash_ext"

# Tables names
POLITICAL_PARTIES     = "partidos_politicos"
PROCESOS_NAME         = "procesos_electorales"
AUTONOMIAS_TABLE      = "gadm1"
AUTONOMIAS_VOTATIONS  = "votaciones_por_autonomia"
PROVINCES_TABLE       = "gadm2"
PROVINCES_VOTATIONS   = "votaciones_por_provincia"
MUNICIPALITIES_TABLE  = "gadm4"
MUNICIPALITIES_VOTATIONS = "votaciones_por_municipio"
VARIABLES = %W{ paro_normalizado }
PARTIES = %W{PP PSOE CIU AP IU INDEP CDS PAR EAJ-PNV PA BNG PDP ERC-AM ESQUERRA-AM ERC EA HB PRC PR UV}
LEFT_PARTIES = %W{ PSOE IU INDEP BNG PDP ERC-AM ESQUERRA-AM ERC EA HB PRC PR }
THIRD_PARTY_COLORS = {
  "CIU" => ["#EC7B37", "#003F7F"],
  "AP" => ["#5AB0E9"],
  "IU" =>  ["#54A551"],
  "INDEP"  => ["#AAA"],
  "CDS" => ["#DADC4D", "#62A558"],
  "PAR" => ["#D8282A", "#EABA4B"],
  "EAJ-PNV" => ["#CE0E16", "#008140"],
  "EAJ-PNV/EA" => ["#CE0E16", "#008140"],
  "PA" =>["#54A551"],
  "BNG"  => ["#D8282A"],
  "PDP"  => ["#5AB0E9"],
  "ERC-AM" => ["#EC7B37"],
  "ESQUERRA-AM"  => ["#EC7B37"],
  "ERC" => ["#EC7B37"],
  "EA" => ["#B41318", "#DADC4D"],
  "HB" => ["#800080"],
  "PRC"=> ["#C4BE48"],
  "PR" => ["#CE0E16", "#008140"],
  "UV" => ["#EC7B37", "#EABA4B"]
}
#####

# Paths
# =====
# Autonomies:
#  - json/generated_data/autonomies_<var_name>.json
# Provinces:
#  - json/generated_data/provinces/<autonomy_name>_<var_name>.json
#    example: json/generated_data/provinces/Andalucia_paro_1999.json
# Municipalities:
#  - json/generated_data/municipalities/<province_name>_<var_name>.json
#    example: json/generated_data/provinces/Sevilla_paro_1999.json
###


CartoDB::Settings = YAML.load_file('cartodb_config.yml')
$cartodb = CartoDB::Client::Connection.new

def get_cartodb_connection
  $cartodb
end

def get_processes
  processes = {}
  $cartodb.query("select cartodb_id, anyo from #{PROCESOS_NAME}")[:rows].each do |h|
    processes[h[:anyo]] = h[:cartodb_id]
  end
  processes
end

def get_autonomies
  $cartodb.query("select cartodb_id, id_1, name_1 from #{AUTONOMIAS_TABLE}")[:rows].compact
end

def get_provinces
  $cartodb.query("select cartodb_id, id_1, id_2, name_2 from #{PROVINCES_TABLE}")[:rows].compact
end

def get_variables(gadm_level)
  processes = get_processes
  raw_variables = $cartodb.query("select codigo, min_year, max_year, min_gadm, max_gadm from variables")[:rows]
  variables = []
  raw_variables.each do |raw_variable_hash|
    # next if !VARIABLES.include?(raw_variable_hash[:codigo])
    next if gadm_level.to_i < raw_variable_hash[:min_gadm].to_i || gadm_level.to_i > raw_variable_hash[:max_gadm].to_i
    min_year = raw_variable_hash[:min_year].to_i
    max_year = raw_variable_hash[:max_year].to_i
    # processes.map do |k,v|
    #   next if k.to_i < min_year || k.to_i > max_year
    #   "#{raw_variable_hash[:codigo]}_#{k}"
    # end
    min_year.upto(max_year) do |year|
      next if %W{ uso_regular_internet_2009 }.include?("#{raw_variable_hash[:codigo]}_#{year}")
      variables << "#{raw_variable_hash[:codigo]}_#{year}"
    end
  end
  variables.flatten.compact
end

def get_y_coordinate(row, variable, max, min)
  return nil if max.to_f == 0
  var = row[variable].to_f
  if var > 0
    return ("%.2f" % ((var * 240.0) / max.to_f)).to_f
  else
    return ("%.2f" % ((var * -240.0) / min.to_f)).to_f
  end
end

def get_x_coordinate(row, max, known_parties)
  if max == 0
    return 0
  end
  if known_parties.keys.include?(row[:primer_partido_id])
    x_coordinate = ((row[:primer_partido_percent] - row[:segundo_partido_percent]).to_f * 200.0) / max
    x_coordinate += 100.0
    x_coordinate = x_coordinate*-1 if LEFT_PARTIES.include?(known_parties[row[:primer_partido_id]])
    return ("%.2f" % x_coordinate).to_f
  else
    return 0
  end
end

# ROJO : #D8282A, #D94B5F, #E08394
# AZUL:  #5AB0E9, #64B7DE, #90D7F4
# de mas intenso a menos intenso
def get_color(row, x, parties)
  primer_partido = parties[row[:primer_partido_id]]
  if primer_partido == "PSOE" || primer_partido.include?("PSOE")
    if x > -100
      ["#E08394"]
    elsif x > -200
      ["#D94B5F"]
    else
      ["#D8282A"]
    end
  elsif primer_partido == "PP" || primer_partido.include?("PP")
    if x < 100
      ["#90D7F4"]
    elsif x < 200
      ["#64B7DE"]
    else
      ["#5AB0E9"]
    end
  else
    THIRD_PARTY_COLORS[primer_partido] || ["#AAAAAA"]
  end
end

def get_radius(row)
  return 0 if row[:censo_total].to_f == 0
  if row[:votantes_totales] > row[:censo_total]
    row[:votantes_totales] = row[:censo_total]
  end
  return ("%.2f" % (((row[:votantes_totales].to_f / row[:censo_total].to_f) * 80.0) + 10.0)).to_f
end

def get_parties
  @get_parties ||= $cartodb.query("select cartodb_id, name from #{POLITICAL_PARTIES}")[:rows].inject({}){ |h, row| h[row[:cartodb_id]] = row[:name]; h}
end

def get_known_parties(parties)
  h = {}
  inverted = parties.invert
  PARTIES.each do |p|
    h[inverted[p]] = p
  end
  h
end

def autonomies_path(variable)
  "json/generated_data/autonomias/#{variable}.json"
end

def provinces_path(autonomy_name, variable)
  "json/generated_data/provincias/#{autonomy_name}_#{variable}.json"
end

def municipalities_path(province_name, variable)
  "json/generated_data/municipios/#{province_name}_#{variable}.json"
end

def google_cache_path(file_name)
  "../json/generated_data/google_names_cache/#{file_name.normalize}.json"
end

def get_authonomy_results(autonomy_name, proceso_electoral_id)
  # votes per autonomy
  query = <<-SQL
  select votantes_totales, censo_total, #{AUTONOMIAS_VOTATIONS}.gadm1_cartodb_id, proceso_electoral_id,
         primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent,
         tercer_partido_id, tercer_partido_percent, censo_total, votantes_totales, resto_partido_percent
  from #{AUTONOMIAS_VOTATIONS}, vars_socioeco_x_autonomia, gadm1
  where #{AUTONOMIAS_VOTATIONS}.gadm1_cartodb_id = vars_socioeco_x_autonomia.gadm1_cartodb_id AND
        gadm1.name_1 = '#{autonomy_name}' AND gadm1.cartodb_id = vars_socioeco_x_autonomia.gadm1_cartodb_id
        AND proceso_electoral_id = #{proceso_electoral_id}
SQL
  parties = get_parties
  if row = $cartodb.query(query)[:rows].first
    return {
      :partido_1 => [parties[row[:primer_partido_id]],  row[:primer_partido_percent] ],
      :partido_2 => [parties[row[:segundo_partido_id]], row[:segundo_partido_percent]],
      :partido_3 => [parties[row[:tercer_partido_id]],  row[:tercer_partido_percent] ],
      :otros     => ["Otros",                           row[:resto_partido_percent]  ]
    }
  else
    return {}
  end
end

def get_province_results(province_name, proceso_electoral_id)
  # votes per autonomy
  query = <<-SQL
  select votantes_totales, censo_total, #{PROVINCES_VOTATIONS}.gadm2_cartodb_id, proceso_electoral_id,
         primer_partido_id, primer_partido_percent, tercer_partido_id,
         segundo_partido_id, segundo_partido_percent, tercer_partido_percent,
         censo_total, votantes_totales, resto_partido_percent
  from #{PROVINCES_VOTATIONS}, vars_socioeco_x_provincia, gadm2
  where #{PROVINCES_VOTATIONS}.gadm2_cartodb_id = vars_socioeco_x_provincia.gadm2_cartodb_id AND
        vars_socioeco_x_provincia.gadm2_cartodb_id = gadm2.cartodb_id AND gadm2.name_2 = '#{province_name}'
SQL
  parties = get_parties
  rows = $cartodb.query(query)[:rows]
  if row = $cartodb.query(query)[:rows].first
    return {
      :partido_1 => [parties[row[:primer_partido_id]],  row[:primer_partido_percent] ],
      :partido_2 => [parties[row[:segundo_partido_id]], row[:segundo_partido_percent]],
      :partido_3 => [parties[row[:tercer_partido_id]],  row[:tercer_partido_percent] ],
      :otros     => ["Otros",                           row[:resto_partido_percent]  ]
    }
  else
    return {}
  end
end

def get_from_every_year(variables, values)
  result = []
  pos = 0
  variables_years = variables.map{ |v| v.match(/\d+/)[0].to_i }
  1975.upto(2011) do |year|
    if variables_years.include?(year)
      result << (values[pos].nil? ? 0 : ("%.2f" % values[pos]).to_f)
      pos += 1
    else
      result << 0
    end
  end
  result
end

def get_autonomies_variable_evolution(variable)
  custom_variable_name = variable.gsub(/_\d+/,'')
  raw_variables = $cartodb.query("select codigo, min_year, max_year from variables where min_gadm = 1 and codigo like '#{custom_variable_name}%'")[:rows]
  variables = []
  raw_variables.map do |raw_variable_hash|
    raw_variable_hash[:min_year].to_i.upto(raw_variable_hash[:max_year].to_i) do |year|
      next if %W{ uso_regular_internet_2009 }.include?("#{raw_variable_hash[:codigo]}_#{year}")
      variables << "#{raw_variable_hash[:codigo]}_#{year}"
    end
  end.flatten.compact
  # votes per autonomy
  query = <<-SQL
  select #{variables.join(',')}, gadm1.name_1 as name
  from vars_socioeco_x_autonomia, gadm1
  where gadm1.cartodb_id = vars_socioeco_x_autonomia.gadm1_cartodb_id
SQL
  values = $cartodb.query(query)[:rows] || []
  result = {}
  variable_year = variable.match(/\d+/)[0].to_i
  variable_name = variable.match(/[^\d]+/)[0][0..-2]
  values.each do |v|
    result[v[:name]] = []
    1975.upto(2011) do |year|
      temp_variable = "#{variable_name}_#{year}"
      result[v[:name]] << (variables.include?(temp_variable) ? ("%.2f" % (v[temp_variable.to_sym] || 0)).to_f : 0)
    end
  end
  result
end

def get_province_variable_evolution(custom_variable_name, province_name)
  raw_variables = $cartodb.query("select codigo, min_year, max_year from variables where max_gadm > 1 and codigo like '#{custom_variable_name}%'")[:rows]
  variables = []
  raw_variables.each do |raw_variable_hash|
    raw_variable_hash[:min_year].to_i.upto(raw_variable_hash[:max_year].to_i) do |year|
      variables << "#{raw_variable_hash[:codigo]}_#{year}"
    end
  end.flatten.compact
  query = <<-SQL
  select #{variables.join(',')}
  from vars_socioeco_x_provincia, gadm2
  where vars_socioeco_x_provincia.gadm2_cartodb_id = gadm2.cartodb_id AND gadm2.name_2 = '#{province_name}'
SQL
  values = $cartodb.query(query)[:rows].first.try(:values) || []
  return [] if values.empty?
  return get_from_every_year(variables, values)
end

def get_provinces_variable_evolution(custom_variable_name)
  raw_variables = $cartodb.query("select codigo, min_year, max_year from variables where max_gadm > 1 and codigo like '#{custom_variable_name}%'")[:rows]
  variables = []
  raw_variables.each do |raw_variable_hash|
    raw_variable_hash[:min_year].to_i.upto(raw_variable_hash[:max_year].to_i) do |year|
      variables << "#{raw_variable_hash[:codigo]}_#{year}"
    end
  end.flatten.compact
  query = <<-SQL
  select #{variables.join(',')}, name_2 as name
  from vars_socioeco_x_provincia, gadm2
  where vars_socioeco_x_provincia.gadm2_cartodb_id = gadm2.cartodb_id
SQL
  values = $cartodb.query(query)[:rows] || []
  result = {}
  values.each do |v|
    result[v[:name]] = []
    1975.upto(2011) do |year|
      temp_variable = "#{custom_variable_name}_#{year}"
      result[v[:name]] << (variables.include?(temp_variable) ? ("%.2f" % (v[temp_variable.to_sym] || 0)).to_f : 0)
    end
  end
  result
end

def get_municipalities_variable_evolution(custom_variable_name, municipality_name)
  raw_variables = $cartodb.query("select codigo, min_year, max_year from variables where max_gadm = 4 and codigo like '#{custom_variable_name}%'")[:rows]
  variables = []
  raw_variables.each do |raw_variable_hash|
    raw_variable_hash[:min_year].to_i.upto(raw_variable_hash[:max_year].to_i) do |year|
      variables << "#{raw_variable_hash[:codigo]}_#{year}"
    end
  end.flatten.compact
  query = <<-SQL
  select #{variables.join(',')}
  from vars_socioeco_x_municipio, gadm4
  where vars_socioeco_x_municipio.gadm4_cartodb_id = gadm4.cartodb_id AND gadm4.name_4 = '#{municipality_name.gsub(/\'/,"\\\'")}'
SQL
  values = $cartodb.query(query)[:rows].first.try(:values) || []
  return [] if values.empty?
  return get_from_every_year(variables, values)
end

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
      if row.proceso_electoral_year <= year
        data[:censo_total]             = row.censo_total
        data[:percen_participacion]    = row.percen_participacion
        data[:primer_partido_percent]  = row.primer_partido_percent
        data[:primer_partido_name]     = row.primer_partido_name
        data[:segundo_partido_percent] = row.segundo_partido_percent
        data[:segundo_partido_name]    = row.segundo_partido_name
        data[:tercer_partido_percent]  = row.tercer_partido_percent
        data[:tercer_partido_name]     = row.tercer_partido_name
        data[:otros_partido_percent]   = row.otros_partido_percent
      else
        break
      end
    end

    years[year] = data
  end

  years
end

def variables_vars
  supported_variables = %w('actividad_economica_normalizado' 'audiencia_diaria_tv' 'comercial_normalizado' 'edad_media_normalizada' 'envejecimiento_normalizado' 'inmigracion_normalizado' 'lineas_adsl' 'paro_normalizado' 'penetracion_internet' 'pib_normalizado' 'prensa_diaria' 'restauracion_normalizado' 'salario_medio_normalizado' 'saldo_vegetativo_normalizado' 'secundaria_acabada' 'uso_regular_internet')
  variables = get_cartodb_connection.query("SELECT codigo, min_year, max_year, min_gadm, max_gadm FROM variables WHERE codigo IN (#{supported_variables.join(', ')})").rows
  variables_hash = Hash[variables.map{|v| [v.codigo, {:max_year => v.max_year, :min_year => v.min_year}]}]
  max_year = variables.map(&:max_year).sort.last
  min_year = variables.map(&:min_year).sort.first

  [variables, variables_hash, max_year, min_year]
end

def vars_sql_select(socioeco_table)
  variables = *variables_vars.first
  tables = {
    1 => 'vars_socioeco_x_autonomia',
    2 => 'vars_socioeco_x_provincia',
    4 => 'vars_socioeco_x_municipio'
  }

  select = []
  variables.each do |variable|
    next unless tables[variable.max_gadm.to_i] == socioeco_table

    fields = []
    variable.min_year.upto(variable.max_year) do |year|
      select << "#{variable.codigo}_#{year}"
    end
    select << "#{variable.codigo}_min_max.*"

  end

  select.join(', ')
end

def vars_sql_froms(socioeco_table)
  variables = *variables_vars.first
  tables = {
    1 => 'vars_socioeco_x_autonomia',
    2 => 'vars_socioeco_x_provincia',
    4 => 'vars_socioeco_x_municipio'
  }

  froms = []
  variables.each do |variable|
    next unless tables[variable.max_gadm.to_i] == socioeco_table

    fields = []
    variable.min_year.upto(variable.max_year) do |year|
      fields << <<-SQL
        max(#{variable.codigo}_#{year}) as #{variable.codigo}_#{year}_max,
        min(#{variable.codigo}_#{year}) as #{variable.codigo}_#{year}_min
      SQL
    end

    froms << <<-SQL
      (SELECT
        #{fields.join(', ')}
      FROM #{socioeco_table}) AS #{variable.codigo}_min_max
    SQL
  end

  "#{froms.join(', ')},"
end

class String
  def normalize
    str = self.downcase
    return '' if str.blank?
    n = str.force_encoding("UTF-8")
    n.gsub!(/[àáâãäåāă]/,   'a')
    n.gsub!(/æ/,            'ae')
    n.gsub!(/[ďđ]/,          'd')
    n.gsub!(/[çćčĉċ]/,       'c')
    n.gsub!(/[èéêëēęěĕė]/,   'e')
    n.gsub!(/ƒ/,             'f')
    n.gsub!(/[ĝğġģ]/,        'g')
    n.gsub!(/[ĥħ]/,          'h')
    n.gsub!(/[ììíîïīĩĭ]/,    'i')
    n.gsub!(/[įıĳĵ]/,        'j')
    n.gsub!(/[ķĸ]/,          'k')
    n.gsub!(/[łľĺļŀ]/,       'l')
    n.gsub!(/[ñńňņŉŋ]/,      'n')
    n.gsub!(/[òóôõöøōőŏŏ]/,  'o')
    n.gsub!(/œ/,            'oe')
    n.gsub!(/ą/,             'q')
    n.gsub!(/[ŕřŗ]/,         'r')
    n.gsub!(/[śšşŝș]/,       's')
    n.gsub!(/[ťţŧț]/,        't')
    n.gsub!(/[ùúûüūůűŭũų]/,  'u')
    n.gsub!(/ŵ/,             'w')
    n.gsub!(/[ýÿŷ]/,         'y')
    n.gsub!(/[žżź]/,         'z')
    n.gsub!(/[ÀÁÂÃÄÅĀĂ]/i,    'A')
    n.gsub!(/Æ/i,            'AE')
    n.gsub!(/[ĎĐ]/i,          'D')
    n.gsub!(/[ÇĆČĈĊ]/i,       'C')
    n.gsub!(/[ÈÉÊËĒĘĚĔĖ]/i,   'E')
    n.gsub!(/Ƒ/i,             'F')
    n.gsub!(/[ĜĞĠĢ]/i,        'G')
    n.gsub!(/[ĤĦ]/i,          'H')
    n.gsub!(/[ÌÌÍÎÏĪĨĬ]/i,    'I')
    n.gsub!(/[ĲĴ]/i,          'J')
    n.gsub!(/[Ķĸ]/i,          'J')
    n.gsub!(/[ŁĽĹĻĿ]/i,       'L')
    n.gsub!(/[ÑŃŇŅŉŊ]/i,      'M')
    n.gsub!(/[ÒÓÔÕÖØŌŐŎŎ]/i,  'N')
    n.gsub!(/Œ/i,            'OE')
    n.gsub!(/Ą/i,             'Q')
    n.gsub!(/[ŔŘŖ]/i,         'R')
    n.gsub!(/[ŚŠŞŜȘ]/i,       'S')
    n.gsub!(/[ŤŢŦȚ]/i,        'T')
    n.gsub!(/[ÙÚÛÜŪŮŰŬŨŲ]/i,  'U')
    n.gsub!(/Ŵ/i,             'W')
    n.gsub!(/[ÝŸŶ]/i,         'Y')
    n.gsub!(/[ŽŻŹ]/i,         'Z')
    n.gsub!(/\s/i,         '_')
    n
  end
end
