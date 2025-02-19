import type {
  AlignDepsOptions,
  BuildConfig,
  GenerateOptions,
  PrebuildOptions,
  CodeConfig,
} from '@brandingbrand/code-cli-kit';
import {program} from 'commander';
import type {PackageJson} from 'type-fest';

/**
 * Configuration object containing various settings.
 */
export const config = {
  /**
   * @property {Object} __dangerously_access_code - Configuration object for fscode.
   */
  __dangerously_access_code: {} as CodeConfig,
  /**
   * @property {function} code - Getter function for accessing fscode configuration.
   */
  get code() {
    return this.__dangerously_access_code;
  },
  /**
   * @property {function} code - Setter function for updating fscode configuration.
   */
  set code(data: CodeConfig) {
    this.__dangerously_access_code = data;
  },
  /**
   * @property {Object} __dangerously_access_options - Configuration object for options.
   */
  __dangerously_access_options: {} as PrebuildOptions,
  /**
   * @property {function} options - Getter function for accessing options configuration.
   */
  get options() {
    return this.__dangerously_access_options;
  },
  /**
   * @property {function} options - Setter function for updating options configuration.
   */
  set options(data: PrebuildOptions) {
    this.__dangerously_access_options = data;
  },
  /**
   * @property {Object} __dangerously_access_generate_options - Configuration object for generate options.
   */
  __dangerously_access_generate_options: {} as GenerateOptions,
  /**
   * @property {function} generateOptions - Getter function for accessing options configuration.
   */
  get generateOptions() {
    return this.__dangerously_access_generate_options;
  },
  /**
   * @property {function} generateOptions - Setter function for updating options configuration.
   */
  set generateOptions(data: GenerateOptions) {
    // Check if the 'name' property of the data object follows the non-scoped package names format
    if (!/^[a-z0-9-~][a-z0-9-._~]*$/gm.test(data.name)) {
      // Throw an error if the name does not match the specified format
      throw Error(
        '[GenerateCliCommandError]: name must follow non-scoped package names format',
      );
    }

    this.__dangerously_access_generate_options = data;
  },
  /**
   * @property {Object} __dangerously_access_align_deps_options - Configuration object for align deps options.
   */
  __dangerously_access_align_deps_options: {} as AlignDepsOptions,
  /**
   * @property {function} alignDepsOptions - Getter function for accessing options configuration.
   */
  get alignDepsOptions() {
    return this.__dangerously_access_align_deps_options;
  },
  /**
   * @property {function} alignDepsOptions - Setter function for updating options configuration.
   */
  set alignDepsOptions(data: AlignDepsOptions) {
    this.__dangerously_access_align_deps_options = data;
  },
  /**
   * @property {Object} __dangerously_access_build - Configuration object for build settings.
   */
  __dangerously_access_build: {
    ios: {
      displayName: 'Default',
      bundleId: 'com.default',
    },
    android: {
      displayName: 'Default',
      packageName: 'com.default',
    },
  } as BuildConfig,
  /**
   * @property {function} build - Getter function for accessing build configuration.
   */
  get build() {
    return this.__dangerously_access_build;
  },
  /**
   * @property {function} build - Setter function for updating build configuration.
   */
  set build(data: BuildConfig) {
    this.__dangerously_access_build = data;
  },
};

/**
 * Determines if a string represents a package or a file path.
 *
 * @param {string} str - The string to check.
 * @return {boolean} True if the string represents a package, false if it represents a file path.
 */
export function isPackage(str: string): boolean {
  // Regular expression pattern to match package names
  const packagePattern =
    /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

  // Check if the string matches the package pattern
  return packagePattern.test(str);
}

/**
 * Asynchronously bundles and requires a package or file.
 *
 * @param {string} packageOrFilePath - The name of the package or the file path to bundle and require.
 * @returns {Promise<any>} A Promise that resolves to the required module.
 */
export async function bundleRequire<T extends any>(
  packageOrFilePath: string,
  format: 'cjs' | 'esm' = 'cjs',
): Promise<T> {
  // Import the 'bundle-require' esm module dynamically
  // Due to esm and exports + types need to ignore ts for this import
  // @ts-ignore
  const {bundleRequire: _bundleRequire} = await import('bundle-require');

  // Check if the input string represents a package
  if (isPackage(packageOrFilePath)) {
    // Parse package.json contents
    const pkg = require(
      require.resolve(`${packageOrFilePath}/package.json`),
    ) as PackageJson;

    // Determine if the package is esm, if so reassign format
    if (pkg.type === 'module') {
      format = 'esm';
    }

    // Resolve the package name to its filepath
    packageOrFilePath = require.resolve(packageOrFilePath, {
      paths: [process.cwd()],
    });
  }

  // Use 'bundle-require' to bundle and require the specified file or package
  const {mod} = await _bundleRequire({
    filepath: packageOrFilePath,
    format,
  });

  return mod.default;
}

/**
 * Checks if the prebuild command is present in the program arguments.
 * @returns {boolean} Returns true if the prebuild command is present, otherwise false.
 */
export function isPrebuildCommand(): boolean {
  // Check if there are no program arguments or if the first argument is missing
  if (!program.args[0]) return false;

  // Check if the first argument is "prebuild"
  if (program.args[0] === 'prebuild') {
    return true; // Return true if the first argument is "prebuild"
  }

  return false; // Return false if the first argument is not "prebuild"
}

/**
 * Checks if the generate command is present in the program arguments.
 * @returns {boolean} Returns true if the generate command is present, otherwise false.
 */
export function isGenerateCommand(): boolean {
  // Check if there are no program arguments or if the first argument is missing
  if (!program.args[0]) return false;

  // Check if the first argument is "generate"
  if (program.args[0] === 'plugin') {
    return true; // Return true if the first argument is "generate"
  }

  return false; // Return false if the first argument is not "generate"
}

/**
 * Checks if the generate command is present in the program arguments.
 * @returns {boolean} Returns true if the generate command is present, otherwise false.
 */
export function isAlignDepsCommand(): boolean {
  // Check if there are no program arguments or if the first argument is missing
  if (!program.args[0]) return false;

  // Check if the first argument is "generate"
  if (program.args[0] === 'align-deps') {
    return true; // Return true if the first argument is "generate"
  }

  return false; // Return false if the first argument is not "generate"
}
