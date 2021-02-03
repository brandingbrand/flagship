module.exports = {
  desktopHost: 'https://www.brandingbrand.com',
  name: 'PirateShip',
  displayName: 'PirateShip',
  enabledCapabilitiesIOS: [],
  buildConfig: {
    ios: {
      appleCert: '../certs/apple.cer',
      distCert: '../certs/dist.cer',
      distP12: '../certs/dist.p12',
      profilesDir: '../profiles/'
    },
    android: {
      storeFile: 'hockeyapp.keystore',
      keyAlias: 'hockeyapp'
    }
  },
  entitlementsFileIOS: './uat.entitlements',
  googleAnalytics: {
    android: '',
    ios: ''
  },
  cmsEnvironment: 1,
  cmsPropertyId: 443,
  dataSourceConfigs: {
    bazaarVoice: {
      endpoint: 'https://api.bazaarvoice.com',
      passkey: ''
    }
  },
  apiHost: 'https://api.example.com',
  publicVersionNumber: '1.0.0',
  require: [],
  appIds: {
    android: 'com.brandingbrand.reactnative.and.pirateship',
    ios: 'com.brandingbrand.reactnative.pirateship',
  },
  engagement: {
    baseURL: 'https://api.brandingbrand.com/engagement-general/v1',
    cacheTTL: 0,
    appId: '31c51c2f-e65c-4b14-8edc-026dc6098e56',
    apiKey: 'uWFd0FJ6TcrqFBCFMbd2TUs686K3Ii'
  },
  bundleIds: {
    android: 'com.brandingbrand.reactnative.and.pirateship',
    ios: 'com.brandingbrand.reactnative.pirateship',
  },
  associatedDomains: [],
  targetedDevices: 'Universal'
};
