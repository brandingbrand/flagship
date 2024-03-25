import { Option, program } from "commander";
import type { PrebuildOptions } from "@brandingbrand/code-cli-kit";

import * as actions from "@/actions";
import { Reporter } from "@/components";
import { config, emitter, logger, actions as actionsRes } from "@/lib";

/**
 * Defines a command for the "prebuild" operation using the "commander" library.
 * This command facilitates ephemeral native code generation for a specific build,
 * environment, and platform.
 *
 * @example
 * ```bash
 * yarn flagship-code prebuild --build internal --env staging
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
    "Ephemeral native code generation for a specific build, environment, and platform."
  )
  .requiredOption("-b, --build [build]", "Build configuration.")
  .requiredOption("-e, --env [env]", "Initial environment.")
  .addOption(
    new Option(
      "-p, --platform [platform]",
      "ios, android, or native (ios & android) code generation."
    )
      .choices(["ios", "android", "native"])
      .default("native")
  )
  .option("-r, --release", "Bundle only specified environment.", false)
  .option("-v, --verbose", "Show stdout.", false)
  .action(async (options: PrebuildOptions) => {
    /**
     * Update the configuration options with the provided options and command type.
     */
    config.options = { ...options, command: "prebuild" };

    const { render } = await import("ink");

    /**
     * Render the Reporter component to display progress.
     */
    const { unmount } = render(
      <Reporter
        actions={Object.keys(actions)
          // Exclude the "info" action
          .filter((it) => !["info", "generator"].includes(it))}
      />,
      { stdout: process.stderr }
    );

    /**
     * Loop through predefined actions and execute them sequentially.
     */
    for (const action of [
      actions.info,
      actions.clean,
      actions.config,
      actions.env,
      actions.template,
      actions.transformers,
      actions.plugins,
      actions.packagers,
    ]) {
      await action();
    }

    /**
     * Emit event when actions are complete to show <Results />
     */
    emitter.emit("action", {
      action: "DONE",
    });

    /**
     * Unmount react ink components
     */
    unmount();

    /**
     * Resume logging with console.log and process.stdout
     */
    logger.resume();

    /**
     * Exit process with error if errors exist; this is important for
     * registering errors with continuous integration.
     */
    if (actionsRes.some((it) => it.error)) {
      process.exit(1);
    }
  });
