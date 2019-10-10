export interface CodepushConfig {
  deploymentKey: string;
  appKey: string;
}

export enum TargetedDevices {
  iPhone = 'iPhone',
  iPad = 'iPad',
  Universal = 'Universal'
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
    apiToken: string;
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
  usageDescriptionIOS?: {
    key: string;
    string: string;
  }[];

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
      xib: string;
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
  ios: IOSConfig;
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
  pods: PodsConfig;
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
