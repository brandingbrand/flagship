"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDependencyConfig;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

var _getPackageConfiguration = _interopRequireDefault(require("../../tools/getPackageConfiguration"));

var _getParams = _interopRequireDefault(require("../../tools/getParams"));

var _getHooks = _interopRequireDefault(require("../../tools/getHooks"));

var _getAssets = _interopRequireDefault(require("../../tools/getAssets"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDependencyConfig(ctx, availablePlatforms, dependency) {
  try {
    const fs = require('fs');

    let folder = _path().default.join(ctx.root, 'node_modules', dependency);

    if (!fs.existsSync(folder)) {
      folder = folder.replace('packages' + _path().default.sep + 'fstestproject' + _path().default.sep, '');
    }

    const config = (0, _getPackageConfiguration.default)(folder);
    const platformConfigs = {
      ios: undefined,
      android: undefined
    };
    Object.keys(availablePlatforms).forEach(platform => {
      platformConfigs[platform] = availablePlatforms[platform].dependencyConfig(folder, config[platform] || {});
    });
    return {
      config: platformConfigs,
      name: dependency,
      path: folder,
      commands: (0, _getHooks.default)(folder),
      assets: (0, _getAssets.default)(folder),
      params: (0, _getParams.default)(folder)
    };
  } catch (e) {
    throw new Error('Failed to get dependency config' + e.toString());
  }
}
