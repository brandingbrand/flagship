/* eslint-disable no-control-regex */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Table from "cli-table";

import { exec, fs, summary } from "../../../utils";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";
import type { Items } from "../../../types/Summary";

export const execute = async (options: InitOptions, config: Config) => {
  const LOG_FILE_PATH = "/tmp/code-core.log";
  const PADDING_MAX = 60;
  let errors = 0;
  let warnings = 0;

  const table = new Table({
    head: ["Executor", "Hook", "Execution Time", "Success", "Error", "Warning"],
    style: {
      head: ["blue"],
    },
  });

  const template = (errorsArr: unknown[], warningsArr: unknown[]) => {
    const pkg = require("../package.json");

    const name = `${pkg.name} v${pkg.version}`;
    const padding = PADDING_MAX - name.length;

    return `
┌────────────────────────────────────────────────────────────┐
│                                                            │
│ ${name}${"│".padStart(padding)}
│                                                            │
└────────────────────────────────────────────────────────────┘


 Summary
 ──────────────────────────

${
  process.env["CI"]
    ? table.toString()
    : table
        .toString()
        .replace(/\[[\d]+?m/g, "")
        .replace(//g, "")
}
${errorsArr.length ? "\n\n Errors\n ──────────────────────────\n" : ""}
${
  errorsArr.length
    ? errorsArr.map((it: any) => ` ${it.toString()}\n`).join("\n")
    : ""
}
${warningsArr.length ? "\n Warnings\n ──────────────────────────\n" : ""}
${
  warningsArr.length
    ? warningsArr.map((it: any) => ` ${it.toString()}\n`).join("\n")
    : ""
}
    `;
  };

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

  const data = template(
    summary.items.filter((it) => !!it.error).map((it) => it.error),
    summary.items.filter((it) => !!it.warning).map((it) => it.warning)
  );

  if (!options.verbose) {
    process.stderr.moveCursor(0, -2);
    process.stderr.clearLine(1);
  }

  process.stderr.write(
    `⚡️ Flagship Code initialization complete with ${errors} error(s) and ${warnings} warning(s)\n\n`
  );

  process.stderr.write(
    `🎉 See summary ${
      process.env["CI"] ? "below" : "in file:///tmp/code-core.log"
    }\n\n`
  );

  if (warnings) {
    process.stderr.write(
      `⚠️  See warning(s) ${
        process.env["CI"] ? "below" : "in file:///tmp/code-core.log"
      }\n\n`
    );
  }

  if (errors) {
    process.stderr.write(
      `❌ See error(s) ${
        process.env["CI"] ? "below" : "in file:///tmp/code-core.log"
      }\n\n`
    );
  }

  if (process.env["CI"]) {
    process.stderr.write(data);
  } else {
    await fs.appendFile(LOG_FILE_PATH, data);
  }

  if (!process.env["CI"] && errors) {
    await exec.async("open file:///tmp/code-core.log").catch(() => {
      //
    });
  }
};
