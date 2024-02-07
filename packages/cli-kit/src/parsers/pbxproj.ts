import fs from "fs/promises";
import xcode, { XcodeProject } from "xcode";

import { path } from "@/lib";

/**
 * Reads an Xcode project file, applies a callback function to the parsed Xcode project,
 * and writes the updated project back to the same file.
 *
 * @param {Function} callback - The callback function applied to the Xcode project.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 *
 * @example
 * ```typescript
 * await withPbxproj(async (project) => {
 *   // Modify the Xcode project using the provided 'project' instance
 *   project.addTarget(...);
 * });
 * ```
 */
export async function withPbxproj(
  callback: (pbxproj: XcodeProject) => void
): Promise<void> {
  /**
   * Creates an Xcode project instance by parsing the content of the project file.
   *
   * @returns {XcodeProject} An instance of the parsed Xcode project.
   */
  const project = xcode.project(path.ios.projectPbxProj);
  project.parseSync();

  /**
   * Applies the callback function to the parsed Xcode project.
   *
   * @param {XcodeProject} project - The Xcode project instance.
   * @returns {Promise<void>} A Promise that resolves once the callback operation is complete.
   */
  callback(project);

  /**
   * Writes the updated Xcode project back to the project file.
   *
   * @returns {Promise<void>} A Promise that resolves once the write operation is complete.
   */
  await fs.writeFile(path.ios.projectPbxProj, project.writeSync());
}
