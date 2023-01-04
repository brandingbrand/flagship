import type { Plugin } from "@brandingbrand/kernel-core";

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

export interface KernelPluginFirebaseApp {
  kernelPluginFirebaseApp?: Plugin<PluginFirebaseApp>;
}
