import path from 'path';

let _pathToProject: string;

/**
 * The absolute path to the current working directory of the Node.js process.
 * If the cached value exists, return that value otherwise cache the current
 * working directory.
 *
 * @example
 * ```ts
 * const absolutePathToProject = projectPath();
 * ```
 *
 * @return {string} The absolute path to the project.
 */
function projectPath(): string {
  if (_pathToProject) return _pathToProject;

  _pathToProject = process.cwd();

  return _pathToProject;
}

/**
 * Resolves a path relative to the project root directory.
 *
 * @param {...string} paths - Path segments to be joined and resolved.
 * @returns {string} The resolved absolute path.
 */
export function resolvePathFromProject(...paths: string[]): string {
  return path.resolve(projectPath(), ...paths);
}

/**
 * Splits a string into an array using dot notation.
 *
 * @param {string} value - The string to be split.
 * @returns {string[]} An array of strings obtained by splitting the input string.
 */
export function packageToPath(value: string): string[] {
  return value.split('.');
}
