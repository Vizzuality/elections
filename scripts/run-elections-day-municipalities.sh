#!/bin/bash

IDS=`ls -1 urls/ | awk '{ sub(/[a-z\.\-]+/,""); print }' | awk -v FS='.' '{print $1}'`
for id in $IDS
do
	echo $id
	ruby elections-day-municipalities.rb $id
done
cat inserts*.log > laviniadata.sql
rm inserts*.log
