import { Plugin } from "@brandingbrand/code-core";

interface PluginAppIcon {
  appIconPath: string;
  android?: {
    inset: number;
  };
}

export interface CodePluginAppIcon {
  codePluginAppIcon: Partial<Plugin<PluginAppIcon>>;
}
