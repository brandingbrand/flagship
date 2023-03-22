import fs from "fs-extra";
import path from "path";
import ejs from "ejs";

import { path as pathk } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

export const execute = (options: InitOptions, config: Config) => {
  const copyDir = async (
    source: string,
    dest: string,
    options: ejs.Data,
    platform: "ios" | "android",
    root = true
  ) => {
    const BINARIES = /(gradlew|\.(jar|keystore|png|jpg|gif))$/;

    await fs.mkdirp(dest);

    const files = await fs.readdir(source);

    for (const f of files) {
      if (
        fs.lstatSync(path.join(source, f)).isDirectory() &&
        f !== platform &&
        root
      ) {
        continue;
      }
      const target = path.join(
        dest,
        ejs.render(f.replace(/^\$/, ""), options, {
          openDelimiter: "{",
          closeDelimiter: "}",
        })
      );

      const file = path.join(source, f);
      const stats = await fs.stat(file);

      if (stats.isDirectory()) {
        await copyDir(file, target, options, platform, false);
      } else if (!file.match(BINARIES)) {
        const content = await fs.readFile(file, "utf8");

        await fs.writeFile(target, ejs.render(content, options));
      } else {
        await fs.copyFile(file, target);
      }
    }
  };

  return {
    ios: withSummary(
      async () =>
        copyDir(
          path.resolve(__dirname, "template"),
          pathk.project.path(),
          config,
          "ios"
        ),
      "template",
      "platform::ios"
    ),
    android: withSummary(
      async () =>
        copyDir(
          path.resolve(__dirname, "template"),
          pathk.project.path(),
          config,
          "android"
        ),
      "template",
      "platform::android"
    ),
  };
};
