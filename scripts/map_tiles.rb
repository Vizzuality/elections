#!/Users/simon/.rvm/rubies/ruby-1.9.2-p180/bin/ruby

# RTVE tiler
# ===============
# ./rtve.rb [environment] [election_id]
# 
# environments: [development, production] 
# election_id: [election id table primary keys]

require 'rubygems'
require 'pg'
require 'typhoeus'
require 'json'

# sanity check arguments
ENVR         = ARGV[0]
ELECTION_ID = ARGV[1]
if (ENVR != 'development' && ENVR != 'production') || (ELECTION_ID == nil)
  puts "./rtve.rb [environment] [election_id]"
  puts "environments: [development, production], election_id: [see procesos_electorales table]"
  Process.exit!(true)
end

# set app settings and boot
user       = 123
setup      = {:development => {:host => 'localhost', :user => 'publicuser', :dbname => "cartodb_dev_user_#{user}_db"},
              :production  => {:host => '10.211.14.63', :user => 'postgres', :dbname => "cartodb_user_#{user}_db"}}           
settings   = setup[ENVR.to_sym]           

# Create denomalised version of GADM4 table with votes, and party names
sql = <<-EOS  
DROP TABLE IF EXISTS map_tiles_data; 

CREATE TABLE map_tiles_data AS (  
SELECT 
g.cartodb_id as gid, 
v.primer_partido_id,pp1.name primer_nombre,v.primer_partido_percent,v.primer_partido_votos,
v.segundo_partido_id,pp2.name segundo_nombre,v.segundo_partido_percent,v.segundo_partido_votos,
v.tercer_partido_id,pp3.name tercer_nombre,v.tercer_partido_percent,v.tercer_partido_votos,
g.the_geom,
g.the_geom_webmercator,
CASE 
WHEN pp1.name ='PSOE' THEN 
  CASE 
  WHEN v.primer_partido_percent >= 75  THEN 'red_H'
  WHEN (v.primer_partido_percent >= 50) AND (v.primer_partido_percent < 75) THEN 'red_M' 
  WHEN (v.primer_partido_percent >= 0) AND (v.primer_partido_percent < 50)  THEN 'red_L' 
  END 
WHEN pp1.name = 'PP' THEN 
  CASE 
  WHEN v.primer_partido_percent >= 75  THEN 'blue_H'
  WHEN (v.primer_partido_percent >= 50) AND (v.primer_partido_percent < 75)  THEN 'blue_M' 
  WHEN (v.primer_partido_percent >= 0) AND (v.primer_partido_percent < 50)  THEN 'blue_L'
  END 
WHEN pp1.name IN ('CIU', 'AP', 'IU', 'INDEP', 'CDS', 'PAR', 'EAJ-PNV', 'PA', 'BNG', 'PDP', 'ERC-AM', 'ESQUERRA-AM', 'ERC', 'EA', 'HB', 'PRC', 'PR', 'UV') THEN
  pp1.name
ELSE 'unknown' 
END as color  
FROM ine_poly AS g 
LEFT OUTER JOIN (SELECT * FROM votaciones_por_municipio WHERE proceso_electoral_id=#{ELECTION_ID}) AS v ON g.ine_muni_int=v.codinemuni 
INNER JOIN partidos_politicos AS pp1 ON pp1.cartodb_id = v.primer_partido_id  
INNER JOIN partidos_politicos AS pp2 ON pp2.cartodb_id = v.segundo_partido_id   
INNER JOIN partidos_politicos AS pp3 ON pp3.cartodb_id = v.tercer_partido_id);


CREATE INDEX map_tiles_data_the_geom_webmercator_idx ON map_tiles_data USING gist(the_geom_webmercator); 
CREATE INDEX map_tiles_data_the_geom_idx ON map_tiles_data USING gist(the_geom);
EOS
#ALTER TABLE map_tiles_data ADD PRIMARY KEY (gid); 
conn = PGconn.open(settings)  
conn.exec sql

# there are 2 bounding boxes at each zoom level. one for spain, one for canaries 
tile_extents = [
  {:zoom => 6, :xmin => 30, :ymin => 23, :xmax => 32, :ymax => 25},
  {:zoom => 6, :xmin => 28, :ymin => 26, :xmax => 29, :ymax => 27},
  {:zoom => 7, :xmin => 60, :ymin => 46, :xmax => 65, :ymax => 50},
  {:zoom => 7, :xmin => 57, :ymin => 52, :xmax => 59, :ymax => 54},
  {:zoom => 8, :xmin => 120, :ymin => 92, :xmax => 131, :ymax => 101},
  {:zoom => 8, :xmin => 114, :ymin => 105, :xmax => 118, :ymax => 108},
  {:zoom => 9, :xmin => 241, :ymin => 185, :xmax => 263, :ymax => 203},
  {:zoom => 9, :xmin => 229, :ymin => 211, :xmax => 237, :ymax => 216},
  {:zoom => 10, :xmin => 482, :ymin => 370, :xmax => 526, :ymax => 407},
  {:zoom => 10, :xmin => 458, :ymin => 422, :xmax => 475, :ymax => 433},
  {:zoom => 11, :xmin => 964, :ymin => 741, :xmax => 1052, :ymax => 815},
  {:zoom => 11, :xmin => 916, :ymin => 844, :xmax => 951, :ymax => 866},
  {:zoom => 12, :xmin => 1929, :ymin => 1483, :xmax => 2105, :ymax => 1631},
  {:zoom => 12, :xmin => 1832, :ymin => 1688, :xmax => 1902, :ymax => 1732},  
] 

tile_url    = "http://ec2-50-16-103-51.compute-1.amazonaws.com/tiles"
hydra       = Typhoeus::Hydra.new(:max_concurrency => 200)
time_start  = Time.now
start_tiles = 0
total_tiles = tile_extents.inject(0) do |sum, extent|
  sum += ((extent[:xmax] - extent[:xmin] + 1) * (extent[:ymax] - extent[:ymin] + 1))
  sum
end  

tile_extents.each do |extent|
  (extent[:xmin]..extent[:xmax]).to_a.each do |x|
    (extent[:ymin]..extent[:ymax]).to_a.each do |y|
      file_name = "#{x}_#{y}_#{extent[:zoom]}_#{ELECTION_ID}.png"
      if File.exists? "images/#{file_name}"
        total_tiles -= 1
      else  
        file_url  = "#{tile_url}/#{x}/#{y}/#{extent[:zoom]}/users/#{user}/layers/gadm1%7Cgadm4_processed%7Cgadm4%7Cgadm3%7Cgadm2%7Cgadm1"
        tile_request = Typhoeus::Request.new(file_url)
        tile_request.on_complete do |response|
          start_tiles += 1
          puts "#{start_tiles}/#{total_tiles}: downloaded #{file_name}"
          File.open("images/#{file_name}", "w+") do|f|
            f.write response.body
          end
        end
        hydra.queue tile_request  
      end  
    end
  end    
end

hydra.run
time_end = Time.now
secs = time_end - time_start
puts "Total time: #{sprintf("%.2f", secs)} seconds (#{sprintf("%.2f", secs/60.0)} mins). #{sprintf("%.2f", total_tiles/secs)} tiles per second."