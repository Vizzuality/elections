RTVE Elections
===============

Live app: http://datos.rtve.es/elecciones/autonomicas-municipales/elections.html 

This repository contains basic scripts to generate all the datasources behind the RTVE data visualisation of the local and regional elections of Spain 2011.

These datasources all drive the visualisation that can be initialised by running elections.html




To generate all data run the following from the scripts directory:


./run_graphs.sh
ruby bubbles.rb 6 7 11
ruby googlenamescache_generator.rb
./run_maps.sh

then to deploy, run from the deploy directory:
./all.sh 



