# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb        = get_cartodb_connection
psoe_id, pp_id = get_psoe_pp_id
processes      = get_processes
autonomies     = get_autonomies
provinces      = get_provinces
variables      = get_variables

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

municipalities_not_found = 0
autonomies.each do |autonomy_hash|
  threads = []
  provinces.select{ |p| p[:id_1] == autonomy_hash[:id_1] }.each do |province|
    threads << Thread.new(province) do |province|
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request = Net::HTTP::Get.new("/v1?sql=#{CGI.escape("select cartodb_id, id_2, id_4, name_4 from #{MUNICIPALITIES_TABLE} where id_2 = #{province[:id_2]}")}&#{oauth_token}")
      response = http.request(request)
      municipalities = JSON.parse(response.body)["rows"]
      municipalities.each do |municipality|
        found = true
        query = <<-SQL
select votantes_totales, censo_total, #{MUNICIPALITIES_VOTATIONS}.gadm4_cartodb_id, proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent,
       #{variables.join(',')}
from #{MUNICIPALITIES_VOTATIONS}, vars_socioeco_x_municipio
where #{MUNICIPALITIES_VOTATIONS}.gadm4_cartodb_id = #{municipality['cartodb_id']} AND vars_socioeco_x_municipio.gadm4_cartodb_id = #{MUNICIPALITIES_VOTATIONS}.gadm4_cartodb_id
SQL
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
        request = Net::HTTP::Get.new("/v1?sql=#{CGI.escape(query.strip)}&#{oauth_token}")
        response = http.request(request)
        votes_per_municipality = JSON.parse(response.body)["rows"]
        variables.each do |variable|
          next unless found
          proceso_electoral_id = processes[variable.match(/\d+/)[0].to_i]
          unless row = votes_per_municipality.select{|h| h["gadm4_cartodb_id"] == municipality['cartodb_id'] && h["proceso_electoral_id"] == proceso_electoral_id }.first
            puts "Not found for gadm4_cartodb_id: #{municipality['cartodb_id']} && proceso_electoral_id = #{proceso_electoral_id}"
            found = false
            next
          end
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

puts "Not found #{municipalities_not_found} municipalities"
