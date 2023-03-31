import ejs from "ejs";
import Table from "cli-table";
import noop from "lodash/noop";
import readline from "readline";

import { exec, fs, path, summary } from "../../../utils";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";
import type { Items } from "../../../types/Summary";

export const execute = async (options: InitOptions, config: Config) => {
  const LOG_FILE_PATH = "/tmp/code-core.log";
  let errors = 0;
  let warnings = 0;

  const table = new Table({
    head: ["Executor", "Hook", "Execution Time", "Success", "Error", "Warning"],
  });

  summary.items.forEach((it) => {
    const row = Object.keys(it)
      .filter((el) => el !== "errorMessage")
      .map((el) => {
        if (el === "error" && it[el as keyof Items]) errors++;

        if (el === "warning" && it[el as keyof Items]) warnings++;

        if (el === "success" || el === "error" || el === "warning") {
          return it[el as keyof Items] ? "✓" : "";
        }

        return it[el as keyof Items];
      });

    table.push(row as []);
  });

  if (await fs.pathExists(LOG_FILE_PATH)) {
    await fs.unlink(LOG_FILE_PATH);
  }

  const data = ejs.render(
    (
      await fs.readFile(
        path.resolve(
          __dirname,
          "..",
          "assets",
          "template",
          "etc",
          "code-core.log"
        )
      )
    ).toString(),
    {
      summary: process.env["CI"]
        ? table.toString()
        : table
            .toString()
            .replace(/\[[\d]+?m/g, "")
            .replace(//g, ""),
      errors: summary.items
        .filter((it) => !!it.error)
        .map((it) => it.error)
        .join("\n\n "),
      warnings: summary.items
        .filter((it) => !!it.warning)
        .map((it) => it.warning)
        .join("\n\n "),
    }
  );

  if (!options.verbose) {
    readline.moveCursor(process.stdout, 0, -2);
    readline.clearLine(process.stdout, 1);
  }

  console.log(
    `⚡️ Flagship Code™ initialization complete with ${errors} error(s) and ${warnings} warning(s)\n`
  );

  console.log(
    `🎉 See summary ${
      process.env["CI"] ? "below" : "in file:///tmp/code-core.log"
    }\n`
  );

  if (warnings) {
    console.log(
      `⚠️  See warning(s) ${
        process.env["CI"] ? "below" : "in file:///tmp/code-core.log"
      }\n`
    );
  }

  if (errors) {
    console.log(
      `❌ See error(s) ${
        process.env["CI"] ? "below" : "in file:///tmp/code-core.log"
      }\n`
    );
  }

  if (process.env["CI"]) {
    console.log(data);

    if (errors) process.exit(1);
  } else {
    await fs.appendFile(LOG_FILE_PATH, data);

    if (errors) await exec.async("open file:///tmp/code-core.log").catch(noop);
  }
};
