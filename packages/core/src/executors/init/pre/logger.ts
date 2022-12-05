/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { fs, fsk, path, spinner } from "../../../utils";

export const execute = async (options: any, config: any) => {
  if (!options.verbose) {
    spinner.start("Initializing the app");

    //@ts-ignore
    process.stdout.write = function () {};

    if (
      await fs.pathExists(
        path.project.resolve("node_modules", "npmlog", "log.js")
      )
    ) {
      await fsk.update(
        path.project.resolve("node_modules", "npmlog", "log.js"),
        /(log.level =[\s\S]+?\n)/,
        "log.level = 'error'\n"
      );
    }
  }
};
