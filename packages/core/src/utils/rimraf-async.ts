import rimraf from "rimraf";

export const async = (path: string, options: rimraf.Options): Promise<void> => {
  return new Promise(function (resolve, reject) {
    rimraf(path, options, (err: Error | null | undefined) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};
