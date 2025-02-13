import {
  BuildConfig,
  PrebuildOptions,
  path,
  withUTF8,
} from '@brandingbrand/code-cli-kit';

/**
 * Transforms the content of a UTF-8 encoded file using a collection of transform functions.
 *
 * @param config - Build configuration object
 * @param options - Prebuild options
 * @param transforms - Object containing transform functions to apply
 * @returns Promise that resolves when transformations are complete
 *
 * @example
 * ```typescript
 * const transforms = {
 *   addHeader: (content: string) => `// Header\n${content}`,
 *   replaceVersion: (content: string, config) =>
 *     content.replace('VERSION', config.version)
 * };
 *
 * await utf8Transformer(buildConfig, prebuildOptions, transforms);
 * ```
 */
export async function utf8Transformer(
  config: BuildConfig,
  options: PrebuildOptions,
  transforms: Record<string, Function>,
): Promise<void> {
  return withUTF8(path.ios.privacyManifest, (content: string) => {
    return Object.values(transforms).reduce((acc, curr) => {
      return curr(acc, config, options);
    }, content);
  });
}
