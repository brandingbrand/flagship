import type { Plugin } from "@brandingbrand/code-cli-kit";

/**
 * Represents the target extension configuration for a code plugin.
 * This type specifies the configuration required for the code plugin target extension.
 */
export type CodePluginTargetExtension = {
  /**
   * The configuration for the code plugin target extension.
   * It is of type Plugin, containing an array of objects specifying properties for each extension.
   */
  codePluginTargetExtension: Plugin<
    {
      /**
       * Path to assets for the extension
       */
      assetsPath: string;

      /**
       * Bundle identifier for the extension
       */
      bundleId: string;

      /**
       * Name of the provisioning profile for the extension
       */
      provisioningProfileName: string;
    }[]
  >;
};
