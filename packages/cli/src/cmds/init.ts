import { program } from "commander";
import { env, init, platforms } from "@brandingbrand/kernel-core";

program
  .command("init")
  .description("initialize Kernel for a specific environment and platform")
  .option("-e, --env [env]", "initial environment", "prod")
  .option(
    "-p, --platform [platform]",
    "platform: ios, android or native (ios & android)",
    "native"
  )
  .option("-r, --release", "bundle only store environment", false)
  .option("-v, --verbose", "show stdout")
  .action(async (options) => {
    for (const e of init.pre.executors) {
      await e.execute(options, await env.get());
    }

    for (const u of [init.prePlatform, init.platform, init.postPlatform]) {
      for (const p of platforms.get(options.platform)) {
        for (const e of u.executors) {
          await e.execute(options, await env.get())[p]();
        }
      }
    }

    for (const e of init.post.executors) {
      await e.execute(options, await env.get());
    }
  });
