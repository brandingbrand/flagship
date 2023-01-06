import xcode from "xcode";
import type { XCodeproject } from "xcode";

import fs from "./fs";
import * as path from "./path";
import type { Config } from "../types/types";

export class Xcode {
  config: Config;
  project: XCodeproject;

  constructor(config: Config) {
    this.config = config;
    this.project = xcode
      .project(path.ios.pbxprojFilePath(this.config))
      .parseSync();
  }

  getGroup(group: string): string {
    return (
      Object.entries(this.project.hash.project.objects.PBXGroup)?.find(
        ([, value]) => value.name === group
      )?.[0] ?? ""
    );
  }

  getTarget(target: string): string {
    return (
      Object.entries(this.project.hash.project.objects.PBXNativeTarget).find(
        ([, value]) => value.name === target
      )?.[0] ?? ""
    );
  }

  addResourceFile(path: string, group: string, target: string) {
    return this.project.addResourceFile(
      path,
      { target: this.getTarget(target) },
      this.getGroup(group)
    );
  }

  addResourceFileBuilder(path: string, group: string, target: string) {
    this.addResourceFile(path, group, target);

    return this;
  }

  addFramework(path: string, opts = {}) {
    return this.project.addFramework(path, opts);
  }

  addFrameworkBuilder(path: string, opts = {}) {
    this.addFramework(path, opts);

    return this;
  }

  async build() {
    await fs.writeFile(
      path.ios.pbxprojFilePath(this.config),
      this.project.writeSync()
    );
  }
}
