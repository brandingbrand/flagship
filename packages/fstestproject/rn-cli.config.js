const path = require('path');
const fs = require('fs');
const blacklist = require('metro-config/src/defaults/blacklist');

/**
 * Blacklist any duplicate packages within the individual
 * repos, except for react-native, which can't be hoisted.
 */
function generateBlacklist() {
  const packageModules = path.resolve(__dirname, 'node_modules');
  const rootModules = path.resolve(__dirname, '../../node_modules');
  const duplicateModules = [];

  fs.readdirSync(packageModules).forEach(moduleDir => {
    if (moduleDir === 'react-native') {
      // match all packages except fstestproject
      duplicateModules.push(new RegExp('packages/(?:(?!fstestproject).*)/node_modules/' + moduleDir + '/.*'));
      duplicateModules.push(new RegExp(rootModules + '/' + moduleDir + '/.*'));
    } else if (moduleDir !== '.bin' && fs.existsSync(path.resolve(rootModules, moduleDir))) {
      duplicateModules.push(new RegExp('packages/.*/node_modules/' + moduleDir + '/.*'));
    }
  });

  return blacklist(duplicateModules);
}

const config = {
  // Adds the monorepo root to the watchlist so the hoisted node_modules can be loaded
  watchFolders: [
    path.resolve(__dirname, '../..')
  ],
  resolver: {
    blacklistRE: generateBlacklist(),
    // Allows the project's react-native module to be used in
    // place of the hoisted version for dependencies
    extraNodeModules: {
      'react-native': path.resolve(__dirname, 'node_modules/react-native')
    }
  }
};

module.exports = config;
