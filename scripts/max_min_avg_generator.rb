# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb = get_cartodb_connection

File.open("#{ENV['HOME']}/Desktop/variables.json", 'w') do |file|
  file.write(variables_vars.first.to_json)
end

File.open("#{FileUtils.pwd}/../javascripts/max_min_avg.js", 'w') do |file|
  vars = {}
  cartodb.query(max_min_vars_query).rows.first.each do |key, value|
    vars[key] = value.to_f.round(2)
  end
  file.write("var max_min_avg = #{vars.to_json};")
end
