import plist from "simple-plist";
import deepmerge from "deepmerge";
import type { PlistJsObj } from "simple-plist";

import { path } from "../../../utils";
import type { Config } from "../../../types/types";

export const execute = (options: any, config: Config) => {
  const asyncReadFile = async (path: string) => {
    return new Promise<PlistJsObj>((res, rej) => {
      plist.readFile<PlistJsObj>(path, (err, data) => {
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

  return {
    ios: async () => {
      if (!config.ios.plist) return;

      const data = await asyncReadFile(path.ios.infoPlistPath(config));

      await asyncWriteFile(
        path.ios.infoPlistPath(config),
        deepmerge.all([data, config.ios.plist])
      );
    },
    android: async () => {
      //
    },
  };
};
