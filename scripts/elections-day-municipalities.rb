# coding: UTF-8

require File.dirname(__FILE__) + "/common"
require "libxml"
require 'uri'
require 'logger'
require 'open-uri'

include LibXML

$parties = get_parties
$rparties = $parties.invert

class MunicipalityParticipation
  include XML::SaxParser::Callbacks
  
  def on_start_document
    @result = {}
    @votantes_totales = nil
    @votos_en_blanco = nil
    @votos_nulos = nil
    @abstencion = nil
  end
  
  def on_start_element(element, attributes)
    case element
      when 'NULOS_ABSOLUTO'
        @in_element = element
      when 'EN_BLANCO_ABSOLUTO'
        @in_element = element
      when 'PARTICIPACION_ABSOLUTO'
        @in_element = element
      when 'ABSTENCION_ABSOLUTO'
        @in_element = element
    end
  end
  
  def on_end_element(element)
    @in_element = nil
  end
  
  def on_characters(chars)
    case @in_element
      when 'NULOS_ABSOLUTO'
        @votos_nulos = chars.to_i
      when 'EN_BLANCO_ABSOLUTO'
        @votos_en_blanco = chars.to_i
      when 'PARTICIPACION_ABSOLUTO'
        @votantes_totales = chars.to_i
      when 'ABSTENCION_ABSOLUTO'
        @abstencion = chars.to_i
    end
  end
  
  def on_end_document
    @final_result = {
      :mesas_electorales => nil, :censo_total=>(@votos_nulos + @votos_en_blanco + @votantes_totales + @abstencion), :votantes_totales=>@votantes_totales, :votos_validos=>(@votantes_totales - @votos_en_blanco - @votos_nulos), :votos_en_blanco=>@votos_en_blanco, :votos_nulos=>@votos_nulos, 
    }
  end
  
  def result
    @final_result
  end
  
end

class MunicipalityVotes
  include XML::SaxParser::Callbacks
  
  def initialize(municipio_id, codinemuni, codineprov)
    @municipio_id = municipio_id
    @codinemuni = codinemuni
    @codineprov = codineprov
  end
  
  def on_start_document
    @in_party = false
    @party_name = nil
    @result = {}
    @name = false
  end
  
  def on_start_element(element, attributes)
    if element == 'ZONA'
      @municipality_name = nil
    elsif element == 'PARTIDO'
      @in_party = true
      @party_name = nil
    elsif element == 'SIGLAS'
      @almost_party_name = true
    elsif element == 'PORCENTAJE'
      @almost_percentage = true
    elsif element == 'VOTOS'
      @almost_votes = true
    elsif element == 'NOMBRE'
      unless @in_party
        @name = true
      end
    end    
  end
  
  def on_end_element(element)
    case element
      when 'PARTIDO'
        @in_party = false
      when'PORCENTAJE'
        @almost_percentage = false
      when 'VOTOS'
        @almost_votes = false
      when 'SIGLAS'
        @almost_party_name = false
      when 'NOMBRE'
        @name = false
    end
  end
  
  def on_cdata_block(cdata)
    if @name
      @municipality_name = cdata
      @result["Partidos"] ||= {}
    elsif @almost_party_name
      @party_name = cdata
      @result["Partidos"][@party_name] ||= {"Votos" => nil, "Porcentaje" => nil}
    end
  end
  
  def on_characters(chars)
    if @almost_percentage
      @result["Partidos"][@party_name]["Porcentaje"] = chars.strip.to_f
    elsif @almost_votes
      @result["Partidos"][@party_name]["Votos"] = chars.strip.to_f
    end
  end
  
  def on_end_document
    array = @result['Partidos'].map do |party_name,values|
      [party_name, values['Votos'],values['Porcentaje']]
    end
    # Insert all non existing parties
    array.each do |p|
      if $rparties[p[0]].nil?
        $cartodb.query("INSERT INTO partidos_politicos (name) VALUES ('#{p[0].gsub(/\'/,"\\\'")}')").rows
        puts "Insertando #{p[0]} en partidos_politicos" 
        $parties = get_parties
      end
    end
    
    @final_result = {
      :municipio_id => @municipio_id, :proceso_electoral_id => 666, 
      :mesas_electorales => nil, :censo_total=>nil, :votantes_totales=>nil, :votos_validos=>nil, :votos_en_blanco=>nil, :votos_nulos=>nil, 
      :primer_partido_id=>$rparties[array[0][0]], :segundo_partido_id=>$rparties[array[1][0]], :tercer_partido_id=>$rparties[array[2][0]], 
      :resto_partido_votos=>array[3..-1].inject(0){|sum,e| sum+=e[1]; sum}, :resto_partido_percent=>(100 - array[0][2].to_i - array[1][2].to_i - array[2][2].to_i), 
      :primer_partido_votos=>array[0][1], :primer_partido_percent=>array[0][2], 
      :segundo_partido_votos=>array[1][1], :segundo_partido_percent=>array[1][2], :tercer_partido_votos=>array[2][1], :tercer_partido_percent=>array[0][2], 
      :codinemuni=>@codinemuni, :codineprov=>@codineprov 
    }
  end
  
  def result
    @final_result
  end  
