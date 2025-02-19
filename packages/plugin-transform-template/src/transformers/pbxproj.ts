import {
  BuildConfig,
  PrebuildOptions,
  withPbxproj,
} from '@brandingbrand/code-cli-kit';

/**
 * Transform an Xcode project file (.pbxproj) by applying multiple transformer functions.
 *
 * This function takes a build configuration, prebuild options, and a record of transformer
 * functions to modify the Xcode project configuration.
 *
 * @example
 * // Example transformer functions
 * const transforms = {
 *   addFramework: (project, config, options) => {
 *     project.addFramework('MyFramework.framework');
 *   },
 *   updateBuildSettings: (project, config, options) => {
 *     project.updateBuildSettings({ ENABLE_BITCODE: 'NO' });
 *   }
 * };
 *
 * // Apply transformations
 * await pbxprojTransformer(buildConfig, prebuildOptions, transforms);
 *
 * @param config - Build configuration object containing project settings
 * @param options - Prebuild options for configuring the transformation process
 * @param transforms - Record of transformer functions to apply to the project.
 *                    Each function receives (project, config, options) as arguments.
 * @returns Promise that resolves when all transformations are complete
 */
export function pbxprojTransformer(
  config: BuildConfig,
  options: PrebuildOptions,
  transforms: Record<string, Function>,
  filePath: string = '',
): Promise<void> {
  return withPbxproj(project => {
    Object.values(transforms).forEach(it => it(project, config, options));
  });
}
