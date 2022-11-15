import { program } from "commander";

program
  .command("env")
  .description("generate env index")
  .option("-e, --env [env]", "single environment", "")
  .action((options) => {
    //
  });
