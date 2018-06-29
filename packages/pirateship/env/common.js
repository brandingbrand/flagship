module.exports = {
  desktopHost: 'https://www.brandingbrand.com',
  displayName: 'PirateShip',
  enabledCapabilitiesIOS: [],
  googleAnalytics: {
    android: '',
    ios: ''
  },
  cmsEnvironment: 1,
  cmsPropertyId: 443,
  dataSourceConfigs: {
    bbPlatform: {
      type: 'bbplatform',
      categoryFormat: 'grid',
      apiConfig: {
        apiHost: 'https://api.example.com'
      }
    },
    commerceCloud: {
      type: 'commercecloud',
      categoryFormat: 'list',
      apiConfig: {
        clientId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        endpoint: 'https://demo-ocapi.demandware.net/s/SiteGenesis/dw/shop/v18_6',
        storeCurrencyCode: 'USD',
        networkClient: {
          baseURL: 'https://demo-ocapi.demandware.net/s/SiteGenesis/dw/shop/v18_6',
          headers: {
            origin: 'https://demo-ocapi.demandware.net/s/SiteGenesis/dw/shop/v18_6',
            'x-dw-client-id': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
          }
        }
      }
    },
    bazaarVoice: {
      endpoint: 'https://api.bazaarvoice.com',
      passkey: ''
    }
  },
  apiHost: 'https://api.example.com',
  name: 'PirateShip',
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
  associatedDomains: []
};
