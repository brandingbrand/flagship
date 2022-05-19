/**
 * Left pads a string with zeros to a specified length. If the string is longer than the
 * specified length it is truncated to the specified length.
 *
 * @param str The string to pad to the given length
 * @param len The length to pad the string to
 * @return Padded input
 */
const padZeros = (str: string, len: number): string => {
  str = str.slice(0, Math.max(0, len));

  for (let i = len - str.length; i > 0; --i) {
    str = `0${str}`;
  }

  return str;
};

/**
 * Normalizes a version number into a standard format XX.YYY.ZZZ
 *
 * @param version The version number to normalize.
 * @return A normalized version number.
 */
export const normalize = (version: string): string => {
  const versionAndLabel = version.split('-');
  const parts = versionAndLabel[0]?.split('.');

  return [
    padZeros(parts?.[0] ?? '', 2),
    padZeros(parts?.[1] ?? '', 3),
    padZeros(parts?.[2] ?? '', 3),
  ].join('');
};
