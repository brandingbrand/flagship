#!/usr/bin/env node

/*
  This script parses the lerna.json file to determine the next alpha version. For example, if the
  current published version is 11.1.0-alpha.12, it will output 11.1.0-alpha.13.
*/

const fs = require('fs');
const path = require('path');

const lernaConfigPath = path.resolve(__dirname, '..', 'lerna.json');
const lernaConfig = fs.readFileSync(lernaConfigPath, { encoding: 'utf-8' });

const currentVersionMatches = lernaConfig.match(/(\d+\.\d+\.\d+\-alpha\.)(\d+)/);

if (!currentVersionMatches) {
  throw new Error('Current version does not match expected alpha pattern A.B.C-alpha.D');
}

const currentMainVersion = currentVersionMatches[1];
const currentAlphaVersion = currentVersionMatches[2];

const nextAlphaNumber = parseInt(currentAlphaVersion, 10) + 1;
const nextAlphaVersion = currentMainVersion + nextAlphaNumber;

console.log(nextAlphaVersion);
