const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  haste: {
    defaultPlatform: 'native',
    platforms: ['web', 'native', 'ios', 'android'],
  },
};
