#!/usr/bin/env bash

# Clear the web-demo directory if it exists
if [ -d "./docs/web-demo" ]; then
  rm -rf ./docs/web-demo
fi

yarn run init web
cd web
yarn run build --output-public-path '/flagship/web-demo/' --output-path '../../../docs/web-demo' --env.enableDev=true --env.defaultEnvName=mock
