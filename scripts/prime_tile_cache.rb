#!/Users/simon/.rvm/rubies/ruby-1.9.2-p180/bin/ruby

# prime akamai tile cache
# =======================
# ./prime_tile_cache.rb [environment] [election_id]
# 
# environments: [development, production] 
# election_id: [election id table primary keys]

require 'rubygems'
require 'pg'
require 'typhoeus'
require 'json'
require 'fileutils'

# sanity check arguments
ENVR         = ARGV[0]
election_id  = ARGV[1]

if ENVR != 'development' && ENVR != 'production'
  puts "ruby prime_tile_cache.rb [environment] [electoral process id]"
  puts "environments: [development, production]"
  Process.exit!(true)
end

if election_id == nil
  puts "must include electoral process ids to pre-cache"
end

# set app settings and boot
setup      = {:development => {:host => 'localhost'},
              :production  => {:host => 'datos.rtve.es', :base_url => 'http://datos.rtve.es/elecciones/autonomicas-municipales/data/tiles/current' }}           
settings   = setup[ENVR.to_sym]           

# spinner
cr = "\r"           
clear = "\e[0K"     
reset = cr + clear

# render each one entered
election_ids = election_id.split(",")
all_time_start  = Time.now
total_tile_count = 0

election_ids.each do |election_id|
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

  hydra       = Typhoeus::Hydra.new(:max_concurrency => 1000)
  time_start  = Time.now
  start_tiles = 0
  total_tiles = tile_extents.inject(0) do |sum, extent|
    sum += ((extent[:xmax] - extent[:xmin] + 1) * (extent[:ymax] - extent[:ymin] + 1))
    sum
  end  
  

  puts "Precaching Akamai tiles"
  tile_extents.each do |extent|
    (extent[:xmin]..extent[:xmax]).to_a.each do |x|
      (extent[:ymin]..extent[:ymax]).to_a.each do |y|
        file_name = "#{x}_#{y}_#{extent[:zoom]}.png"
        file_url  = "#{settings[:base_url]}/#{election_id}/#{file_name}"
        tile_request = Typhoeus::Request.new(file_url)
        tile_request.on_complete do |response|
          start_tiles += 1
          total_tile_count += 1          
          #puts file_url
          print "#{reset}#{start_tiles}/#{total_tiles}: #{file_url}"
          $stdout.flush
        end
        hydra.queue tile_request  
      end
    end    
  end

  hydra.run
  time_end = Time.now
  secs = time_end - time_start
  puts "\nTotal time: #{sprintf("%.2f", secs)} seconds (#{sprintf("%.2f", secs/60.0)} mins). #{sprintf("%.2f", total_tiles/secs)} tiles per second."
end

all_time_end = Time.now  
secs = all_time_end - all_time_start
puts "Overall time: #{sprintf("%.2f", secs)} seconds (#{sprintf("%.2f", secs/60.0)} mins). #{sprintf("%.2f", total_tile_count/secs)} tiles per second."
