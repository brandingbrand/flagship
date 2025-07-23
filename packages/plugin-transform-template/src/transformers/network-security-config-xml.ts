import {
  BuildConfig,
  PrebuildOptions,
  withNetworkSecurityConfig,
} from '@brandingbrand/code-cli-kit';

/**
 * Applies transformations to Android network security config XML file
 *
 * This function applies a series of transform functions to modify the Android network security
 * configuration XML file. Each transform function receives the XML content and can make modifications
 * as needed.
 *
 * @param config - Build configuration object containing app settings
 * @param options - Prebuild options for the build process
 * @param transforms - Object containing transform functions to apply to the XML
 * @param filePath - Optional path to the network security config file
 * @returns Promise that resolves when all transforms are applied
 *
 * @example
 * ```typescript
 * // Example transform functions for network security config
 * const transforms = {
 *   allowCleartext: (xml: string) => {
 *     return xml.replace('</network-security-config>',
 *       '<base-config cleartextTrafficPermitted="true"></base-config></network-security-config>');
 *   },
 *   addDomain: (xml: string) => {
 *     return xml.replace('</network-security-config>',
 *       '<domain-config><domain>example.com</domain></domain-config></network-security-config>');
 *   }
 * };
 *
 * // Apply transforms to network security config
 * await networkSecurityConfigXmlTransformer(buildConfig, prebuildOptions, transforms);
 * ```
 */
export async function networkSecurityConfigXmlTransformer(
  config: BuildConfig,
  options: PrebuildOptions,
  transforms: Record<string, Function>,
  filePath: string = '',
): Promise<void> {
  return withNetworkSecurityConfig(xml => {
    return Object.values(transforms).forEach(it => it(xml, config, options));
  });
}
