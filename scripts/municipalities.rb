# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb        = get_cartodb_connection
processes      = get_processes
autonomies     = get_autonomies
provinces      = get_provinces
variables      = get_variables(4)
psoe_id, pp_id = get_psoe_pp_id
oauth_token    = "oauth_token=#{cartodb.send(:access_token).token}"
uri            =  URI.parse('https://api.cartodb.com/')

# Parse arguments
# n: the number of sub-arrays in which split the array of autonomies
# part: the part of the file to pick
if ARGV[0] =~ /\d+/
  n = ARGV[0].to_i
  if ARGV[1] =~ /\d+/
    autonomies = autonomies.in_groups(n)[ARGV[1].to_i].compact
  else
    raise "You should indicate which part of the array"
  end
end

base_path = FileUtils.pwd
dir_path = "#{base_path}/../json/generated_data/municipalities"
FileUtils.mkdir_p(dir_path)

### MUNICIPALITIES
##################

# Get OAuth token from cartodb client, because we are goint to
# fetch API via net/http library (because of the threads we use)
puts 
autonomies.each do |autonomy_hash|
  selected_provinces = provinces.select{ |p| p[:id_1] == autonomy_hash[:id_1] }
  if selected_provinces.empty?
    puts "Empty provinces for #{autonomy_hash.inspect}"
    next
  end
  selected_provinces.each do |province|
    province_name = province[:name_2].tr(' ','_')
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
    variables.each do |variable|
      proceso_electoral_id = processes[variable.match(/\d+/)[0].to_i]
      json = {}
      votes_per_municipality = JSON.parse(response.body)["rows"].select{ |h| h["proceso_electoral_id"] == proceso_electoral_id }
      max_y = votes_per_municipality.map{ |h| h[variable].to_f }.compact.max
      max_x = votes_per_municipality.map{|h| h["primer_partido_percent"].to_f - h["segundo_partido_percent"].to_f }.compact.max
      votes_per_municipality.each do |municipality|
        municipality.symbolize_keys!
        putc '.'
        municipality_name = municipality[:name_4].tr(' ','_')
        json[municipality_name] ||= {}
        json[municipality_name][:cartodb_id]   = municipality[:cartodb_id]
        json[municipality_name][:x_coordinate] = x_coordinate = get_x_coordinate(municipality, max_x, psoe_id, pp_id)
        json[municipality_name][:y_coordinate] = get_y_coordinate(municipality, variable.to_sym, max_y)
        json[municipality_name][:radius]       = get_radius(municipality)
        json[municipality_name][:color]        = get_color(x_coordinate)
        json[municipality_name][:children_json_url] = nil
      end
      fd = File.open(municipalities_path(province_name,variable),'w+')
      fd.write(json.to_json)
      fd.close        
    end
  end
end