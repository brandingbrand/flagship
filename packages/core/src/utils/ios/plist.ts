import plist, { PlistJsObj } from "simple-plist";

/**
 * Asynchronously reads the plist file from the given path.
 *
 * @template T - The type of the plist file contents.
 * @param {string} path - The path to the plist file.
 * @returns {Promise<T>} A promise that resolves with the parsed plist file contents.
 */
const asyncReadFile = async <T>(path: string) => {
  return new Promise<T>((res, rej) => {
    plist.readFile<T>(path, (err, data) => {
      if (err) return rej(err);

      if (data) return res(data);
    });
  });
};

/**
 * Asynchronously writes the given PlistJsObj to the specified path.
 *
 * @param {string} path - The path to write the plist file to.
 * @param {PlistJsObj} obj - The plist object to write to the file.
 * @returns {Promise<void>} A promise that resolves when the file is written.
 */
const asyncWriteFile = async (path: string, obj: PlistJsObj) => {
  return new Promise<void>((res, rej) => {
    plist.writeFile(path, obj, (err, data) => {
      if (err) return rej(err);

      res(data);
    });
  });
};

/**
 * Asynchronously modifies a property of a plist file at the given path.
 *
 * @template T - The type of the plist file contents.
 * @param {string} path - The path to the plist file.
 * @param {(plist: T) => T} callback - The function that modifies the plist contents.
 * @returns {Promise<void>} A promise that resolves when the modified plist has been written to disk.
 */
export const withPlist = async <T>(path: string, callback: (plist: T) => T) => {
  const plist = await asyncReadFile<T>(path);

  const res = callback(plist);

  await asyncWriteFile(path, res as PlistJsObj);
};
