import { exec, ExecException } from "child_process";

import * as logger from "./logger";

export const async = (command: string) => {
  return new Promise((resolve, reject) => {
    exec(
      command,
      function (error: ExecException | null, stdout: string, stderr: string) {
        if (error) {
          logger.logError(stderr);

          return reject(error);
        }

        logger.logInfo(stdout);

        return resolve(stdout);
      }
    );
  });
};
