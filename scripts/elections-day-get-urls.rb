# coding: UTF-8

require File.dirname(__FILE__) + "/common"
require "libxml"
require 'uri'
require 'logger'
require 'open-uri'
require 'csv'

zonas = CSV.read('elections-day/rel_zonas.csv', :encoding => "".encoding).inject({}) do |h,e| 
  h[e.first] = e.last
  h
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
# http://resultados-elecciones.rtve.es/multimedia/xml/2011/ES/RESULTADOS/2011-M-PARTICIPACION-[CCAA]-[PROVINCIA]-[MUNICIPIO]-DATOS-ES.xml
base_url1 = "http://resultados-elecciones.rtve.es/multimedia/xml/2011/ES/RESULTADOS/2011-M-RESULTADOS-<autonomy>-<province>-<municipality>-DATOS-ES.xml"
base_url2 = "http://resultados-elecciones.rtve.es/multimedia/xml/2011/ES/PARTICIPACION/2011-M-PARTICIPACION-<autonomy>-<province>-<municipality>-DATOS-ES.xml"

puts "Starting...."
autonomies     = get_autonomies
all_provinces  = get_provinces

rows = []
autonomies.each do |autonomy|
  fd = File.open("urls/urls-#{autonomy[:id_1]}.txt", 'w+')
  provinces = all_provinces.select{ |p| p[:id_1] == autonomy[:id_1] }
  provinces.each do |province|
    # puts "autonomies_ine[#{autonomy[:cc_1].to_i}]: #{autonomies_ine[autonomy[:cc_1].to_i]} - provinces_ine[#{province[:cc_2]}]: #{provinces_ine[province[:cc_2].to_i]}"
    municipalities = get_municipalities(province[:name_2])
    municipalities.each do |municipality|
      next if municipality[:name2].blank?
      municipality_name = zonas[municipality[:name2]]
      if municipality_name.nil?
        m = zonas.keys.select{|k| k.include?(municipality[:name2]) }
        if m.size > 0
          municipality_name = zonas[m[0]]
        else
          fd.write("KO0 No existe correspondencia para #{municipality.inspect}\n")
          next
        end
      end
      url1 = base_url1.gsub(/<autonomy>/,autonomies_ine[autonomy[:cc_1].to_i])
                      .gsub(/<province>/,provinces_ine[province[:cc_2].to_i]) 
                      .gsub(/<municipality>/,municipality_name)
      url2 = base_url2.gsub(/<autonomy>/,autonomies_ine[autonomy[:cc_1].to_i])
                      .gsub(/<province>/,provinces_ine[province[:cc_2].to_i]) 
                      .gsub(/<municipality>/,municipality_name)
      # uri1 = URI.parse(url1)
      # uri2 = URI.parse(url2)
      # next if uri1.nil? || uri2.nil?
      # response1 = nil
      # Net::HTTP.start(uri1.host, uri1.port) do |http|
      #   response1 = http.head(uri1.path)
      # end
      # response2 = nil
      # Net::HTTP.start(uri2.host, uri2.port) do |http|
      #   response2 = http.head(uri2.path)
      # end
      # fd.write "KO1 #{url1.split('/').last}\n" if response1.code == "404"
      # fd.write "KO2 #{url2.split('/').last}\n" if response2.code == "404"
      fd.write url1 + "\n"# if response1.code == "200"
      fd.write url2 + "\n"# if response2.code == "200"
      #if response1.code == "200" && response2.code == "200"        
        rows << [url1,municipality[:cartodb_id],municipality[:codineprov],municipality[:codinemuni]]
      #end
      putc '.'
    end
  end
  fd.close
end

CSV.open("elections-day/matching-with-municipalities.csv", "wb") do |csv|
  rows.each do |row|
    csv << row
  end
end