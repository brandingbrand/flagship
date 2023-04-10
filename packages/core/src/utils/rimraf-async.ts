import rimraf from "rimraf";

/**
 * Asynchronously removes files and directories using `rimraf`.
 *
 * @param {string} path - The path to remove.
 * @param {rimraf.Options} options - The options to pass to `rimraf`.
 * @returns {Promise<void>} A promise that resolves when the removal is complete.
 */
export const async = (path: string, options: rimraf.Options): Promise<void> => {
  return new Promise(function (resolve, reject) {
    rimraf(path, options, (err: Error | null | undefined) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};
