import plist, { type PlistJsObj } from "simple-plist";

import type { InfoPlist } from "@/@types";
import { paths } from "@/lib";

/**
 * Asynchronously reads the plist file from the given path.
 *
 * @template T - The type of the plist file contents.
 * @param {string} path - The path to the plist file.
 * @returns {Promise<T>} A promise that resolves with the parsed plist file contents.
 */
async function asyncReadFile<T>(path: string): Promise<T> {
  return new Promise<T>((res, rej) => {
    plist.readFile<T>(path, (err, data) => {
      if (err) return rej(err);

      if (data) return res(data);
    });
  });
}

/**
 * Asynchronously writes the given PlistJsObj to the specified path.
 *
 * @param {string} path - The path to write the plist file to.
 * @param {PlistJsObj} obj - The plist object to write to the file.
 * @returns {Promise<void>} A promise that resolves when the file is written.
 */
async function asyncWriteFile(path: string, obj: PlistJsObj): Promise<void> {
  return new Promise<void>((res, rej) => {
    plist.writeFile(path, obj, (err, data) => {
      if (err) return rej(err);

      res(data);
    });
  });
}

/**
 * Asynchronously modifies a property of a plist file at the given path.
 *
 * @template T - The type of the plist file contents.
 * @param {string} path - The path to the plist file.
 * @param {(plist: T) => T} callback - The function that modifies the plist contents.
 * @returns {Promise<void>} A promise that resolves when the modified plist has been written to disk.
 */
export async function withPlist<T>(
  path: string,
  callback: (plist: T) => T
): Promise<void> {
  const plistData = plist.readFileSync<T>(path);

  const res = callback(plistData);

  plist.writeFileSync(path, res as PlistJsObj);
}

/**
 * Executes a callback with the parsed Info.plist file as an object.
 *
 * @param {InfoPlistCallback} callback - The callback to execute.
 * @returns {Promise} - A Promise that resolves with the updated Info.plist file as an object.
 */
export const withInfoPlist = (
  callback: (plist: InfoPlist) => InfoPlist
): Promise<void> => withPlist<InfoPlist>(paths.ios.infoPlist(), callback);
