# coding: UTF-8

require File.dirname(__FILE__) + "/common"
require 'csv'

base_url1 = "http://resultados-elecciones.rtve.es/multimedia/xml/2011/ES/RESULTADOS/2011-M-RESULTADOS-<union_url>-DATOS-ES.xml"
base_url2 = "http://resultados-elecciones.rtve.es/multimedia/xml/2011/ES/PARTICIPACION/2011-M-PARTICIPACION-<union_url>-DATOS-ES.xml"

i = 1
fd = File.open("urls/urls-#{i}.log",'w+')
CSV.read('elections-day/pueblos_reconciliados_lavinia_ine.csv', :encoding => "".encoding).each do |row|
  next if row[3] == 'true' || row[4] == 'true'
  url1 = base_url1.gsub(/<union_url>/,row[9])
  url2 = base_url2.gsub(/<union_url>/,row[9])
  fd.write(url1+"\n"+url2+"\n")
  i+=1
  if(i%1000 == 0)
    fd.close
    fd = File.open("urls/urls-#{i}.log",'w+')
  end
end
fd.close