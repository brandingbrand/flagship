import omit from "lodash/omit";
import deepmerge from "deepmerge";
import isEmpty from "lodash/isEmpty";

import * as utils from "../../../utils";

export const execute = async (options: any, config: any) => {
  const rawIOS = config.ios;
  const rawAndroid = config.android;

  const installedPlugins = utils.plugins.get().map(utils.plugins.normalize);

  const installedIOSPlugins = installedPlugins
    .map((it: any) => omit(config?.[it as never]?.["ios"], "kernel"))
    .filter((it: any) => !isEmpty(it));
  const installedAndroidPlugins = installedPlugins
    .map((it: any) => omit(config?.[it as never]?.["android"], "kernel"))
    .filter((it: any) => !isEmpty(it));

  const normalizedIOSPlugins = () => {
    if (!isEmpty(installedIOSPlugins)) {
      return deepmerge.all([rawIOS, ...installedIOSPlugins]);
    }

    return rawIOS;
  };

  const normalizedAndroidPlugins = () => {
    if (!isEmpty(installedAndroidPlugins)) {
      return deepmerge.all([rawAndroid, ...installedAndroidPlugins]);
    }

    return rawAndroid;
  };

  utils.env.set({
    ...config,
    ios: normalizedIOSPlugins(),
    android: normalizedAndroidPlugins(),
  });
};
