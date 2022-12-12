export interface PluginFirebaseAppConfig {
  firebaseApp: {
    ios?: {
      googleServicesPath: string;
    };
    android?: {
      googleServicesPath: string;
      googleServicesVersion: string;
      firebaseBomVersion: string;
    };
  };
}
