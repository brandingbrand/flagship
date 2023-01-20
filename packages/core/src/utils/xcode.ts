import xcode from "xcode";
import { XcodeProject } from "xcode";

import fs from "./fs";
import * as path from "./path";
import type { Config } from "../types/types";

export class Xcode {
  config: Config;
  project: XcodeProject;

  constructor(config: Config) {
    this.config = config;
    this.project = xcode.project(path.ios.pbxprojFilePath(this.config));
    this.project.parseSync();
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

  addToPbxGroup(name: string, group: string | undefined) {
    return this.project.addToPbxGroup(
      this.project.findPBXGroupKey({ name }) as string,
      this.project.findPBXGroupKey({ name: group }) as string
    );
  }

  addToPbxGroupBuilder(name: string, group: string | undefined) {
    this.addToPbxGroup(name, group);

    return this;
  }

  addPbxGroup(
    filePathsArray: string[],
    name: string,
    path: string,
    sourceTree?: string
  ) {
    return this.project.addPbxGroup(filePathsArray, name, path, sourceTree);
  }

  addPbxGroupBuilder(
    filePathsArray: string[],
    name: string,
    path: string,
    sourceTree?: string
  ) {
    this.addPbxGroup(filePathsArray, name, path, sourceTree);

    return this;
  }

  addBuildPhase(
    filePathsArray: unknown,
    buildPhaseType: unknown,
    comment: unknown,
    target: unknown,
    optionsOrFolderType: unknown,
    subfolderPath: unknown
  ) {
    return this.project.addBuildPhase(
      filePathsArray,
      buildPhaseType,
      comment,
      target,
      optionsOrFolderType,
      subfolderPath
    );
  }

  addBuildPhaseBuilder(
    filePathsArray: string[],
    buildPhaseType: string,
    comment: unknown,
    target: string,
    optionsOrFolderType: unknown,
    subfolderPath: unknown
  ) {
    this.addBuildPhase(
      filePathsArray,
      buildPhaseType,
      comment,
      this.project.findTargetKey(`"${target}"`),
      optionsOrFolderType,
      subfolderPath
    );

    return this;
  }

  addTarget(name: string, type: string, subfolder: string, bundleId: string) {
    return this.project.addTarget(name, type, subfolder, bundleId);
  }

  addTargetBuilder(
    name: string,
    type: string,
    subfolder: string,
    bundleId: string
  ) {
    this.addTarget(name, type, subfolder, bundleId);

    return this;
  }

  addBuildSettings(buildSettings: Record<string, unknown>, target: string) {
    Object.entries(buildSettings).forEach(([key, value]) => {
      this.project.updateBuildProperty(key, value, null, `"${target}"`);
    });
  }

  addBuildSettingsBuilder(
    buildSettings: Record<string, unknown>,
    target: string
  ) {
    this.addBuildSettings(buildSettings, target);

    return this;
  }

  async build() {
    await fs.writeFile(
      path.ios.pbxprojFilePath(this.config),
      this.project.writeSync()
    );
  }
}
