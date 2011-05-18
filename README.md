RTVE Elections
===============

Live app: http://datos.rtve.es/elecciones/autonomicas-municipales/elections.html 

This repository contains basic scripts to generate all the datasources behind the RTVE data visualisation of the local and regional elections of Spain 2011.

These datasources all drive the visualisation that can be initialised by running elections.html

Please note that these scripts are unlikely to run without modification for your environment, please ensure all code is read and updated before attempting to use. Please see LICENCE file for full terms of use.


Quick Install
-------------

Initiates generation and sync to Akamai is

./run_all.sh

for timed run: `time run_all.sh`


Data generation detail
-----------------------

To generate all data run the following from the scripts directory:

./run_graphs.sh
ruby bubbles.rb 6 7 11
ruby googlenamescache_generator.rb
./run_maps.sh


Deploy detail
--------------

Run from the deploy directory:
./all.sh 


or you can sync specific parts of the data with:

./vector_data.sh
./app.sh
./tile_data.sh

