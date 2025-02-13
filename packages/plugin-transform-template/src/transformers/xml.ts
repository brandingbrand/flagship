import {
  BuildConfig,
  PrebuildOptions,
  withStrings,
} from '@brandingbrand/code-cli-kit';

/**
 * Applies XML transformations using provided transform functions
 *
 * @param config - Build configuration object
 * @param options - Prebuild options
 * @param transforms - Object containing transform functions to apply
 *
 * @example
 * ```typescript
 * // Example transform functions
 * const transforms = {
 *   addVersion: (xml: string, config: BuildConfig) => {
 *     return xml.replace('</manifest>', `android:versionName="${config.version}"></manifest>`);
 *   },
 *   addPermission: (xml: string) => {
 *     return xml.replace('</manifest>', '<uses-permission android:name="android.permission.INTERNET" /></manifest>');
 *   }
 * };
 *
 * // Apply transforms
 * await xmlTransformer(buildConfig, prebuildOptions, transforms);
 * ```
 */
export async function xmlTransformer(
  config: BuildConfig,
  options: PrebuildOptions,
  transforms: Record<string, Function>,
): Promise<void> {
  return withStrings(xml => {
    return Object.values(transforms).forEach(it => it(xml, config, options));
  });
}
