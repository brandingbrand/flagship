import {existsSync} from 'fs';
import path from 'path';

/**
 * Checks if the specified dependency exists in the project's dependencies or devDependencies.
 * @param projectPath - The path to the project's root directory.
 * @param dependencyName - The name of the dependency to check.
 * @returns True if the dependency is installed, otherwise false.
 */
export function hasDependency(
  projectPath: string,
  dependencyName: string,
): boolean {
  const packageJsonPath = path.resolve(projectPath, 'package.json');
  if (!existsSync(packageJsonPath)) return false;

  const packageJson = require(packageJsonPath);
  return Boolean(
    packageJson.dependencies?.[dependencyName] ||
      packageJson.devDependencies?.[dependencyName],
  );
}

/**
 * Determines if the given file path matches any of the specified patterns.
 * @param filePath - The path to the file.
 * @param patterns - An array of strings representing file name patterns to match.
 * @returns True if the file path matches any of the patterns, otherwise false.
 */
export function matchesFilePatterns(
  filePath: string,
  patterns: string[],
): boolean {
  return patterns.some(pattern => filePath.includes(pattern));
}
