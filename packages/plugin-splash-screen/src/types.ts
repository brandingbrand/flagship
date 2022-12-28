import { Plugin } from "@brandingbrand/kernel-core";

interface PluginSplashScreen {
  logoPath?: string;
  iosSize?: number;
  androidSize?: number;
  backgroundColor?: string;
}

export interface KernelPluginSplashScreen {
  kernelPluginSplashScreen: Partial<Plugin<PluginSplashScreen>>;
}
