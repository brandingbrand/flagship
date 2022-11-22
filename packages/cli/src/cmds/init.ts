import { program } from "commander";
import {
  cocoapods,
  env,
  fs,
  path,
  platforms,
  plugins,
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
    env.compile(options.env);
    env.createEnvIndex();

    const _platforms = platforms.get(options.platform);

    for (const platform of _platforms) {
      await fs.copyDir(
        path.resolve(__dirname, "template"),
        path.project.path(),
        {},
        platform
      );

      cocoapods.install(platform);
    }

    for (const platform of _platforms) {
      await plugins.execute({}, plugins.get(), platform);
    }
  });
