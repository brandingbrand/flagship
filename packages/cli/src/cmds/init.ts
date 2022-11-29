import { program } from "commander";
import {
  pre,
  post,
  platform,
  platforms,
  prePlatform,
  postPlatform,
} from "@brandingbrand/kernel-core";

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
  .action(async (options) => {
    for (const e of pre.executors) {
      await e.execute(options, {}, __dirname);
    }

    for (const u of [prePlatform, platform, postPlatform]) {
      for (const p of platforms.get(options.platform)) {
        for (const e of u.executors) {
          await e.execute(options, {}, __dirname)[p]();
        }
      }
    }

    for (const e of post.executors) {
      await e.execute(options, {}, __dirname);
    }
  });
