#!/bin/bash

cd ${1}
for f in `find -path ./node_modules -prune -o -iname \*.js`; do
    echo $f
    tr -d '\15\32' < $f > $f.tr
    mv $f.tr $f
    recode CP1252...UTF-8 $f
done