import process from "process";

import { program } from "commander";

import "./cmds";
import cliPkg from "../package.json";

/**
 * The main program object for the command-line interface.
 * @type {Object}
 */
program
  .name("flagship-code")
  .description("command-line interface for ephermal native code generation")
  .version(cliPkg.version, "-v, --version", "output the current version");
/**
 * Handles any uncaught errors and logs a message to the console.
 * @param {Error} error - The error that was caught.
 */
program.parseAsync().catch(async (error) => {
  const chalk = (await import("chalk")).default;

  console.log();
  console.log(
    chalk.red(
      "Unexpected error. Please report it as a bug: https://github.com/brandingbrand/flagship/issues"
    )
  );
  console.log(error.message);
  console.log();

  process.exit(1);
});
