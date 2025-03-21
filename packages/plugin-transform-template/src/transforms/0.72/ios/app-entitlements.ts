import fs from 'fs';

import {type BuildConfig, path, string} from '@brandingbrand/code-cli-kit';

/**
 * Configuration for handling iOS entitlements file replacements
 * @exports
 */
export default {
  /**
   * Regular expression pattern to match iOS entitlements files
   * Matches any path containing "ios/" followed by a filename ending in ".entitlements"
   */
  __test: /\bios\/.*\.entitlements$/gm,

  /**
   * Replaces the content of an iOS entitlements file with custom entitlements
   * @param content - The original content of the entitlements file
   * @param config - Build configuration object containing iOS-specific settings
   * @returns The replaced entitlements content, or original content if no custom path specified
   * @throws {Error} If the custom entitlements file cannot be read
   */
  replace: (content: string, config: BuildConfig): string => {
    if (!config.ios.entitlementsFilePath) return content;

    const customEntitlementsContent = fs.readFileSync(
      path.project.resolve(config.ios.entitlementsFilePath),
      'utf-8',
    );

    return string.replace(content, /[\s\S]*/m, customEntitlementsContent);
  },
};
