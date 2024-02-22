import { Option, program } from "commander";
import { type GenerateOptions } from "@brandingbrand/code-cli-kit";

import { config, logger } from "@/lib";
import * as actions from "@/actions";
import { Reporter } from "@/components";

/**
 * Defines a command for generating a flagship-code template using the "commander" library.
 * This command allows users to generate templates with specified types and names.
 *
 * @example
 * ```bash
 * yarn flagship-code generate --type plugin --name @brandingbrand/code-plugin-myplugin --path ./plugins
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command("generate")
  .description("generate a template")
  .addOption(
    new Option("-t, --type <type>", "type of template")
      .choices(["plugin"])
      .makeOptionMandatory()
  )
  .requiredOption("-n, --name <name>", "package name of your template")
  .action(async (options: GenerateOptions) => {
    /**
     * Update the configuration generate options with the provided options and command type.
     */
    config.generateOptions = options;

    const { render } = await import("ink");

    /**
     * Render the Reporter component to display progress.
     */
    const { unmount } = render(
      <Reporter actions={["config", "template", "generator", "packagers"]} />,
      { stdout: process.stderr }
    );

    /**
     * Loop through predefined actions and execute them sequentially.
     */
    for (const action of [
      actions.info,
      actions.config,
      actions.template,
      actions.generator,
      actions.packagers,
    ]) {
      await action();
    }

    /**
     * Unmount react ink components
     */
    unmount();

    /**
     * Resume logging with console.log and process.stdout
     */
    logger.resume();
  });
