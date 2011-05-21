#!/bin/bash

FILES=`ls urls/urls-*.txt`
for file in $FILES
do
	wget -i $file -P xmls/ &
done
