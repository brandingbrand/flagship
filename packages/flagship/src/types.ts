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

  codepush?: {
    appCenterToken: string;
    android: CodepushConfig;
    ios: CodepushConfig;
  };

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

  exceptionDomains: {
    domain: string;
    value: string;
  }[];

  buildConfig: {
    android: {
      exportMethod?: string;
      exportTeamId?: string;
    };
    ios: {
      exportMethod?: string;
      exportTeamId?: string;
      provisioningProfileName: string;
    };
  };

  enabledCapabilitiesIOS?: string[];
  entitlementsFileIOS?: string;
  usageDescriptionIOS?: {
    key: string;
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
  ios: IOSConfig;
}

export interface IOSConfig {
  pods: PodsConfig;
}

export interface PodsConfig {
  sources: string[];
}

export interface NPMPackageConfig {
  name: string;
  version: string;
  dependencies?: {
    [key: string]: string;
  };
  [key: string]: any;
}
