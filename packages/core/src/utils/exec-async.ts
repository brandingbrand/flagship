import { exec, ExecException } from "child_process";

import * as logger from "./logger";

export const async = (command: string) => {
  return new Promise((resolve, reject) => {
    exec(
      command,
      function (error: ExecException | null, stdout: string, stderr: string) {
        if (error) {
          process.stderr.write(stderr);

          return reject(error);
        }

        process.stdout.write(stdout);

        return resolve(stdout);
      }
    );
  });
};
