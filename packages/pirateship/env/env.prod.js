const common = require('./common');

module.exports = {
  ...common,
  buildConfig: {
    ios: {
      appCertDir: '',
      deployScheme: '',
      exportTeamId: '',
      provisioningProfileName: ''
    }
  },
  entitlementsFileIOS: './uat.entitlements',
  name: 'PirateShip'
};
