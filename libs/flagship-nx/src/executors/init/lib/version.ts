/**
 * Normalizes a version number into a standard format XX.YYY.ZZZ
 *
 * @param version The version number to normalize.
 * @returns A normalized version number.
 */
export const bundleVersion = (version: string): string => {
  const [versionAndLabel] = version.split('-');
  const [major, minor, patch] = versionAndLabel.split('.');

  return `${major.padStart(2, '0')}${minor.padStart(3, '0')}${patch.padStart(3, '0')}`;
};
