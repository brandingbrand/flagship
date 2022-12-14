import { Plugin } from "@brandingbrand/kernel-core";

interface PluginGoogleSignin {
  ios: {
    reversedClientId: string;
  };
  android: {
    googlePlayServicesAuthVersion?: string;
    swiperefreshlayoutVersion?: string;
  };
}

export interface KernelPluginGoogleSignin {
  kernelPluginGoogleSignin: Plugin<PluginGoogleSignin>;
}
