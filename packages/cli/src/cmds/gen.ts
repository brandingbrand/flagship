import { Option, program } from "commander";

/**
 * Defines a command for generating a flagship-code template using the "commander" library.
 * This command allows users to generate templates with specified types and names.
 *
 * @example
 * ```bash
 * yarn flagship-code gen --type plugin --name @brandingbrand/code-plugin-myplugin --path ./plugins
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command("gen")
  .description("generate a template")
  .addOption(
    new Option("-t, --type <type>", "type of template")
      .choices(["plugin"])
      .makeOptionMandatory()
  )
  .requiredOption("-n, --name <name>", "package name of your template")
  .requiredOption("-p, --path <path>", "path to plugin directory")
  .action(async () => {});
