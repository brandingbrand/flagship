export interface CodepushConfig {
  deploymentKey: string;
  appKey: string;
}

export enum TargetedDevices {
  iPhone = 'iPhone',
  iPad = 'iPad',
  Universal = 'Universal'
}

export type IOSPermissionKeys =
  'APP_TRACKING_TRANSPARENCY'
  | 'BLUETOOTH_PERIPHERAL'
  | 'CALENDARS'
  | 'CAMERA'
  | 'CONTACTS'
  | 'FACE_ID'
  | 'LOCATION_ALWAYS'
  | 'LOCATION_WHEN_IN_USE'
  | 'MEDIA_LIBRARY'
  | 'MICROPHONE'
  | 'MOTION'
  | 'NOTIFICATIONS'
  | 'PHOTO_LIBRARY'
  | 'REMINDERS'
  | 'SIRI'
  | 'SPEECH_RECOGNITION'
  | 'STOREKIT';

export type AndroidPermissionKeys =
 'ACCEPT_HANDOVER'
 | 'ACCESS_BACKGROUND_LOCATION'
 | 'ACCESS_COARSE_LOCATION'
 | 'ACCESS_FINE_LOCATION'
 | 'ACTIVITY_RECOGNITION'
 | 'ADD_VOICEMAIL'
 | 'ANSWER_PHONE_CALLS'
 | 'BODY_SENSORS'
 | 'CALL_PHONE'
 | 'CAMERA'
 | 'GET_ACCOUNTS'
 | 'PROCESS_OUTGOING_CALLS'
 | 'READ_CALENDAR'
 | 'READ_CALL_LOG'
 | 'READ_CONTACTS'
 | 'READ_EXTERNAL_STORAGE'
 | 'READ_PHONE_NUMBERS'
 | 'READ_PHONE_STATE'
 | 'READ_SMS'
 | 'RECEIVE_MMS'
 | 'RECEIVE_SMS'
 | 'RECEIVE_WAP_PUSH'
 | 'RECORD_AUDIO'
 | 'SEND_SMS'
 | 'USE_SIP'
 | 'WRITE_CALENDAR'
 | 'WRITE_CALL_LOG'
 | 'WRITE_CONTACTS'
 | 'WRITE_EXTERNAL_STORAGE';

export interface UsageDescriptionIOS {
  key: string;
  string?: string;
  array?: string[];
}

export interface Config {
  name: string;
  displayName: string;
  associatedDomains: string[];
  disableDevFeature?: boolean;
  googleMapApiKey: string;

  // TODO - unify with appCenter config
  codepush?: {
    appCenterToken: string;
    android: CodepushConfig;
    ios: CodepushConfig;
  };

  appCenter?: {
    apiToken?: string; // deprecated; will be removed in a future release
    organization: string;
    distribute?: {
      appNameIOS?: string;
      appNameAndroid?: string;
    };
  };

  pushIcons?: {
    android?: string;
    ios?: string;
  };
  firebaseGoogleServices?: any;

  zendeskChat?: {
    accountKey: string;
  };

  firebase?: {
    ios?: {
      googleServicesPlistFile: string;
    };
    android?: {
      googleServicesJsonFile: string;
    };
  };

  exceptionDomains: (string | {
    domain: string;
    value: string;
  })[];

  buildConfig: {
    android: {
      exportMethod?: string;
      exportTeamId?: string;
      storeFile?: string;
      keyAlias?: string;
    };
    ios: {
      exportMethod?: string;
      exportTeamId?: string;
      provisioningProfileName: string;
      appleCert?: string;
      distCert?: string;
      distP12?: string;
      profilesDir?: string;
    };
  };

  enabledCapabilitiesIOS?: string[];
  entitlementsFileIOS?: string;
  usageDescriptionIOS?: UsageDescriptionIOS[];

  permissions?: {
    ios?: {[k in IOSPermissionKeys]: string};
    android?: AndroidPermissionKeys[];
  };

  UIBackgroundModes?: {
    string: string;
  }[];

  bundleIds: {
    android: string;
    ios: string;
  };

  appIconDir: {
    android: string;
    ios: string;
  };

  launchScreen: {
    android: string;
    ios: {
      images: string;
      xib?: string;
      storyboard?: string;
    };
  };

  urlScheme: string;

  sentry: {
    propertiesPath: string;
  };

  targetedDevices?: TargetedDevices;

  webPath?: string;
  webTitle?: string;
  webScriptInjectHeader?: string;
  webScriptInjectFooter?: string;
  android?: AndroidConfig;
  ios?: IOSConfig;
  adobeAnalytics?: {
    ios: {
      configPath: string;
    };
    android: {
      configPath: string;
    };
  };
}

export interface AndroidBuildConfig {
  additionalDependencies?: string[];
  versionName?: string | ((packageVersion: string) => string);
  versionShortCode?: string | ((packageVersion: string) => string);
  versionCode?: string | ((packageVersion: string) => string);
}

export interface AndroidManifestConfig {
  activityAttributes?: { [key: string]: string };
  additionalElements?: string[];
  additionalPermissions?: string[];
  applicationAttributes?: { [key: string]: string };
  urlSchemeHost?: string;
}

export interface AndroidConfig {
  build?: AndroidBuildConfig;
  manifest?: AndroidManifestConfig;
}

export interface IOSConfig {
  pods?: PodsConfig;
  buildVersion?: string;
  shortVersion?: string;
}

export interface PodsConfig {
  sources?: string[];
  newPods?: string[];
}

export interface NPMPackageConfig {
  name: string;
  version: string;
  dependencies?: {
    [key: string]: string;
  };
  [key: string]: any;
}
