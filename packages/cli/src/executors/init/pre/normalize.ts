import omit from "lodash/omit";
import deepmerge from "deepmerge";
import isEmpty from "lodash/isEmpty";

import { env, plugins, summary } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = summary.withSummary(
  async (options: Options.InitOptions, config: Config) => {
    const rawIOS = config.ios;
    const rawAndroid = config.android;

    const installedPlugins = plugins.get().map(plugins.normalize);

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

    env.set = {
      ...config,
      ios: normalizedIOSPlugins(),
      android: normalizedAndroidPlugins(),
      release: options.release,
      env: options.env,
    };
  },
  "normalize",
  "pre"
);
