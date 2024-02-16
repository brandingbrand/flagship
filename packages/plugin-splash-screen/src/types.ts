/**
 * Represents a plugin for configuring the splash screen settings in a mobile app.
 */
import type { Plugin } from "@brandingbrand/code-cli-kit";

/**
 * Represents the configuration options for the splash screen of a mobile app.
 */
export type CodePluginSplashCreen = {
  /**
   * The splash screen plugin configuration.
   */
  codePluginSplashScreen: Plugin<{
    /**
     * Configuration options for iOS splash screen.
     */
    ios?: IOSSplash;
    /**
     * Configuration options for Android splash screen.
     */
    android?: AndroidSplash;
  }>;
};

/**
 * Represents the configuration options for iOS splash screen.
 */
type IOSSplash =
  | {
      /**
       * Specifies that the splash screen is of type "legacy".
       */
      type: "legacy";
      /**
       * Configuration options for legacy iOS splash screen.
       */
      legacy: {
        /**
         * The path to the legacy splash screen.
         */
        xcassetsDir: string;
        /**
         * The name of the xcassets file for the legacy splash screen.
         */
        xcassetsFile: string;
      };
    }
  | {
      /**
       * Specifies that the splash screen is of type "generated".
       */
      type: "generated";
      /**
       * Configuration options for generated iOS splash screen.
       */
      generated: {
        /**
         * The path to the logo image for the generated splash screen.
         */
        logoPath: string;
        /**
         * The background color for the generated splash screen.
         */
        backgroundColor: string;
      };
    };

/**
 * Represents the configuration options for Android splash screen.
 */
type AndroidSplash =
  | {
      /**
       * Specifies that the splash screen is of type "legacy".
       */
      type: "legacy";
      /**
       * Configuration options for legacy Android splash screen.
       */
      legacy: {
        /**
         * The path to the legacy splash screen.
         */
        assetsDir: string;
      };
    }
  | {
      /**
       * Specifies that the splash screen is of type "generated".
       */
      type: "generated";
      /**
       * Configuration options for generated Android splash screen.
       */
      generated: {
        /**
         * The path to the logo image for the generated splash screen.
         */
        logoPath: string;
        /**
         * The background color for the generated splash screen.
         */
        backgroundColor: string;
      };
    };
