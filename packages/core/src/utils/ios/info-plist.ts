import * as path from "../path";
import { withPlist } from "./plist";

import type { Config } from "../../types/Config";
import { InfoPlistType } from "../../types/ios";

/**
 * Executes a callback with the parsed Info.plist file as an object.
 *
 * @param {InfoPlistCallback} callback - The callback to execute.
 * @param {Config} config - The configuration object for the app.
 * @returns {Promise} - A Promise that resolves with the updated Info.plist file as an object.
 */
export const withInfoPlist = (
  callback: (plist: InfoPlistType.InfoPlist) => InfoPlistType.InfoPlist,
  config: Config
) =>
  withPlist<InfoPlistType.InfoPlist>(path.ios.infoPlistPath(config), callback);

/**
 * Sets a URL scheme in the Info.plist file.
 *
 * @param {string} urlScheme - The URL scheme to set.
 * @param {Config} config - The configuration object for the app.
 * @returns {Promise} - A Promise that resolves with the updated Info.plist file as an object.
 */
export const setUrlScheme = (urlScheme: string, config: Config) =>
  withInfoPlist((plist) => {
    if (plist.CFBundleURLTypes?.[0]) {
      plist.CFBundleURLTypes[0].CFBundleURLSchemes.push(urlScheme);
    } else {
      plist.CFBundleURLTypes = [{ CFBundleURLSchemes: [urlScheme] }];
    }

    return plist;
  }, config);

/**
 * Sets the entire Info.plist file.
 *
 * @param {Object} data - The data to set.
 * @param {Config} config - The configuration object for the app.
 * @returns {Promise} - A Promise that resolves with the updated Info.plist file as an object.
 */
export const setPlist = (data: Record<string, unknown>, config: Config) =>
  withInfoPlist((plist) => {
    return {
      ...plist,
      ...data,
    };
  }, config);
