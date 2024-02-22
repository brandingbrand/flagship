import { isCI } from "ci-info";
import { detect } from "detect-package-manager";
import { canRunAndroid, canRunIOS, path } from "@brandingbrand/code-cli-kit";

import { config, defineAction, isGenerateCommand } from "@/lib";

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
   * Executes package installation if the generate command is configured.
   * WARNING: Consider moving this in the furture
   * @throws {Error} Throws an error if the package installation fails.
   */
  if (isGenerateCommand()) {
    try {
      const packageManager = await detect(); // Detect the package manager

      // Execute package installation using the detected package manager
      await execa(packageManager, { cwd: path.project.resolve() });
    } catch (e: any) {
      // Throw an error if package installation fails
      throw Error(`[PackagersActionError]: failed to install dependencies`);
    }

    return; // Return if package installation is successful
  }

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
