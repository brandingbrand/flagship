import { program } from "commander";

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
    // TODO init command
  });
