import semver from 'semver';

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

interface VersionParts {
  major: number;
  minor: number;
}

function parseVersion(version: string): VersionParts {
  const parts = version.split('.').map(Number);
  return {
    major: parts[0] ?? 0,
    minor: parts[1] ?? 0,
  };
}

function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const verA = parseVersion(a);
  const verB = parseVersion(b);

  if (verA.major !== verB.major) {
    return verA.major > verB.major ? 1 : -1;
  }
  if (verA.minor !== verB.minor) {
    return verA.minor > verB.minor ? 1 : -1;
  }
  return 0;
}

export function selectWithVersion<T>(
  versions: Record<string, T>,
  version: string,
): T {
  const availableVersions = Object.keys(versions).sort(
    (a, b) => -compareVersions(a, b),
  ); // Sort descending

  // Try exact match
  if (versions[version]) {
    return versions[version] as T;
  }

  // Find the closest lower version
  for (const version of availableVersions) {
    if (compareVersions(version, version) <= 0) {
      return versions[version] as T;
    }
  }

  throw new Error(
    `Unsupported React Native version: ${version}. No suitable fallback found. Available versions: ${availableVersions.join(', ')}`,
  );
}

export function select<T>(versions: Record<string, T>): T {
  const rnVersion = getReactNativeVersion();
  const availableVersions = Object.keys(versions).sort(
    (a, b) => -compareVersions(a, b),
  ); // Sort descending

  // Try exact match
  if (versions[rnVersion]) {
    return versions[rnVersion] as T;
  }

  // Find the closest lower version
  for (const version of availableVersions) {
    if (compareVersions(version, rnVersion) <= 0) {
      return versions[version] as T;
    }
  }

  throw new Error(
    `Unsupported React Native version: ${rnVersion}. No suitable fallback found. Available versions: ${availableVersions.join(', ')}`,
  );
}
