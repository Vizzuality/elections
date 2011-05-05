#!/bin/bash

rm -rf ../json/generated_data/*
echo "Autonomies...."
ruby autonomies.rb
echo "Provinces...."
ruby provinces.rb
echo "Municipalities...."
ruby municipalities.rb 4 0 &
ruby municipalities.rb 4 1 &
ruby municipalities.rb 4 2 &
ruby municipalities.rb 4 3 &