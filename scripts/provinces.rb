# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb        = get_cartodb_connection
psoe_id, pp_id = get_psoe_pp_id
processes      = get_processes
autonomies     = get_autonomies
provinces      = get_provinces
variables      = get_variables

query = <<-SQL
select votantes_totales, censo_total, #{PROVINCES_VOTATIONS}.gadm2_cartodb_id, proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent,
       #{variables.join(',')}
from #{PROVINCES_VOTATIONS}, vars_socioeco_x_provincia
where #{PROVINCES_VOTATIONS}.gadm2_cartodb_id = vars_socioeco_x_provincia.gadm2_cartodb_id
SQL
votes_per_province = cartodb.query(query)[:rows]

base_path = FileUtils.pwd

### PROVINCES
#############
puts
autonomies.each do |autonomy_hash|
  provinces.select{ |p| p[:id_1] == autonomy_hash[:id_1] }.each do |province|
    variables.each do |variable|
      dir_path = "#{base_path}/../json/generated_data/#{variable}/autonomies/#{autonomy_hash[:name_1]}/provinces/#{province[:name_2]}"
      FileUtils.mkdir_p(dir_path)
      json = {}
      proceso_electoral_id = processes[variable.match(/\d+/)[0].to_i]
      row = votes_per_province.select{|h| h[:gadm2_cartodb_id] == province[:cartodb_id] && h[:proceso_electoral_id] == proceso_electoral_id }.first
      unless row
        putc 'x'
        next
      end
      putc '.'
      if row[:primer_partido_id].to_i != psoe_id && row[:primer_partido_id].to_i != pp_id
        x_coordinate = 0
      else
        x_coordinate = ((row[:primer_partido_percent] - row[:segundo_partido_percent]).to_f * 300.0) / 100.0
        x_coordinate = x_coordinate*-1 if row[:primer_partido_id] == psoe_id
      end
      radius = ((row[:votantes_totales].to_f / row[:censo_total].to_f) * 6000.0) / 100.0 + 20.0
      json[province[:name_2]] ||= {}
      json[province[:name_2]][:cartodb_id] = province[:cartodb_id]
      json[province[:name_2]][:x_coordinate] = x_coordinate
      json[province[:name_2]][:y_coordinate] = get_y_coordinate(row, variable.to_sym)
      json[province[:name_2]][:radius] = radius.to_i
      json[province[:name_2]][:parent_json_url] = nil
      fd = File.open("#{dir_path}/#{variable}.json",'w+')
      fd.write(json.to_json)
      fd.close        
    end
  end
end
