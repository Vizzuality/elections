# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb        = get_cartodb_connection
processes      = get_processes
autonomies     = get_autonomies
provinces      = get_provinces
variables      = get_variables(4)
parties        = get_parties
parties_known  = get_known_parties(parties)
puts "Starting evolution...."
evolution      = get_variables_evolution_in_municipalities
puts "Finishing..."
province_results = get_province_results
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
dir_path = "#{base_path}/../graphs/municipios/#{$graphs_next_version}"
FileUtils.mkdir_p(dir_path)
### MUNICIPALITIES
##################

# Get OAuth token from cartodb client, because we are goint to
# fetch API via net/http library (because of the threads we use)
puts 
variables_json = {}
autonomies.each do |autonomy_hash|
  autonomy_name = autonomy_hash[:name_1].normalize
  provinces.select{ |p| p[:id_1] == autonomy_hash[:id_1] }.each do |province|
    province_name = province[:name_2].normalize
    province_id = province[:id_2]
    query = <<-SQL
select nombre, votantes_totales, censo_total,
   proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent,
   tercer_partido_id, tercer_partido_percent, censo_total, votantes_totales, resto_partido_percent,
   #{variables.join(',')}
from  vars_socioeco_x_municipio, votaciones_por_municipio, ine_poly, gadm2
where ine_poly.ine_prov_int = votaciones_por_municipio.codineprov::integer and ine_poly.ine_muni_int = votaciones_por_municipio.codinemuni::integer and
      vars_socioeco_x_municipio.gadm4_cartodb_id = ine_poly.cartodb_id and gadm2.cc_2::integer = ine_poly.ine_prov_int and gadm2.id_2 = #{province[:id_2]}
SQL
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    request = Net::HTTP::Get.new("/v1?sql=#{CGI.escape(query)}&#{oauth_token}")
    response = http.request(request)
    variables.each do |variable|
      custom_variable_name = variable.gsub(/_\d+/,'')
      variables_json[custom_variable_name] ||= []
      unless proceso_electoral_id = processes[variable.match(/\d+/)[0].to_i]  
        year = variable.match(/\d+/)[0].to_i
        while proceso_electoral_id.nil? && year > 1975
          year -= 1
          proceso_electoral_id = processes[year]
        end
      end
      next if year == 1974
      year ||= variable.match(/\d+/)[0].to_i
      variables_json[custom_variable_name] << variable.match(/\d+/)[0].to_i
      json = {}
      votes_per_municipality = Yajl::Parser.new.parse(response.body)["rows"]
      next if votes_per_municipality.nil?
      votes_per_municipality = votes_per_municipality.select{ |h| h["proceso_electoral_id"] == proceso_electoral_id }
      max_y = votes_per_municipality.map{ |h| h[variable].to_f }.compact.max
      min_y = votes_per_municipality.map{ |h| h[variable].to_f }.compact.min
      max_x = votes_per_municipality.map{|h| h["primer_partido_percent"].to_f - h["segundo_partido_percent"].to_f }.compact.max
      votes_per_municipality.sort{ |b,a| a["censo_total"].to_i <=> b["censo_total"].to_i}.each do |municipality|
        municipality.symbolize_keys!
        municipality_name = municipality[:nombre].normalize
        json[municipality_name] ||= {}
        json[municipality_name][:cartodb_id]   = municipality[:cartodb_id]
        json[municipality_name][:name] = municipality[:nombre]
        json[municipality_name][:x_coordinate] = x_coordinate = get_x_coordinate(municipality, max_x, parties_known)
        json[municipality_name][:y_coordinate] = get_y_coordinate(municipality, variable.to_sym, max_y, min_y)
        json[municipality_name][:radius]       = get_radius(municipality)
        json[municipality_name][:color]        = get_color(municipality , x_coordinate, parties)
        json[municipality_name][:children_json_url] = nil
        json[municipality_name][:censo_total]  = municipality[:censo_total]
        json[municipality_name][:porcentaje_participacion] = ("%.2f" % (municipality[:votantes_totales].to_f / municipality[:censo_total].to_f * 100.0)).to_f
        json[municipality_name][:partido_1] = [parties[municipality[:primer_partido_id]],  municipality[:primer_partido_percent].to_f]
        json[municipality_name][:partido_2] = [parties[municipality[:segundo_partido_id]], municipality[:segundo_partido_percent].to_f]
        json[municipality_name][:partido_3] = [parties[municipality[:tercer_partido_id]],  municipality[:tercer_partido_percent].to_f]
        json[municipality_name][:resto_partidos_percent] = municipality[:resto_partido_percent]
        json[municipality_name][:info] = ""
        json[municipality_name][:parent] = [autonomy_name,province_name]
        json[municipality_name][:parent_url] = [autonomies_path(variable), provinces_path(autonomy_name, variable)]
        json[municipality_name][:parent_results] = province_results[province_name][proceso_electoral_id.to_s]
        json[municipality_name][:evolution] = evolution[custom_variable_name][municipality[:nombre]].join(',')
      end
      putc '.'
      fd = File.open('../' + municipalities_path(province_name,variable),'w+')
      fd.write(Yajl::Encoder.encode(json))
      fd.close        
    end
  end
end

variables_json.each do |k,v|
  variables_json[k] = v.compact.uniq.sort
end
fd = File.open('../graphs/meta/municipios.json','w+')
fd.write(Yajl::Encoder.encode(variables_json))
fd.close