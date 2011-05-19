#!/bin/bash

cd scripts
./run_graphs.sh
ruby bubbles.rb 6 7 11
ruby googlenamescache_generator.rb
./run_maps.sh

cd ../deploy
./all.sh 