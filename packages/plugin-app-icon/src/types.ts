import type {Plugin} from '@brandingbrand/code-cli-kit';

/**
 * Type definition for the code plugin that generates app icons for iOS and Android.
 *
 * @remarks
 * This plugin handles generation of various icon types needed for mobile applications:
 * - Universal app icons for iOS App Store and basic Android launchers
 * - Adaptive icons for modern Android devices (foreground/background layers)
 * - Small notification icons for Android status bar
 *
 * @example
 * ```typescript
 * const config: CodePluginAppIcon = {
 *   codePluginAppIcon: {
 *     universalIcon: 'path/to/1024x1024.png',
 *     foregroundIcon: 'path/to/foreground.png',
 *     backgroundIcon: 'path/to/background.png',
 *     notificationIcon: 'path/to/notification.png'
 *   }
 * };
 * ```
 */
export type CodePluginAppIcon = {
  codePluginAppIcon: Plugin<{
    /**
     * Path to 1024x1024px PNG icon used for iOS App Store and basic Android launchers.
     * This should be a square image with no transparency.
     */
    universalIcon: string;

    /**
     * Path to foreground layer image for Android adaptive icons.
     * Should be 108x108dp (432x432px) with transparency for adaptive scaling.
     */
    foregroundIcon: string;

    /**
     * Path to background layer image for Android adaptive icons.
     * Should be 108x108dp (432x432px), typically a solid color or simple pattern.
     */
    backgroundIcon: string;

    /**
     * Optional hex color code for Android adaptive icon background.
     * Used as a fallback when backgroundIcon is not provided.
     * Should be a valid hex color string (e.g. '#FFFFFF').
     */
    backgroundColor?: string;
  }>;
};
