import { exec, ExecException } from "child_process";

/**
 * Executes a command asynchronously using child_process.exec.
 *
 * @param {string} command - The command to execute.
 * @returns {Promise<string>} - A promise that resolves with the stdout of the executed command if successful, otherwise rejects with the error.
 */
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
