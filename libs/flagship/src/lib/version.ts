/**
 * Left pads a string with zeros to a specified length. If the string is longer than the
 * specified length it is truncated to the specified length.
 *
 * @param {string} str The string to pad to the given length
 * @param {number} len The length to pad the string to
 * @returns {string} Padded input
 */
function padZeros(str: string, len: number): string {
  str = str.substring(0, len);

  for (let i = len - str.length; i > 0; --i) {
    str = '0' + str;
  }

  return str;
}

/**
 * Normalizes a version number into a standard format XX.YYY.ZZZ
 *
 * @param {string} version The version number to normalize.
 * @returns {string} A normalized version number.
 */
export function normalize(version: string): string {
  const versionAndLabel = version.split('-');
  const parts = versionAndLabel[0].split('.');

  return [padZeros(parts[0], 2), padZeros(parts[1], 3), padZeros(parts[2], 3)].join('');
}
