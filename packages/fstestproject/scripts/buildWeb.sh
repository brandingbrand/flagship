#!/usr/bin/env bash

# Clear the web-demo directory if it exists
if [ -d "./web-compiled" ]; then
  rm -rf ./web-compiled
fi

cd web
yarn run build --output-public-path './' --output-path '../web-compiled' --env.enableDev=false --env.defaultEnvName=prod
