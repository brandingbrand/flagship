/**
 * Indicates whether the current platform is Linux.
 * @type {boolean}
 */
export const linux = process.platform.includes("linux");

/**
 * Indicates whether the current platform is Windows.
 * @type {boolean}
 */
export const win = process.platform.startsWith("win");
