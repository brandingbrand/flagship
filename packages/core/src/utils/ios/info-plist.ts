import plist, { PlistJsObj } from "simple-plist";

import * as path from "../path";

import type { Config } from "../../types/types";
import type { InfoPlist } from "../../types/info-plist";

const asyncReadFile = async (path: string) => {
  return new Promise<InfoPlist>((res, rej) => {
    plist.readFile<InfoPlist>(path, (err, data) => {
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

export const withPlist = async (
  config: Config,
  callback: (plist: InfoPlist) => void
) => {
  const infoPlist = await asyncReadFile(path.ios.infoPlistPath(config));

  callback(infoPlist);

  await asyncWriteFile(path.ios.infoPlistPath(config), infoPlist);
};
