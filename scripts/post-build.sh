#!/bin/bash

if [[ -f src/collection.json ]]; then
  ln -fs ../src/collection.json dist/collection.json
fi

find src -name files | egrep 'files$' | while read src; do
  dist=$(echo $src | sed 's/src/dist/' | sed 's|/files$||')
  ln -fs "../../$src" $dist
done

find src -name schema.json | while read src; do
  dist=$(echo $src | sed 's/src/dist/' | sed 's|/schema.json||')
  ln -fs "../../$src" $dist
done
