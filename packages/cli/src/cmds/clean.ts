import { program } from "commander";

program
  .command("clean")
  .description("remove build and installation artifacts")
  .option(
    "-p, --platform [platform]",
    "platform: ios, android or native (ios & android)",
    "native"
  )
  .action(() => {
    //
  });
