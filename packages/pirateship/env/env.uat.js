const common = require('./common');

module.exports = {
  ...common,
  apiHost: 'https://api.example.com',
  name: 'PirateShipUAT',
  displayName: 'PirateShip UAT',
  buildConfig: {
    ios: {
      exportTeamId: '',
      deployScheme: '',
      appCertDir: '',
      provisioningProfileName: ''
    }
  },
  entitlementsFileIOS: './uat.entitlements'
};
