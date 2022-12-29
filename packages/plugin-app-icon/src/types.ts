import { Plugin } from "@brandingbrand/kernel-core";

interface PluginAppIcon {
  appIconPath: string;
}

export interface KernelPluginAppIcon {
  kernelPluginAppIcon: Partial<Plugin<PluginAppIcon>>;
}
