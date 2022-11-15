/**
 * Whether or not the current platform is a Linux platform.
 */
export const linux = process.platform.includes("linux");
export const win = process.platform.startsWith("win");
