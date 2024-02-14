import type { Plugin } from "@brandingbrand/code-cli-kit";

export type CodePluginAsset = {
  codePluginAsset: Plugin<{
    assetPath: string[];
  }>;
};
