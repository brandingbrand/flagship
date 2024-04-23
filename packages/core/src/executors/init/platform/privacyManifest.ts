import { fs, path } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

export const execute = (options: InitOptions, config: Config) => {
  return {
    /**
     * Executes initialization tasks for iOS platform.
     * This function copies a privacy manifest file to the iOS project directory if the manifest exists.
     * @returns {Promise<void>} A promise representing the completion of the initialization task.
     */
    ios: withSummary(
      async () => {
        const { privacyManifestPath } = config.ios;

        if (!privacyManifestPath) return;

        // Resolving absolute path of privacy manifest file relative to .coderc directory
        const privacyManifestAbsolutePath =
          path.config.resolve(privacyManifestPath);

        // Checking if privacy manifest file exists
        if (!fs.existsSync(privacyManifestAbsolutePath)) {
          throw new Error(
            `[PrivacyManifestExecutor]: privacy manifest path does not exist: ${privacyManifestAbsolutePath}`
          );
        }

        // Copying privacy manifest file to iOS project directory
        await fs.copyFile(
          privacyManifestAbsolutePath,
          path.project.resolve("ios", config.ios.name, `PrivacyInfo.xcprivacy`)
        );
      },
      "privacy-manifest",
      "platform::ios"
    ),
    android: async () => {
      //
    },
  };
};
