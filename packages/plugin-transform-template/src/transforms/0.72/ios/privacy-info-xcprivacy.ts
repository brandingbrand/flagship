import fs from 'fs';

import {BuildConfig, path, string} from '@brandingbrand/code-cli-kit';

/**
 * Transform configuration for handling PrivacyInfo.xcprivacy files in iOS builds.
 *
 * @remarks
 * This transformer handles the replacement of privacy manifest content in iOS builds.
 * It checks for and validates the privacy manifest file path, then replaces the
 * existing content with the specified privacy manifest content.
 */
export default {
  /**
   * Regular expression pattern to match PrivacyInfo.xcprivacy files
   */
  __test: /\bPrivacyInfo\.xcprivacy$/gm,

  /**
   * Replace the content of a PrivacyInfo.xcprivacy file with privacy manifest content
   *
   * @param content - The original content of the PrivacyInfo.xcprivacy file
   * @param config - Build configuration object containing iOS-specific settings
   * @returns The replaced content from the privacy manifest file, or original content if no manifest path provided
   * @throws Error if the specified privacy manifest path does not exist
   */
  replace: (content: string, config: BuildConfig): string => {
    const {privacyManifestPath} = config.ios;

    if (!privacyManifestPath) return content;

    const privacyManifestAbsolutePath =
      path.project.resolve(privacyManifestPath);

    if (!fs.existsSync(privacyManifestAbsolutePath)) {
      throw new Error(
        `[PrivacyInfoXCPrivacyTransformerError]: path to privacy manifest does not exist ${privacyManifestAbsolutePath}, please update privacyManifestPath to the correct path relative to the root of your React Native project.`,
      );
    }

    const privacyManifestContent = fs.readFileSync(
      privacyManifestAbsolutePath,
      'utf-8',
    );

    return string.replace(content, /[\s\S]*/m, privacyManifestContent);
  },
};
