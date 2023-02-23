import { Plugin } from "@brandingbrand/code-core";

interface PluginAppIcon {
  appIconPath: string;
}

export interface CodePluginAppIcon {
  codePluginAppIcon: Partial<Plugin<PluginAppIcon>>;
}
