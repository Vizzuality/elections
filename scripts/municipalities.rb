# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb        = get_cartodb_connection
processes      = get_processes
autonomies     = get_autonomies
provinces      = get_provinces
variables      = get_variables(4)
parties        = get_parties
parties_known  = get_known_parties(parties)
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
dir_path = "#{base_path}/../json/generated_data/municipios"
FileUtils.mkdir_p(dir_path)

### MUNICIPALITIES
##################

# Get OAuth token from cartodb client, because we are goint to
# fetch API via net/http library (because of the threads we use)
puts 
evolution = {}
autonomies.each do |autonomy_hash|
  autonomy_name = autonomy_hash[:name_1].tr(' ','_')
  selected_provinces = provinces.select{ |p| p[:id_1] == autonomy_hash[:id_1] }
  if selected_provinces.empty?
    puts "Empty provinces for #{autonomy_hash.inspect}"
    next
  end
  selected_provinces.each do |province|
    province_name = province[:name_2].tr(' ','_')
#     query = <<-SQL
# select #{MUNICIPALITIES_TABLE}.cartodb_id, name_4, votantes_totales, censo_total, #{MUNICIPALITIES_VOTATIONS}.gadm4_cartodb_id, 
#    proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent,
#    ine_municipality_id, ine_province_id, tercer_partido_id, tercer_partido_percent, censo_total, votantes_totales, resto_partido_percent,
#    #{variables.join(',')}
# from   #{MUNICIPALITIES_TABLE}, #{MUNICIPALITIES_VOTATIONS}, vars_socioeco_x_municipio
# where #{MUNICIPALITIES_VOTATIONS}.gadm4_cartodb_id = #{MUNICIPALITIES_TABLE}.cartodb_id AND 
#   vars_socioeco_x_municipio.gadm4_cartodb_id = #{MUNICIPALITIES_VOTATIONS}.gadm4_cartodb_id AND
#   #{MUNICIPALITIES_TABLE}.id_2 = #{province[:id_2]}
# SQL
    query = <<-SQL
select nombre, votantes_totales, censo_total,
   proceso_electoral_id, primer_partido_id, primer_partido_percent, segundo_partido_id, segundo_partido_percent,
   tercer_partido_id, tercer_partido_percent, censo_total, votantes_totales, resto_partido_percent,
   #{variables.join(',')}
from  vars_socioeco_x_municipio, votaciones_por_municipio, ine_poly, gadm2
where ine_poly.ine_prov_int = votaciones_por_municipio.codineprov::integer and ine_poly.ine_muni_int = votaciones_por_municipio.codinemuni::integer and
      vars_socioeco_x_municipio.gadm4_cartodb_id = ine_poly.gid and gadm2.cc_2::integer = ine_poly.ine_prov_int and gadm2.id_2 = #{province[:id_2]}
SQL
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    request = Net::HTTP::Get.new("/v1?sql=#{CGI.escape(query)}&#{oauth_token}")
    response = http.request(request)
    variables.each do |variable|
      custom_variable_name = variable.gsub(/_\d+/,'')
      evolution[custom_variable_name] ||= {} 
      unless proceso_electoral_id = processes[variable.match(/\d+/)[0].to_i]  
        year = variable.match(/\d+/)[0].to_i - 1
        while proceso_electoral_id.nil? && year > 1975
          proceso_electoral_id = processes[year]
          year -= 1
        end
      end
      next if year == 1974
      province_results = get_province_results(province_name, proceso_electoral_id)
      json = {}
      votes_per_municipality = JSON.parse(response.body)["rows"].select{ |h| h["proceso_electoral_id"] == proceso_electoral_id }
      max_y = votes_per_municipality.map{ |h| h[variable].to_f }.compact.max
      min_y = votes_per_municipality.map{ |h| h[variable].to_f }.compact.min
      max_x = votes_per_municipality.map{|h| h["primer_partido_percent"].to_f - h["segundo_partido_percent"].to_f }.compact.max
      votes_per_municipality.sort{ |b,a| a["censo_total"].to_i <=> b["censo_total"].to_i}.each do |municipality|
        municipality.symbolize_keys!
        putc '.'
        municipality_name = municipality[:nombre].tr(' ','_')
        evolution[custom_variable_name][municipality[:nombre]] ||= get_municipalities_variable_evolution(custom_variable_name, municipality[:nombre]).compact
        json[municipality_name] ||= {}
        json[municipality_name][:cartodb_id]   = municipality[:cartodb_id]
        json[municipality_name][:x_coordinate] = x_coordinate = get_x_coordinate(municipality, max_x, parties_known)
        json[municipality_name][:y_coordinate] = get_y_coordinate(municipality, variable.to_sym, max_y)
        json[municipality_name][:radius]       = get_radius(municipality)
        json[municipality_name][:color]        = get_color(municipality , x_coordinate, parties)
        json[municipality_name][:children_json_url] = nil
        json[municipality_name][:censo_total]  = municipality[:censo_total]
        json[municipality_name][:porcentaje_participacion] = ("%.2f" % municipality[:votantes_totales].to_f / municipality[:censo_total].to_f * 100.0).to_f
        json[municipality_name][:partido_1] = [parties[municipality[:primer_partido_id]],  municipality[:primer_partido_percent].to_f]
        json[municipality_name][:partido_2] = [parties[municipality[:segundo_partido_id]], municipality[:segundo_partido_percent].to_f]
        json[municipality_name][:partido_3] = [parties[municipality[:tercer_partido_id]],  municipality[:tercer_partido_percent].to_f]
        json[municipality_name][:resto_partidos_percent] = municipality[:resto_partido_percent]
        json[municipality_name][:info] = ""
        json[municipality_name][:info] = ""
        json[municipality_name][:parent] = [autonomy_name,province_name]
        json[municipality_name][:parent_url] = [autonomies_path(variable), provinces_path(autonomy_name, variable)]
        json[municipality_name][:parent_results] = province_results
        json[municipality_name][:evolution] = evolution[custom_variable_name][municipality[:nombre]].join(',')
      end
      fd = File.open('../' + municipalities_path(province_name,variable),'w+')
      fd.write(json.to_json)
      fd.close        
    end
  end
end