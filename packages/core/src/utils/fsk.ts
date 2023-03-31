import ejs from "ejs";
import fse from "fs-extra";
import path from "path";

import fs from "./fs";
import { Warning } from "./errors";

/**
 * Checks if a keyword exists in a file.
 *
 * @param path The path to the file to check for the keyword.
 * @param keyword The keyword to search for in the file
 * @return True if the keyword exists in the file.
 */
export const doesKeywordExist = async (
  path: string,
  keyword: RegExp | string
): Promise<boolean> => {
  const fileContent = (await fs.readFile(path)).toString();
  if (typeof keyword === "string") {
    return fileContent.includes(keyword);
  }

  return keyword.test(fileContent);
};

/**
 * Updates a file asynchronously, replacing a given string with a new one.
 *
 * @param path The path to the file to update.
 * @param oldText The old text to replace.
 * @param newText The replacement text.
 * @return
 */
export const update = async (
  path: string,
  oldText: RegExp | string,
  newText: string
): Promise<void> => {
  if (!(await doesKeywordExist(path, oldText))) {
    throw new Warning(`Couldn't find ${oldText} in ${path}`);
  }

  const fileContent = await fs.readFile(path);

  await fs.writeFile(path, fileContent.toString().replace(oldText, newText));
};

/**
 * Copies files and directories from source to destination, and renders ejs data.
 *
 * @param source The path to copy files from.
 * @param dest The path to copy files to.
 * @param options The ejs data.
 * @param platform iOS or Android.
 * @param root
 * @return
 */
export const copyDir = async (
  source: string,
  dest: string,
  options: ejs.Data,
  platform: "ios" | "android",
  root = true
) => {
  const BINARIES = /(gradlew|\.(jar|keystore|png|jpg|gif))$/;

  await fs.mkdirp(dest);

  const files = await fs.readdir(source);

  for (const f of files) {
    if (
      fse.lstatSync(path.join(source, f)).isDirectory() &&
      f !== platform &&
      root
    ) {
      continue;
    }
    const target = path.join(
      dest,
      ejs.render(f.replace(/^\$/, ""), options, {
        openDelimiter: "{",
        closeDelimiter: "}",
      })
    );

    const file = path.join(source, f);
    const stats = await fs.stat(file);

    if (stats.isDirectory()) {
      await copyDir(file, target, options, platform, false);
    } else if (!file.match(BINARIES)) {
      const content = await fs.readFile(file, "utf8");

      await fs.writeFile(target, ejs.render(content, options));
    } else {
      await fs.copyFile(file, target);
    }
  }
};
