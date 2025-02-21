import {
  BuildConfig,
  PrebuildOptions,
  withColors,
} from '@brandingbrand/code-cli-kit';

/**
 * Transforms colors.xml file content using provided transform functions
 *
 * This function applies a series of transformation functions to modify the colors.xml
 * file content. Each transform function receives the XML content along with build
 * configuration and prebuild options.
 *
 * @param config - Build configuration containing version, environment and other build settings
 * @param options - Prebuild options specifying platform, environment and build details
 * @param transforms - Object containing transform functions to apply to the XML content
 * @param filePath - Optional path to the colors.xml file
 * @returns Promise that resolves when all transformations are complete
 *
 * @example
 * ```typescript
 * // Example transform functions
 * const transforms = {
 *   addPrimaryColor: (xml: string, config: BuildConfig) => {
 *     return xml.replace('</resources>',
 *       `<color name="primary">${config.theme.primary}</color></resources>`
 *     );
 *   },
 *   addSecondaryColor: (xml: string) => {
 *     return xml.replace('</resources>',
 *       '<color name="secondary">#FFFFFF</color></resources>'
 *     );
 *   }
 * };
 *
 * // Apply transforms
 * await colorsXmlTransformer(buildConfig, prebuildOptions, transforms);
 * ```
 */
export async function colorsXmlTransformer(
  config: BuildConfig,
  options: PrebuildOptions,
  transforms: Record<string, Function>,
  filePath: string = '',
): Promise<void> {
  return withColors(xml => {
    return Object.values(transforms).forEach(it => it(xml, config, options));
  });
}
