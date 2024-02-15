import type { Plugin } from "@brandingbrand/code-cli-kit";

/**
 * Type definition for the code plugin app icon.
 */
export type CodePluginAppIcon = {
  codePluginAppIcon: Plugin<{
    /**
     * The path to the app icon.
     */
    appIconPath: string;

    /**
     * The insets for the icon.
     */
    iconInsets: number;
  }>;
};

/**
 * Type definition for an icon.
 */
export type Icon = {
  /**
   * The platform of the icon.
   */
  platform: "ios" | "android";

  /**
   * The type of the icon.
   */
  type: "universal" | "legacy" | "adaptive" | "notification";

  /**
   * The name of the icon.
   */
  name: string;

  /**
   * The input file for the icon.
   */
  inputFile: string;

  /**
   * Optional transformation properties for the icon.
   */
  transform?: {
    /**
     * The size of the transformation.
     */
    size: number;

    /**
     * The radius of the transformation.
     */
    radius: number;

    /**
     * The padding of the transformation.
     */
    padding: number;
  };
};

/**
 * Type definition for a rule.
 */
export type Rule = {
  /**
   * The platform of the rule.
   */
  platform: "ios" | "android";

  /**
   * The size of the rule.
   */
  size: {
    /**
     * Universal size for the rule (optional).
     */
    universal?: number;

    /**
     * Legacy size for the rule (optional).
     */
    legacy?: number;

    /**
     * Adaptive size for the rule (optional).
     */
    adaptive?: number;

    /**
     * Notification size for the rule (optional).
     */
    notification?: number;
  };

  /**
   * The scale of the rule.
   */
  scale?: number;

  /**
   * The idiom of the rule (optional).
   */
  idiom?: "ios-marketing" | "ipad" | "iphone";

  /**
   * The DPI of the rule (optional).
   */
  dpi?: string;
};
