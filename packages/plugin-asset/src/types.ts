import { Plugin } from "@brandingbrand/code-core";

interface PluginAsset {
  assetPath: string[];
}

export interface CodePluginAsset {
  codePluginAsset: Plugin<PluginAsset>;
}
