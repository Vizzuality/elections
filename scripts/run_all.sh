#!/bin/bash

#echo "Autonomies...."
#ruby autonomies.rb
#echo "Provinces...."
#ruby provinces.rb
#echo "Municipalities...."
ruby municipalities.rb 4 0 &
ruby municipalities.rb 4 1 &
ruby municipalities.rb 4 2 &
ruby municipalities.rb 4 3 &
