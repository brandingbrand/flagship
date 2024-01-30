import fs from "fs/promises";

export async function withUTF8(filePath: string, callback: Function) {
  const content = await fs.readFile(filePath, "utf-8");

  const transformedContent = callback(content);

  await fs.writeFile(filePath, transformedContent, "utf-8");
}
