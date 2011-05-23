#!/Users/simon/.rvm/rubies/ruby-1.9.2-p180/bin/ruby

require 'rubygems'
require 'pg'
require 'typhoeus'
require 'json'
require 'fileutils'

# sanity check arguments
ENVR         = ARGV[0]
election_id  = ARGV[1]

if ENVR != 'development' && ENVR != 'production'
  puts "ruby map_tiles.rb [environment] [electoral process id (optional)]"
  puts "environments: [development, production]"
  Process.exit!(true)
end

# set app settings and boot
user       = 123
cell_size  = 0.075 #dd
setup      = {:development => {:host => 'localhost', :user => 'publicuser', :dbname => "cartodb_user_#{user}_db"},
              :production  => {:host => '10.211.14.63', :user => 'postgres', :dbname => "cartodb_user_#{user}_db"}}           
settings   = setup[ENVR.to_sym]           
conn = PGconn.open(settings)  
pos = conn.exec "DROP TABLE IF EXISTS processing_cartogram; CREATE TABLE processing_cartogram AS (SELECT *, ST_centroid(the_geom) FROM map_tiles_data)";

res = conn.exec("DROP TABLE IF EXISTS centre_test; CREATE TABLE centre_test AS (SELECT *, ST_SnapToGrid(st_centroid, #{cell_size}) FROM processing_cartogram)")


res = conn.exec("SELECT ST_YMax(the_geom) as ymax,  ST_Ymin(the_geom) as ymin, ST_XMax(the_geom) as xmax,  ST_Xmin(the_geom) as xmin FROM (SELECT ST_Union((the_geom,0.01)) as the_geom from gadm1) as gemz" )
res = conn.exec_prepared("hohoho") 



c = res.first
c['ymax'].to_f - c['ymin'].to_f
rows = (c['ymax'].to_f - c['ymin'].to_f)/ cell_size

(1..rows.ceil).each do |row|
  #bbox
  xmin = c['xmin']
  xmax = c['xmax']  
  ymin = cell_size * row
  ymax = (cell_size * row) + row
  
end