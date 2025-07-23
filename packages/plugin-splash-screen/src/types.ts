/**
 * Represents a plugin for configuring the splash screen settings in a mobile app.
 */
import type {Plugin} from '@brandingbrand/code-cli-kit';

/**
 * Represents the configuration options for the splash screen of a mobile app.
 */
export type CodePluginSplashScreen = {
  /**
   * The splash screen plugin configuration.
   */
  codePluginSplashScreen: Plugin<{
    splashImage: string;
  }>;
};
