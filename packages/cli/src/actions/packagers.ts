import { isCI } from "ci-info";
import { canRunAndroid, canRunIOS, path } from "@brandingbrand/code-cli-kit";

import { config, defineAction } from "@/lib";

/**
 * Defines the action to handle packagers installation based on platform availability and CI environment.
 * @returns A promise representing the completion of packagers installation.
 */
export default defineAction(async (): Promise<void> => {
  /**
   * Imports the execa esm library dynamically.
   */
  const { execa } = await import("execa");

  /**
   * Handles packagers installation for Android if running in a CI environment and Android is supported.
   */
  if (isCI && canRunAndroid(config.options)) {
    try {
      await execa("bundle", ["install"], {
        cwd: path.project.resolve("android"),
      });
    } catch (e: any) {
      throw Error(
        `[PackagersActionError]: failed to run "bundle install" for Android: ${e.message}`
      );
    }
  }

  /**
   * Handles packagers installation for iOS if running in a CI environment and iOS is supported.
   */
  if (isCI && canRunIOS(config.options)) {
    try {
      await execa("bundle", ["install"], {
        cwd: path.project.resolve("ios"),
      });
    } catch (e: any) {
      throw Error(
        `[PackagersActionError]: failed to run "bundle install" for iOS: ${e.message}`
      );
    }
  }

  /**
   * Handles pod installation for iOS if iOS is supported.
   */
  if (canRunIOS(config.options)) {
    try {
      await execa("pod", ["install"], {
        cwd: path.project.resolve("ios"),
      });
    } catch (e: any) {
      throw Error(
        `[PackagersActionError]: failed to run "pod install" for iOS: ${e.message}`
      );
    }
  }
}, "packagers");
