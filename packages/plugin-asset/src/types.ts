import { Plugin } from "@brandingbrand/kernel-core";

interface PluginAsset {
  assetPath: string[];
}

export interface KernelPluginAsset {
  kernelPluginAsset: Plugin<PluginAsset>;
}
