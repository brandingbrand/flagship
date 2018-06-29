const common = require('./common');

module.exports = {
  ...common,
  apiHost: 'https://api.example.com',
  buildConfig: {
    android: {
      storeFile: '',
      storePassword: '',
      keyAlias: '',
      keyPassword: ''
    },
    ios: {
      appCertDir: '',
      deployScheme: '',
      exportMethod: '',
      exportTeamId: '',
      provisioningProfileName: ''
    }
  },
  disableDevFeature: true,
  entitlementsFileIOS: './store.entitlements',
  name: 'PirateShip'
};
