import { program } from "commander";

program
  .command("keys")
  .description(
    "configure ios codesigning and/or android keystore signing config"
  )
  .option("-p, --platform [platform]", "platform: ios or android", "ios")
  .action(async (options) => {
    // TODO init command
  });
