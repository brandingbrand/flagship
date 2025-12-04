/**
 * Represents the profile configuration for a package dependency
 */
export type DependencyProfile = {
  /** The version or version range of the package */
  version: string;
  /** Whether this dependency is only needed for development */
  devOnly?: boolean;
  /** Array of package names that this package requires/depends on */
  capabilities?: string[];
  /** Whether this package is required for the project to function */
  required?: boolean;
  /** Whether usage of this package is prohibited */
  banned?: boolean;
};

/**
 * Interface representing the structure of a package.json file.
 */
export interface PackageJsonType {
  name: string;
  version: string;
  dependencies: Record<string, unknown>;
  devDependencies: Record<string, unknown>;
  [key: string]: unknown;
}
