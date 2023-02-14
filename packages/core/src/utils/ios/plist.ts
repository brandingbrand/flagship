import plist, { PlistJsObj } from "simple-plist";

const asyncReadFile = async <T>(path: string) => {
  return new Promise<T>((res, rej) => {
    plist.readFile<T>(path, (err, data) => {
      if (err) return rej(err);

      if (data) return res(data);
    });
  });
};

const asyncWriteFile = async (path: string, obj: PlistJsObj) => {
  return new Promise<void>((res, rej) => {
    plist.writeFile(path, obj, (err, data) => {
      if (err) return rej(err);

      res(data);
    });
  });
};

export const withPlist = async <T>(path: string, callback: (plist: T) => T) => {
  const plist = await asyncReadFile<T>(path);

  const res = callback(plist);

  await asyncWriteFile(path, res as PlistJsObj);
};
