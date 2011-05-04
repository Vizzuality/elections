# coding: UTF-8

require "rubygems"
require "bundler/setup"
require "cartodb-rb-client"
require "ruby-debug"
require "net/https"
require 'uri'

# Tables names
POLITICAL_PARTIES     = "partidos_politicos"
PROCESOS_NAME         = "procesos_electorales"
AUTONOMIAS_TABLE      = "gadm1"
AUTONOMIAS_VOTATIONS  = "votaciones_por_autonomia"
PROVINCES_TABLE       = "gadm2"
PROVINCES_VOTATIONS   = "votaciones_por_provincia"
MUNICIPALITIES_TABLE  = "gadm4"
MUNICIPALITIES_VOTATIONS = "votaciones_por_municipio"
#####

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
  $cartodb.query("select cartodb_id, anyo from #{PROCESOS_NAME}")[:rows]
end

def get_autonomies
  $cartodb.query("select cartodb_id, id_1, name_1 from #{AUTONOMIAS_TABLE}")[:rows]
end

def get_provinces
  $cartodb.query("select cartodb_id, id_1, id_2, name_2 from #{PROVINCES_TABLE}")[:rows]
end

def get_variables
  [:age, :pib]
end