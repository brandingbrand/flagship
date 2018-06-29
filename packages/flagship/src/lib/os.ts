/**
 * Whether or not the current platform is a Linux platform.
 */
export const linux = /linux/.test(process.platform);
export const win = /^win/.test(process.platform);
