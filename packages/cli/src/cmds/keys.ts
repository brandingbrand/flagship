import { program } from "commander";
import { env, keys, platforms } from "@brandingbrand/kernel-core";

program
  .command("keys")
  .description(
    "configure ios codesigning and/or android keystore signing config"
  )
  .option("-p, --platform [platform]", "platform: ios or android", "ios")
  .option("-v, --verbose", "show stdout", false)
  .action(async (options) => {
    for (const e of keys.pre.executors) {
      await e.execute(options, await env.get());
    }

    for (const u of [keys.prePlatform, keys.platform, keys.postPlatform]) {
      for (const p of platforms.get(options.platform)) {
        for (const e of u.executors) {
          await e.execute(options, await env.get())[p]();
        }
      }
    }

    for (const e of keys.post.executors) {
      await e.execute(options, await env.get());
    }
  });
