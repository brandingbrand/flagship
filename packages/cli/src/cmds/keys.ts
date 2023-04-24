import { program } from "commander";
import { env, keys, platforms } from "@brandingbrand/code-core";

program
  .command("keys")
  .description(
    "configure ios codesigning and/or android keystore signing config"
  )
  .option("-p, --platform [platform]", "platform: ios or android", "ios")
  .option("-v, --verbose", "show stdout", false)
  .action(async (options) => {
    for (const e of keys.pre.executors) {
      await e.execute(options, env.get);
    }

    for (const e of keys.platform.executors) {
      for (const p of platforms.get(options.platform)) {
        await e.execute(options, env.get)[p]();
      }
    }

    for (const e of keys.post.executors) {
      await e.execute(options, env.get);
    }
  });
