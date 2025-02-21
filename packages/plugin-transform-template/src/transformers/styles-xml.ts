import {
  BuildConfig,
  PrebuildOptions,
  withStyles,
} from '@brandingbrand/code-cli-kit';

/**
 * Applies XML transformations to styles.xml using provided transform functions
 *
 * @param config - Build configuration object containing app settings and configuration
 * @param options - Prebuild options specifying build, environment and platform settings
 * @param transforms - Object containing transform functions to apply to the XML content
 * @param filePath - Optional path to styles.xml file (unused)
 * @returns Promise that resolves when transforms are complete
 *
 * @example
 * ```typescript
 * // Example transform functions
 * const transforms = {
 *   addThemeColor: (xml: string, config: BuildConfig) => {
 *     return xml.replace('</resources>', `<color name="theme">${config.theme.color}</color></resources>`);
 *   },
 *   addCustomStyle: (xml: string) => {
 *     return xml.replace('</resources>', '<style name="CustomStyle">...</style></resources>');
 *   }
 * };
 *
 * // Apply transforms to styles.xml
 * await stylesXmlTransformer(buildConfig, prebuildOptions, transforms);
 * ```
 */
export async function stylesXmlTransformer(
  config: BuildConfig,
  options: PrebuildOptions,
  transforms: Record<string, Function>,
  filePath: string = '',
): Promise<void> {
  return withStyles(xml => {
    return Object.values(transforms).forEach(it => it(xml, config, options));
  });
}
