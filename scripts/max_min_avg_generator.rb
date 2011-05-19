# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb = get_cartodb_connection

[6, 7, 11].each do |z|
  File.open("#{ENV['HOME']}/Desktop/max_min_avg_#{z}.json", 'w') do |file|
    vars = {}
    cartodb.query(max_min_vars_query(z)).rows.first.each do |key, value|
      vars[key] = value.to_f.round(2)
    end
    file.write(vars.to_json)
  end
  puts z
end
exit(0)
