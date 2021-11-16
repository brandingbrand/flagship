#!/bin/bash

# This script is intended to assist in publishing alpha versions of Flagship with Lerna. If no
# version is specified, it will parse the lerna.json file to determine the next version. For
# example, if the current version is 11.1.0-alpha.14, the next published version would be
# 11.1.0-alpha.15.
#
# By default, the script will invoke Lerna CLI in interactive mode so the user can manually confirm
# the next version. To include this script in automation, provide the --yes argument which tells
# Lerna to not prompt the user.
#
# Usage:
#
# Automatically determine the next version:
# ./scripts/publishAlpha.sh [optional lerna flags]
#
# Manually specify the next version:
# ./scripts/publishAlpha.sh [version] [optional lerna flags]

set -e

if [[ "$1" =~ ^[0-9] ]]; then
  NEXT_VERSION="$1"
else
  NEXT_VERSION=$(node ./scripts/getNextAlphaVersion.js)
fi

if [[ "$1" =~ ^[0-9] ]]; then
  # If user manually provided the version as the first argument, unset $1 so that we can pass the
  # remaining arguments to the lerna publish command
  shift 1
fi

echo "lerna publish $NEXT_VERSION --dist-tag=canary --allow-branch=develop --exact $@"

lerna publish $NEXT_VERSION --dist-tag=canary --allow-branch=develop --exact "$@"
