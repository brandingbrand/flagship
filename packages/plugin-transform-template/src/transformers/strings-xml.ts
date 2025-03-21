import {
  BuildConfig,
  PrebuildOptions,
  withStrings,
} from '@brandingbrand/code-cli-kit';

/**
 * Transforms strings.xml content by applying provided transform functions
 *
 * @param config - Build configuration containing version, name and other build details
 * @param options - Prebuild options specifying environment, platform and other settings
 * @param transforms - Object containing transform functions to modify the XML content
 * @param filePath - Optional path to the strings.xml file to transform
 * @returns Promise that resolves when all transforms are applied
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
export async function stringsXmlTransformer(
  config: BuildConfig,
  options: PrebuildOptions,
  transforms: Record<string, Function>,
  filePath: string = '',
): Promise<void> {
  return withStrings(xml => {
    return Object.values(transforms).forEach(it => it(xml, config, options));
  });
}
