#!/bin/bash

DATE=$(date -u +%Y-%m-%d)
FILENAME=$(dirname $0)/posts/"$DATE"-"$1".md

touch $FILENAME
