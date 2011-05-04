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
    raise "You should indicate which part"
  end
end

class Array
  def in_groups(number, fill_with = nil)
    # size / number gives minor group size;
    # size % number gives how many objects need extra accomodation;
    # each group hold either division or division + 1 items.
    division = size / number
    modulo = size % number

    # create a new array avoiding dup
    groups = []
    start = 0

    number.times do |index|
      length = division + (modulo > 0 && modulo > index ? 1 : 0)
      padding = fill_with != false &&
        modulo > 0 && length == division ? 1 : 0
      groups << slice(start, length).concat([fill_with] * padding)
      start += length
    end

    if block_given?
      groups.each{|g| yield(g) }
    else
      groups
    end
  end
end

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
        query = <<-SQL
  select votantes_totales, censo_total, gadm4_cartodb_id, proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent 
  from #{MUNICIPALITIES_VOTATIONS}
  where gadm4_cartodb_id = #{municipality['cartodb_id']}
  SQL
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
        request = Net::HTTP::Get.new("/v1?sql=#{CGI.escape(query.strip)}&#{oauth_token}")
        response = http.request(request)
        votes_per_municipality = JSON.parse(response.body)["rows"]
        processes.each do |process_hash|
          dir_path = "#{base_path}/../json/generated_data/#{process_hash[:anyo]}/autonomies/#{autonomy_hash[:name_1]}/provinces/#{province[:name_2]}/municipalities/#{municipality['name_4']}"
          FileUtils.mkdir_p(dir_path)
          unless row = votes_per_municipality.select{|h| h["gadm4_cartodb_id"] == municipality['cartodb_id'] && h["proceso_electoral_id"] == process_hash[:cartodb_id] }.first
            municipalities_not_found += 1
            putc 'x'
            next
          end
          putc '.'
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
            json[municipality["name_4"]]["y_coordinate"] = (rand(100.0) * rand(3)) + rand(10.0)
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
