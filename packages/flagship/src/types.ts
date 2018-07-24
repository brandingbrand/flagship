export interface CodepushConfig {
  deploymentKey: string;
  appKey: string;
}

export interface Config {
  name: string;
  displayName: string;
  associatedDomains: string[];
  disableDevFeature?: boolean;
  googleMapApiKey: string;

  codepush?: {
    android: CodepushConfig;
    ios: CodepushConfig;
  };

  pushIcons?: {
    android?: string;
    ios?: string;
  };
  firebaseGoogleServices?: any;

  zendeskChat?: {
    accountKey: string;
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

  webPath?: string;
  webTitle?: string;
  webScriptInjectHeader?: string;
  webScriptInjectFooter?: string;
}

export interface NPMPackageConfig {
  name: string;
  version: string;
  dependencies?: {
    [key: string]: string;
  };
  [key: string]: any;
}
