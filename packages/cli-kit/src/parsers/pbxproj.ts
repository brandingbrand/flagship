import fs from "fs/promises";
import xcode, { type XcodeProject } from "xcode";

import { paths } from "@/lib";

export async function withPbxproj(
  callback: (pbxproj: XcodeProject) => Promise<void>
) {
  const project = xcode.project(paths.ios.projectPbxProj());
  project.parseSync();

  callback(project);

  await fs.writeFile(paths.ios.projectPbxProj(), project.writeSync());
}
