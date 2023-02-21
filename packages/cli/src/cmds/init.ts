import { program } from "commander";
import { env, init, platforms } from "@brandingbrand/code-core";

program
  .command("init")
  .description("initialize Code for a specific environment and platform")
  .option("-e, --env [env]", "initial environment", "prod")
  .option(
    "-p, --platform [platform]",
    "platform: ios, android or native (ios & android)",
    "native"
  )
  .option("-r, --release", "bundle only store environment", false)
  .option("-v, --verbose", "show stdout", false)
  .action(async (options) => {
    for (const e of init.pre.executors) {
      await e.execute(options, await env.get());
    }

    for (const e of init.platform.executors) {
      for (const p of platforms.get(options.platform)) {
        await e.execute(options, await env.get())[p]();
      }
    }

    for (const e of init.post.executors) {
      await e.execute(options, await env.get());
    }
  });
