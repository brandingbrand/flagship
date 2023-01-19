import { Plugin } from "@brandingbrand/kernel-core";

interface PluginSplashScreen {
  ios?: {
    type: "legacy" | "generated";
    legacy?: {
      path?: string;
      xcassets?: string;
    };
    generated?: {
      logoPath: string;
      size?: number;
      backgroundColor?: string;
    };
  };
  android?: {
    type: "legacy" | "generated";
    legacy?: {
      path?: string;
    };
    generated?: {
      logoPath?: string;
      size?: number;
      backgroundColor?: string;
    };
  };
}

export interface KernelPluginSplashScreen {
  kernelPluginSplashScreen: Partial<Plugin<PluginSplashScreen>>;
}
