import type { Plugin } from "@brandingbrand/code-cli-kit";

export type CodePluginTargetExtension = {
  codePluginTargetExtension: Plugin<
    {
      assetsPath: string;
      bundleId: string;
      provisioningProfileName: string;
    }[]
  >;
};
