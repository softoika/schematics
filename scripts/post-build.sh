#!/bin/bash

if [[ -f src/collection.json ]]; then
  cp src/collection.json dist/
fi

find src -name files | egrep 'files$' | while read src; do
  dist=$(echo $src | sed 's/src/dist/' | sed 's|/files$||')
  cp -a $src $dist
done

find src -name schema.json | while read src; do
  dist=$(echo $src | sed 's/src/dist/' | sed 's|/schema.json||')
  cp $src $dist
done
