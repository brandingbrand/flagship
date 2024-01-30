import { program } from "commander";

/**
 * Defines a command for the "prebuild" operation using the "commander" library.
 * This command facilitates ephemeral native code generation for a specific build,
 * environment, and platform.
 *
 * @example
 * ```bash
 * yarn fscode prebuild --build internal --env dev
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command("prebuild")
  .description(
    "ephermal native code generation for a specific build, environment and platform"
  )
  .requiredOption("-b, --build [build]", "build configuration")
  .requiredOption("-e, --env [env]", "initial environment")
  .option(
    "-p, --platform [platform]",
    "platform: ios, android or native (ios & android)",
    "native"
  )
  .option("-r, --release", "bundle only specified environment", false)
  .option("-v, --verbose", "show stdout", false)
  .action(async () => {});
