/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { fs, fsk, path, spinner } from "../../../utils";

export const execute = async (options: any, config: any, cliPath: string) => {
  if (options.quiet) {
    if (
      await fs.pathExists(
        path.project.resolve("node_modules", "npmlog", "log.js")
      )
    ) {
      await fsk.update(
        path.project.resolve("node_modules", "npmlog", "log.js"),
        /(log.level =[\s\S]+?\n)/,
        "log.level = 'info'\n"
      );
    }

    spinner.stop();
  }
};
