import * as recast from "recast";

import { fs } from "@/lib";

/**
 * Applies a visitor function to the AST of a TypeScript file.
 * @param {string} filePath - The path to the TypeScript file.
 * @param {Function} visitor - The visitor function to apply to the AST.
 * @param {Object} options - The options consumed by recast API to apply to print function.
 * @returns {Promise<void>} A Promise that resolves once the modifications are written back to the file.
 *
 * @example
 * ```typescript
 * const filePath = "/path/to/flagship-code.config.ts";
 *
 * await withTS(filePath,{
 * visitArrayExpression(path) {
 *   if (
 *     path.parentPath.value.key &&
 *     path.parentPath.value.key.name === "plugins"
 *   ) {
 *     path.value.elements.push(
 *       types.builders.literal("my-plugin")
 *     )
 *   }
 *
 *   return false;
 * },
 * });
 * ```
 */
export async function withTS(
  filePath: string,
  visitor: Parameters<typeof recast.visit>[1],
  options: recast.Options = {
    tabWidth: 2,
    quote: "single",
    trailingComma: true,
  }
): Promise<void> {
  // Parse the TypeScript file into an AST (Abstract Syntax Tree)
  const ast = recast.parse(await fs.readFile(filePath, "utf-8"));

  // Apply the visitor function to the AST
  recast.visit(ast, visitor);

  // Write the modified AST back to the file
  await fs.writeFile(filePath, recast.print(ast, options).code, "utf-8");
}
