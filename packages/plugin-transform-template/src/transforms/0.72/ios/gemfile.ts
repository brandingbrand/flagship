import {BuildConfig, string} from '@brandingbrand/code-cli-kit';

/**
 * Configuration for managing iOS Gemfile modifications
 */
export default {
  /**
   * Regular expression to match iOS Gemfile paths
   * Matches paths containing 'ios/' followed by any characters and ending in 'Gemfile'
   */
  __test: /\bios\/.*Gemfile$/gm,

  /**
   * Modifies the content of an iOS Gemfile by adding additional gem declarations
   * @param content - The original content of the Gemfile
   * @param config - Build configuration object containing iOS-specific settings
   * @returns Modified Gemfile content with added gems, or original content if no gems specified
   */
  gems: (content: string, config: BuildConfig): string => {
    if (!config.ios.gemfile) return content;

    return string.replace(
      content,
      /(source.*\n)/m,
      `$1\n${config.ios.gemfile.map(it => it).join('\n')}\n`,
    );
  },
};
