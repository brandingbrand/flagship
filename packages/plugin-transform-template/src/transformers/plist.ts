import {
  type BuildConfig,
  type PrebuildOptions,
  withInfoPlist,
} from '@brandingbrand/code-cli-kit';

/**
 * Transforms iOS Info.plist content using provided transform functions
 *
 * @param config - Build configuration object
 * @param options - Prebuild options object
 * @param transforms - Record of transform functions to apply to the Info.plist content
 *
 * @returns Promise that resolves when transforms are complete
 *
 * @example
 * ```ts
 * // Example transform functions
 * const transforms = {
 *   addVersion: (content, config) => {
 *     content.CFBundleVersion = config.version;
 *     return content;
 *   },
 *   addName: (content, config) => {
 *     content.CFBundleName = config.name;
 *     return content;
 *   }
 * };
 *
 * // Apply transforms
 * await infoPlistTransformer(buildConfig, options, transforms);
 * ```
 */
export async function plistTransformer(
  config: BuildConfig,
  options: PrebuildOptions,
  transforms: Record<string, Function>,
): Promise<void> {
  return withInfoPlist(content => {
    return Object.values(transforms).reduce((acc, curr) => {
      return curr(acc, config, options);
    }, content);
  });
}
