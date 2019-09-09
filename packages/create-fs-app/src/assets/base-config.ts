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
