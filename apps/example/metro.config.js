const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const { getCacheVersion } = require('@brandingbrand/code-app-env/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  cacheVersion: getCacheVersion(),
  watchFolders: [
    path.resolve(__dirname, './node_modules'),
    path.resolve(__dirname, '../../node_modules'),
    path.resolve(__dirname, '../../packages'),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
