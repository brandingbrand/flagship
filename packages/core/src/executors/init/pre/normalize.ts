import omit from "lodash/omit";
import deepmerge from "deepmerge";
import isEmpty from "lodash/isEmpty";

import * as utils from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

export const execute = withSummary(
  async (options: InitOptions, config: Config) => {
    const rawIOS = config.ios;
    const rawAndroid = config.android;

    const installedPlugins = utils.plugins.get().map(utils.plugins.normalize);

    const installedIOSPlugins = installedPlugins
      .map((it: any) => omit(config?.[it as never]?.["ios"], "plugin"))
      .filter((it: any) => !isEmpty(it));
    const installedAndroidPlugins = installedPlugins
      .map((it: any) => omit(config?.[it as never]?.["android"], "plugin"))
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
      release: options.release,
      env: options.env,
    });
  },
  "normalize",
  "pre"
);
