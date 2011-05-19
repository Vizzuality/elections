#!/bin/bash

cd scripts
./run_graphs.sh
ruby bubbles.rb 6 7 11
ruby googlenamescache_generator.rb

rvm use 1.9.2
./run_maps.sh

cd ../deploy
./all.sh 