require 'net/http'
require 'rexml/document'
require 'xmlsimple'

part = "http://resultados-elecciones.rtve.es/multimedia/xml/2011/ES/PARTICIPACION/2011-M-PARTICIPACION-madrid-madrid-centro-DATOS-ES.xml"
res  = "http://resultados-elecciones.rtve.es/multimedia/xml/2011/ES/RESULTADOS/2011-M-RESULTADOS-madrid-madrid-centro-DATOS-ES.xml"

xml_data = Net::HTTP.get_response(URI.parse(res)).body
data = XmlSimple.xml_in(xml_data)

# extract event information
partidos = []


data["PARTIDOS"].each do |partido|
  partidos << {}
   item.sort.each do |k, v|
      if ["Title", "Url"].include? k
         print "#{v[0]}" if k=="Title"
         print " => #{v[0]}\n" if k=="Url"
      end
   end
end


# print all events
