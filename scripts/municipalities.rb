# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb        = get_cartodb_connection
psoe_id, pp_id = get_psoe_pp_id
processes      = get_processes
autonomies     = get_autonomies
provinces      = get_provinces
variables      = get_variables(4)

base_path = FileUtils.pwd

### MUNICIPALITIES
##################
puts

oauth_token = "oauth_token=#{cartodb.send(:access_token).token}"

uri = URI.parse('https://api.cartodb.com/')

if ARGV[0] =~ /\d+/
  n = ARGV[0].to_i
  if ARGV[1] =~ /\d+/
    part = ARGV[1].to_i
  else
    raise "You should indicate which part of the array"
  end
end

# n: the number of sub-arrays in which split the array of autonomies
# part: the part of the file to pick
if n
  autonomies = autonomies.in_groups(n)[part]
end
puts 
autonomies.each do |autonomy_hash|
  threads = []
  provinces.select{ |p| p[:id_1] == autonomy_hash[:id_1] }.each do |province|
    threads << Thread.new(province) do |province|      
      query = <<-SQL
select #{MUNICIPALITIES_TABLE}.cartodb_id, name_4, votantes_totales, censo_total, #{MUNICIPALITIES_VOTATIONS}.gadm4_cartodb_id, 
       proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent,
       #{variables.join(',')}
from   #{MUNICIPALITIES_TABLE}, #{MUNICIPALITIES_VOTATIONS}, vars_socioeco_x_municipio
where #{MUNICIPALITIES_VOTATIONS}.gadm4_cartodb_id = #{MUNICIPALITIES_TABLE}.cartodb_id AND 
      vars_socioeco_x_municipio.gadm4_cartodb_id = #{MUNICIPALITIES_VOTATIONS}.gadm4_cartodb_id AND
      #{MUNICIPALITIES_TABLE}.id_2 = #{province[:id_2]}
SQL
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request = Net::HTTP::Get.new("/v1?sql=#{CGI.escape(query)}&#{oauth_token}")
      response = http.request(request)
      JSON.parse(response.body)["rows"].each do |municipality|
        variables.each do |variable|
          proceso_electoral_id = processes[variable.match(/\d+/)[0].to_i]
          row = municipality
          dir_path = "#{base_path}/../json/generated_data/#{variable}/autonomies/#{autonomy_hash[:name_1]}/provinces/#{province[:name_2]}/municipalities/#{municipality['name_4']}"
          FileUtils.mkdir_p(dir_path)
          if row["primer_partido_id"].to_i != psoe_id && row["primer_partido_id"].to_i != pp_id
            x_coordinate = 0
          else
            x_coordinate = ((row["primer_partido_percent"] - row["segundo_partido_percent"]).to_f * 300.0) / 100.0
            x_coordinate = x_coordinate*-1 if row["primer_partido_id"] == psoe_id
          end
          radius = ((row["votantes_totales"].to_f / row["censo_total"].to_f) * 6000.0) / 100.0 + 20.0
          variables.each do |variable|
            putc '.'
            json = {}
            json[municipality["name_4"]] ||= {}
            json[municipality["name_4"]]["cartodb_id"] = municipality["cartodb_id"]
            json[municipality["name_4"]]["x_coordinate"] = x_coordinate
            json[municipality["name_4"]]["y_coordinate"] = get_y_coordinate(row, variable.to_s)
            json[municipality["name_4"]]["radius"] = radius.to_i
            json[municipality["name_4"]]["parent_json_url"] = nil
            fd = File.open("#{dir_path}/#{variable}.json",'w+')
            fd.write(json.to_json)
            fd.close        
          end
        end
      end
    end
  end
  threads.each{ |t| t.join }
end