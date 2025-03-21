import {BuildConfig, string} from '@brandingbrand/code-cli-kit';

/**
 * Configuration object for modifying iOS Podfile contents
 */
export default {
  /** Regular expression to match Podfile filenames */
  __test: /\bPodfile$/gm,

  /**
   * Adds configuration settings to the Podfile
   * @param content - The original Podfile content
   * @param config - Build configuration object
   * @returns Modified Podfile content with added configuration
   */
  config: (content: string, config: BuildConfig): string => {
    if (!config.ios.podfile?.config) return content;

    return string.replace(
      content,
      /(^platform\s+:ios.*\n)/m,
      `$1${config.ios.podfile.config.map(it => it).join('\n')}\n`,
    );
  },

  /**
   * Adds pod dependencies to the 'app' target in Podfile
   * @param content - The original Podfile content
   * @param config - Build configuration object
   * @returns Modified Podfile content with added pod dependencies
   */
  pods: (content: string, config: BuildConfig): string => {
    if (!config.ios.podfile?.pods) return content;

    return string.replace(
      content,
      /(target\s*'app'[\s\S]*?\n(\s+))/m,
      `$1${config.ios.podfile.pods.map(it => it).join('\n$2')}\n$2`,
    );
  },

  /**
   * Updates the iOS deployment target version in Podfile
   * @param content - The original Podfile content
   * @param config - Build configuration object
   * @returns Modified Podfile content with updated deployment target
   */
  deploymentTarget: (content: string, config: BuildConfig): string => {
    if (!config.ios.deploymentTarget) return content;

    return string.replace(
      content,
      /(^platform\s+:ios,\s+).*/m,
      `$1'${config.ios.deploymentTarget}'`,
    );
  },
};
