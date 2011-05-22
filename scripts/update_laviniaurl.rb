# coding: UTF-8

require File.dirname(__FILE__) + "/common"
require 'csv'

update = ""
CSV.read('elections-day/pueblos_reconciliados_lavinia_ine.csv', :encoding => "".encoding).each do |row|
  next if row[10].blank? || row[3] == 'true' || row[4] == 'true' || row[0] == 'autonomia' || row[8].blank?
  update += "UPDATE ine_poly  SET lavinia_url = '#{row[8]}' where cartodb_id = #{row[10]};\n"
end
fd = File.open("updates.sql",'w+')
fd.write(update)
fd.close
