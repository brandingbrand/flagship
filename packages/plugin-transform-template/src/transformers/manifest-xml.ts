import {
  BuildConfig,
  PrebuildOptions,
  withManifest,
} from '@brandingbrand/code-cli-kit';

/**
 * Applies XML transformations to an Android manifest file using provided transform functions
 *
 * @param {BuildConfig} config - Build configuration object containing app settings and version info
 * @param {PrebuildOptions} options - Prebuild options for configuring the build process
 * @param {Record<string, Function>} transforms - Object containing named transform functions to apply to the manifest XML
 * @param {string} [filePath] - Optional path to the manifest file. If not provided, uses default location
 * @returns {Promise<void>} Promise that resolves when transforms are complete
 *
 * @throws {Error} If manifest file cannot be read or transformed
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
 * // Apply transforms to manifest
 * await manifestXmlTransformer(buildConfig, prebuildOptions, transforms);
 * ```
 */
export async function manifestXmlTransformer(
  config: BuildConfig,
  options: PrebuildOptions,
  transforms: Record<string, Function>,
  filePath: string = '',
): Promise<void> {
  return withManifest(xml => {
    return Object.values(transforms).forEach(it => it(xml, config, options));
  });
}
