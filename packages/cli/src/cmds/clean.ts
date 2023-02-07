import { program } from "commander";
import { clean, env, platforms } from "@brandingbrand/kernel-core";

program
  .command("clean")
  .description("remove build and installation artifacts")
  .option(
    "-p, --platform [platform]",
    "platform: ios, android or native (ios & android)",
    "native"
  )
  .option("-v, --verbose", "show stdout", false)
  .action(async (options) => {
    for (const e of clean.pre.executors) {
      await e.execute(options, await env.get());
    }

    for (const e of clean.platform.executors) {
      for (const p of platforms.get(options.platform)) {
        await e.execute(options, await env.get())[p]();
      }
    }

    for (const e of clean.post.executors) {
      await e.execute(options, await env.get());
    }
  });
