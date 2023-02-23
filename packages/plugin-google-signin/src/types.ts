import { Plugin } from "@brandingbrand/code-core";

interface PluginGoogleSignin {
  ios: {
    reversedClientId: string;
  };
  android: {
    googlePlayServicesAuthVersion?: string;
    swiperefreshlayoutVersion?: string;
  };
}

export interface CodePluginGoogleSignin {
  codePluginGoogleSignin: Plugin<PluginGoogleSignin>;
}
