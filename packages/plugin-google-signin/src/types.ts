import type { Plugin } from "@brandingbrand/code-cli-kit";

export type CodePluginGoogleSignin = {
  codePluginGoogleSignin: Plugin<{
    ios: {
      reversedClientId: string;
    };
    android: {
      googlePlayServicesAuthVersion?: string;
      swiperefreshlayoutVersion?: string;
    };
  }>;
};
