import type { Plugin } from "@brandingbrand/code-cli-kit";

export type CodePluginFirebaseApp = {
  codePluginFirebaseApp: Plugin<{
    ios?: {
      googleServicesPath: string;
    };
    android?: {
      googleServicesPath: string;
      googleServicesVersion: string;
      firebaseBomVersion: string;
    };
  }>;
};
