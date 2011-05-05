# coding: UTF-8

require "rubygems"
require "bundler/setup"
require "cartodb-rb-client"
require "ruby-debug"
require "net/https"
require 'uri'
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

def get_psoe_pp_id
  # political parties
  political_parties = $cartodb.query("select cartodb_id, name from #{POLITICAL_PARTIES}")[:rows]
  psoe_id = political_parties.select{ |h| h[:name] == "PSOE"}.first[:cartodb_id].to_i
  pp_id   = political_parties.select{ |h| h[:name] == "PP"}.first[:cartodb_id].to_i
  return psoe_id, pp_id  
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
  raw_variables.map do |raw_variable_hash|
    # next if !VARIABLES.include?(raw_variable_hash[:codigo])
    next if gadm_level.to_i < raw_variable_hash[:min_gadm].to_i || gadm_level.to_i > raw_variable_hash[:max_gadm].to_i
    min_year = raw_variable_hash[:min_year].to_i
    max_year = raw_variable_hash[:max_year].to_i
    processes.map do |k,v|
      next if k.to_i < min_year || k.to_i > max_year
      "#{raw_variable_hash[:codigo]}_#{k}"
    end
  end.flatten.compact
end

def get_y_coordinate(row, variable, max)
  return nil if max.to_f == 0
  if variable.to_s =~ /^paro_normalizado/
    if row[variable].to_s == "9999999"
      return nil
    else
      val = (row[variable].to_f * 150.0) / max.to_f
      if val > 0
        return val + 100
      elsif val < 0
        return -100 - val
      end
    end
  elsif variable.to_s =~ /^edad_media_normalizada/
    if row[variable].to_s == "9999999"
      return nil
    else
      return (row[variable].to_f * 100.0) / 9.0
    end
  else
    row[variable]
  end
end

def get_x_coordinate(row, max, psoe_id, pp_id)
  if max == 0
    return 0
  end
  if row[:primer_partido_id].to_i != psoe_id && row[:primer_partido_id].to_i != pp_id
    return 0
  else
    x_coordinate = ((row[:primer_partido_percent] - row[:segundo_partido_percent]).to_f * 200.0) / max
    x_coordinate += 100.0
    x_coordinate = x_coordinate*-1 if row[:primer_partido_id] == psoe_id
    return x_coordinate
  end
end

# ROJO : #D8282A, #D94B5F, #E08394
# AZUL:  #5AB0E9, #64B7DE, #90D7F4
# de mas intenso a menos intenso
def get_color(x)
  if x < 0
    if x > -100
      "#E08394"
    elsif x > -200
      "#D94B5F"
    else
      "#D8282A"
    end
  elsif x > 0
    if x < 100
      "#90D7F4"
    elsif x < 200
      "#64B7DE"
    else
      "#5AB0E9"
    end
  else
    "#AAA"
  end
end

def get_radius(row)
  return 0 if row[:censo_total].to_f == 0
  if row[:votantes_totales] > row[:censo_total]
    # puts "#{row[:ine_province_id]},#{row[:ine_municipality_id]}"
    return 80
  else
    return ((row[:votantes_totales].to_f / row[:censo_total].to_f) * 60.0) + 20.0
  end
end

def autonomies_path(variable)
  "../json/generated_data/autonomies_#{variable}.json"
end

def provinces_path(autonomy_name, variable)
  "../json/generated_data/provinces/#{autonomy_name}_#{variable}.json"
end

def municipalities_path(province_name, variable)
  "../json/generated_data/municipalities/#{province_name}_#{variable}.json"  
end