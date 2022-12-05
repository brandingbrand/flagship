import { program } from "commander";
import { init, platforms } from "@brandingbrand/kernel-core";

program
  .command("init")
  .description("initialize Kernel for a specific environment and platform")
  .option("-e, --env [env]", "initial environment", "prod")
  .option(
    "-p, --platform [platform]",
    "platform: ios, android or native (ios & android)",
    "native"
  )
  .option("-r, --release", "bundle only store environment")
  .option("-v, --verbose", "show stdout")
  .action(async (options) => {
    for (const e of init.pre.executors) {
      await e.execute(options, {});
    }

    for (const u of [init.prePlatform, init.platform, init.postPlatform]) {
      for (const p of platforms.get(options.platform)) {
        for (const e of u.executors) {
          await e.execute(options, {})[p]();
        }
      }
    }

    for (const e of init.post.executors) {
      await e.execute(options, {});
    }
  });
