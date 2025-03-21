import {type BuildConfig, string} from '@brandingbrand/code-cli-kit';

/**
 * Configuration object for Android Gemfile processing
 */
export default {
  /**
   * Regular expression to match Android Gemfile paths
   * Matches any path containing "android/" followed by a filename ending in "Gemfile"
   */
  __test: /\bandroid\/.*Gemfile$/gm,

  /**
   * Processes and modifies the content of an Android Gemfile
   * @param content - The original content of the Gemfile
   * @param config - Build configuration object containing Android-specific settings
   * @returns Modified Gemfile content with additional gems if specified in config,
   *          or original content if no gems are configured
   */
  gems: (content: string, config: BuildConfig): string => {
    if (!config.android.gemfile) return content;

    return string.replace(
      content,
      /(source.*\n)/m,
      `$1\n${config.android.gemfile.map(it => it).join('\n')}\n`,
    );
  },
};