end

autonomies_ine = {
  1 => "andalucia",
  2 => "aragon",
  3 => "asturias",
  4 => "illes-balears",
  5 => "canarias",
  6 => "cantabria",
  7 => "castilla-y-leon",
  8 => "castilla-la-mancha",
  9 => "catalunya",
  10 => "comunitat-valenciana",
  11 => "extremadura",
  12 => "galicia",
  13 => "madrid",
  14 => "murcia",
  15 => "navarra",
  16 => "pais-vasco",
  17 => "la-rioja",
  18 => "ceuta",
  19 => "melilla"
}

provinces_ine = {
  1 => "alava",
  2 => "albacete",
  3 => "alicante",
  4 => "almeria",
  5 => "avila",
  6 => "badajoz",
  7 => "illes-balears",
  8 => "barcelona",
  9 => "burgos",
  10 => "caceres",
  11 => "cadiz",
  12 => "castellon",
  13 => "ciudad-real",
  14 => "cordoba",
  15 => "a-coruna",
  16 => "cuenca",
  17 => "girona",
  18 => "granada",
  19 => "guadalajara",
  20 => "guipuzcoa",
  21 => "huelva",
  22 => "huesca",
  23 => "jaen",
  24 => "leon",
  25 => "lleida",
  26 => "la-rioja",
  27 => "lugo",
  28 => "madrid",
  29 => "malaga",
  30 => "murcia",
  31 => "navarra",
  32 => "ourense",
  33 => "asturias",
  34 => "palencia",
  35 => "las-palmas",
  36 => "pontevedra",
  37 => "salamanca",
  38 => "santa-cruz-de-tenerife",
  39 => "cantabria",
  40 => "segovia",
  41 => "sevilla",
  42 => "soria",
  43 => "tarragona",
  44 => "teruel",
  45 => "toledo",
  46 => "valencia",
  47 => "valladolid",
  48 => "vizcaya",
  49 => "zamora",
  50 => "zaragoza",
  51 => "ceuta",
  52 => "melilla"
}


# Get all urls
##############
#
# http://resultados-elecciones.rtve.es/multimedia/xml/2011/ES/RESULTADOS/2011-M-RESULTADOS-[CCAA]-[PROVINCIA]-[MUNICIPIO]-DATOS-ES.xml
# http://resultados-elecciones.rtve.es/multimedia/xml/2011/ES/RESULTADOS/2011-M-PARTICIPACION-[CCAA]-[PROVINCIA]-[MUNICIPIO]-DATOS-ES-DATOS-ES.xml
# base_url = "xmls/2011-M-RESULTADOS-<autonomy>-<province>-<municipality>-DATOS-ES.xml"
#
# autonomies     = get_autonomies
# all_provinces  = get_provinces
# autonomies.each do |autonomy|
#   provinces = all_provinces.select{ |p| p[:id_1] == autonomy[:id_1] }
#   provinces.each do |province|
#     # puts "autonomies_ine[#{autonomy[:cc_1].to_i}]: #{autonomies_ine[autonomy[:cc_1].to_i]} - provinces_ine[#{province[:cc_2]}]: #{provinces_ine[province[:cc_2].to_i]}"
#     municipalities = get_municipalities(province[:name_2])
#     municipalities.each do |municipality|
#       next if municipality[:name].blank?
#       url = base_url.gsub(/<autonomy>/,autonomies_ine[autonomy[:cc_1].to_i])
#                     .gsub(/<province>/,provinces_ine[province[:cc_2].to_i]) 
#                     .gsub(/<municipality>/,municipality[:name])
#       puts url
#     end
#   end
# end

file = File.open('output.log', 'w+')
logger = Logger.new(file)
logger.info "****\n"
logger.info "Starting process at #{Time.now}"

# Constant
proceso_electoral_id = 74

url = "http://resultados-elecciones.rtve.es/multimedia/xml/2011/ES/RESULTADOS/2011-M-RESULTADOS-madrid-madrid-madrid-DATOS-ES.xml"
begin
  parser = XML::SaxParser.io(open(url))
  parser.callbacks = MunicipalityVotes.new(1,2,3)
  parser.parse

  temporal_result = parser.callbacks.result
rescue OpenURI::HTTPError
  logger.info "[ERROR] #{$!} - #{url}"
  temporal_result = {}
end

url = "http://resultados-elecciones.rtve.es/multimedia/xml/2011/ES/PARTICIPACION/2011-M-PARTICIPACION-madrid-madrid-madrid-DATOS-ES.xml"
begin
  parser = XML::SaxParser.io(open(url))
  parser.callbacks = MunicipalityParticipation.new
  parser.parse

  puts temporal_result.merge(parser.callbacks.result).inspect
rescue OpenURI::HTTPError
  logger.info "[ERROR] #{$!}"
  puts "Nothing"
end

logger.info "Finishing process at #{Time.now}"
