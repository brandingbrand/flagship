import type { Plugin } from "@brandingbrand/code-core";

interface PluginFirebaseApp {
  ios?: {
    googleServicesPath: string;
  };
  android?: {
    googleServicesPath: string;
    googleServicesVersion: string;
    firebaseBomVersion: string;
  };
}

export interface CodePluginFirebaseApp {
  codePluginFirebaseApp?: Plugin<PluginFirebaseApp>;
}
