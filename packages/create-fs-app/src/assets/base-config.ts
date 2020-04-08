const certRoot = '../certificates';

/**
 * Basic config settings that don't or may not be updated during the initialization process
 */
export const baseConfig = {
  disableDevFeature: false,
  buildConfig: {
    ios: {
      appleCert: `${certRoot}/apple.cer`,
      distCert: `${certRoot}/dist.cer`,
      distP12: `${certRoot}/dist.p12`,
      profilesDir: `../profiles`
    },
    android: {
      storeFile: `${certRoot}/app.keystore`,
      keyAlias: ''
    }
  },
  entitlementsFileIOS: './uat.entitlements',
  appIconDir: {
    android: 'assets/appIcon/android',
    ios: 'assets/appIcon/ios'
  },
  googleAnalytics: {
    android: '',
    ios: ''
  },
  engagement: {
    baseURL: 'https://kong.uat.bbhosted.com/engagement/v1',
    cacheTTL: 0,
    appId: '302891af-778a-46aa-abdc-7297e72a1809',
    apiKey: 'f3e1a902963f3364980b31e7ad0ea4'
  },
  usageDescriptionIOS: {
    NSAppleMusicUsageDescription: '',
    NSBluetoothPeripheralUsageDescription: '',
    NSCalendarsUsageDescription: '',
    NSCameraUsageDescription: '',
    NSLocationWhenInUseUsageDescription: '',
    NSMotionUsageDescription: '',
    NSPhotoLibraryAddUsageDescription: '',
    NSPhotoLibraryUsageDescription: '',
    NSSpeechRecognitionUsageDescription: '',
    NSFaceIDUsageDescription: ''
  }
};

export type BaseConfig = typeof baseConfig;
