/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Table from "cli-table";

import { exec, fs, summary } from "../../../utils";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";
import type { SummaryType } from "../../../types/Summary";

const pkg = require("../package.json");

export const execute = async (options: InitOptions, config: Config) => {
  const LOG_FILE_PATH = "/tmp/kernel-core.log";
  const PADDING_MAX = 60;
  let errors = 0;

  const table = new Table({
    head: ["Executor", "Hook", "Execution Time", "Success", "Error"],
    style: {
      head: ["blue"],
    },
  });

  const template = (name: string, errors: unknown[]) => {
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
    : table.toString().replace(/\[[\d]+?m/g, "")
}


${errors.length ? " Errors\n ──────────────────────────\n" : ""}
${
  errors.length ? errors.map((it: any) => ` ${it.toString()}\n`).join("\n") : ""
}
    `;
  };

  summary.items.forEach((it) => {
    const row = Object.keys(it)
      .filter((el) => el !== "errorMessage")
      .map((el) => {
        if (el === "error" && it[el as keyof SummaryType]) errors++;

        if (el === "success" || el === "error") {
          return it[el as keyof SummaryType] ? "✓" : "✗";
        }

        return it[el as keyof SummaryType];
      });

    table.push(row as []);
  });

  if (await fs.pathExists(LOG_FILE_PATH)) {
    await fs.unlink(LOG_FILE_PATH);
  }

  const data = template(
    `${pkg.name} v${pkg.version}`,
    summary.items.filter((it) => !!it.errorMessage).map((it) => it.errorMessage)
  );

  if (!options.verbose) {
    process.stderr.moveCursor(0, -2);
    process.stderr.clearLine(1);
  }

  process.stderr.write(
    `⚡️ Kernel initialization complete with ${errors} error(s)\n\n`
  );

  process.stderr.write(
    `🎉 See summary ${
      process.env["CI"] ? "below" : "in file:///tmp/kernel-core.log"
    }\n\n`
  );

  if (errors) {
    process.stderr.write(
      `❌ See error(s) ${
        process.env["CI"] ? "below" : "in file:///tmp/kernel-core.log"
      }\n\n`
    );
  }

  if (process.env["CI"]) {
    process.stderr.write(data);
  } else {
    await fs.appendFile(LOG_FILE_PATH, data);
  }

  if (!process.env["CI"] && errors) {
    await exec.async("open file:///tmp/kernel-core.log").catch(() => {
      //
    });
  }
};
