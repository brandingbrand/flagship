module.exports = {
  desktopHost: 'https://www.brandingbrand.com',
  name: 'PirateShip',
  displayName: 'PirateShip',
  enabledCapabilitiesIOS: [],
  pinnedCerts: [
    {
      baseUrl: 'https://demo-ocapi.demandware.net',
      path: 'assets/ssl/cert1.cer'
    },
    {
      baseUrl: 'https://demo-ocapi.demandware.net',
      path: 'assets/ssl/cert2.cer'
    }
  ],
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
  bundleIds: {
    android: 'com.brandingbrand.reactnative.and.pirateship',
    ios: 'com.brandingbrand.reactnative.pirateship',
  },
  usageDescriptionIOS: [
    {
      key: 'NSAppleMusicUsageDescription',
      string: ''
    },
    {
      key: 'NSBluetoothPeripheralUsageDescription',
      string: ''
    },
    {
      key: 'NSCalendarsUsageDescription',
      string: ''
    },
    {
      key: 'NSCameraUsageDescription',
      string: ''
    },
    {
      key: 'NSLocationWhenInUseUsageDescription',
      string: ''
    },
    {
      key: 'NSMotionUsageDescription',
      string: ''
    },
    {
      key: 'NSPhotoLibraryAddUsageDescription',
      string: ''
    },
    {
      key: 'NSPhotoLibraryUsageDescription',
      string: ''
    },
    {
      key: 'NSSpeechRecognitionUsageDescription',
      string: ''
    },
    {
      key: 'NSFaceIDUsageDescription',
      string: ''
    }
  ],
  associatedDomains: [],
  targetedDevices: 'Universal'
};
