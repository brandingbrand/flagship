import fs from "fs-extra";
import path from "path";
import ejs from "ejs";

import { path as pathk } from "../../utils";

export const execute = (options: any, config: any, cliPath: string) => {
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
    ios: async () =>
      copyDir(
        path.resolve(cliPath, "template"),
        pathk.project.path(),
        config,
        "ios"
      ),
    android: async () =>
      copyDir(
        path.resolve(cliPath, "template"),
        pathk.project.path(),
        config,
        "android"
      ),
  };
};
