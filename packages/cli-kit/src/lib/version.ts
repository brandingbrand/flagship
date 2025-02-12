import semver from 'semver';

/**
 * Gets the major and minor version of the installed React Native package.
 * Supports overriding via the global variable FLAGSHIP_CODE_REACT_NATIVE_VERSION.
 *
 * @returns {string} The major and minor version of React Native in the format 'X.Y'.
 * @throws Will throw an error if the version cannot be determined.
 */
export function getReactNativeVersion(): string {
  if (
    typeof (global as any).FLAGSHIP_CODE_REACT_NATIVE_VERSION === 'string' &&
    /^\d+\.\d+$/.test((global as any).FLAGSHIP_CODE_REACT_NATIVE_VERSION)
  ) {
    return (global as any).FLAGSHIP_CODE_REACT_NATIVE_VERSION;
  }

  try {
    const packageJsonPath = require.resolve('react-native/package.json', {
      paths: [process.cwd()],
    });
    const {version} = require(packageJsonPath);

    if (!version) {
      throw new Error('React Native version is undefined in package.json.');
    }

    const coercedVersion = semver.coerce(version);
    if (!coercedVersion) {
      throw new Error(`Invalid React Native version: ${version}`);
    }

    return `${coercedVersion.major}.${coercedVersion.minor}`;
  } catch (error) {
    throw new Error(
      `Failed to determine React Native version: ${(error as any).message}`,
    );
  }
}

/**
 * Selects the appropriate module based on the installed React Native version.
 * Falls back to the closest lower available version if an exact match is not found.
 *
 * @param {Record<string, T>} versions - A mapping of React Native versions to their respective modules.
 * @returns {T} The module corresponding to the installed React Native version.
 * @throws Will throw an error if no compatible version is found.
 *
 * @example
 * ```typescript
 * const selectedModule = version.select({
 *   '0.72': module72,
 *   '0.73': module73,
 *   '0.75': module75,
 * });
 * ```
 */
export function select<T>(versions: Record<string, T>): T {
  const rnVersion = getReactNativeVersion();
  const availableVersions = Object.keys(versions)
    .map(version => ({version, semver: semver.coerce(version)}))
    .filter(v => v.semver)
    .sort((a, b) => semver.compare(b.semver!.version, a.semver!.version)); // Sort descending

  // Try exact match
  if (versions[rnVersion]) {
    return versions[rnVersion] as T;
  }

  // Find the closest lower version
  for (const {version} of availableVersions) {
    if (semver.lte(version, rnVersion)) {
      return versions[version] as T;
    }
  }

  throw new Error(
    `Unsupported React Native version: ${rnVersion}. No suitable fallback found. Available versions: ${availableVersions
      .map(v => v.version)
      .join(', ')}`,
  );
}
