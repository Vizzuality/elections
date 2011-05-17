#!/bin/bash

#echo "Autonomies...."
#ruby autonomies.rb
#echo "Provinces...."
#ruby provinces.rb
#echo "Municipalities...."
ruby municipalities.rb 2 0 &
ruby municipalities.rb 2 1 &
