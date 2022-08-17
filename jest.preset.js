const nxPreset = require('@nrwl/jest/preset').default;

module.exports = {
  ...nxPreset,
  haste: {
    defaultPlatform: 'native',
    platforms: ['web', 'native', 'ios', 'android'],
  },
};
