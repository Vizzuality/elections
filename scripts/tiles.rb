# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb        = get_cartodb_connection

base_path = FileUtils.pwd
FileUtils.mkdir_p("#{base_path}/../json/generated_data/tiles")

zoom_levels = [6,7,11]

start_x = {
  6 =>  [30,28],
  7 =>  [60,57],
  11 => [964,916]
}

end_x = {
  6 =>  [32,29],
  7 =>  [65,59],
  11 => [1052,951]
}

start_y = {
  6 =>  [23,26],
  7 =>  [46,52],
  11 => [741,844]
}

end_y = {
  6 =>  [25,27],
  7 =>  [50,54],
  11 => [815,866]
}

[0,1].each do |i|
  zoom_levels.each do |z|
    y = start_y[z][i]
    while y <= end_y[z][i] do
      x = start_x[z][i]
      while x <= end_x[z][i] do
        json = {}
  
        query = <<-SQL
...
SQL
        cartodb.query(query)[:rows].each do |row|
        end
            
        fd = File.open("../json/generated_data/tiles/#{z}_#{x}_#{y}.json",'w+')
        fd.write(json.to_json)
        fd.close        
        x += 1
      end
      y += 1
    end
  end
end
