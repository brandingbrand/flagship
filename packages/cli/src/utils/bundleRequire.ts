import {path} from '@brandingbrand/code-cli-kit';
import {PackageJson} from 'type-fest';

/**
 * Resolves a module path using Node's require.resolve
 *
 * @param {string} id - The module identifier to resolve
 * @param {string} cwd - The current working directory
 * @returns {Promise<string>} The resolved module path
 * @throws {Error} If the module cannot be resolved
 */
async function resolveModule(id: string, cwd: string): Promise<string> {
  try {
    return require.resolve(id, {paths: [cwd]});
  } catch {
    return require.resolve(path.join(cwd, id));
  }
}

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
  cwd: string,
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

    packageOrFilePath = await resolveModule(packageOrFilePath, cwd);
  }

  // Use 'bundle-require' to bundle and require the specified file or package
  const {mod} = await _bundleRequire({
    filepath: packageOrFilePath,
    format,
  });

  return mod.default;
}
