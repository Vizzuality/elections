#!/bin/bash

FILES=`ls urls/urls-*.log`
for file in $FILES
do
	wget -i $file -P xmls/ &
done
