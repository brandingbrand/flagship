export interface FlagshipPluginJson {
  ios: {
    appExtensions: Record<string, AppExtension>;
  };
}

export interface AppExtension {
  infoPlist: string;
  schema: string;
  files: string;
  frameworks: string[];
}
