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
     * Path to small monochrome icon for Android notification bar.
     *
     * @remarks
     * This should be a simple, single-color silhouette design that follows Material Design guidelines:
     * - Design at 24x24dp base size
     * - Use only alpha channel (transparency), no RGB colors
     * - Simple shapes that are recognizable at small sizes
     * - Avoid fine details that won't render well when scaled
     * - Must work well on both light and dark backgrounds
     * - Should be clearly visible when converted to white for notification bar
     *
     * The system will automatically scale this icon for different device densities:
     * - mdpi: 24x24px
     * - hdpi: 36x36px
     * - xhdpi: 48x48px
     * - xxhdpi: 72x72px
     * - xxxhdpi: 96x96px
     *
     * @example
     * Typical usage in Android manifest:
     * ```xml
     * <meta-data
     *   android:name="android.app.notification_icon"
     *   android:resource="@mipmap/ic_notification"/>
     * ```
     */
    notificationIcon?: string;

    /**
     * Optional hex color code for Android adaptive icon background.
     * Used as a fallback when backgroundIcon is not provided.
     * Should be a valid hex color string (e.g. '#FFFFFF').
     */
    backgroundColor?: string;

    /**
     * Optional inset value for Android launcher icons (in percentage).
     * Controls how much the icon image is inset from the edges of its container.
     *
     * @remarks
     * This applies to both standard and round launcher icons on Android:
     * - Higher values create more padding around the icon
     * - Lower values make the icon fill more of its container
     * - Typically between 0-20 (representing 0-20% inset)
     * - Default launcher icons use around 13% inset
     * - Round icons typically use less inset (around 4%)
     */
    inset?: number;
  }>;
};
