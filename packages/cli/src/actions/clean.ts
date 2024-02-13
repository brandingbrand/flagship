import { rimraf } from "rimraf";
import { fs, path } from "@brandingbrand/code-cli-kit";

import { defineAction } from "@/lib";

/**
 * Defines an action to clean native directories.
 *
 * @returns {Promise<string>} A Promise that resolves with a message indicating the result of the cleaning process.
 */
export default defineAction(async () => {
  // Check if the 'android' directory exists
  const doesAndroidExist = await fs.doesPathExist(
    path.project.resolve("android")
  );

  // Check if the 'ios' directory exists
  const doesIOSExist = await fs.doesPathExist(path.project.resolve("ios"));

  if (doesAndroidExist && doesIOSExist) {
    // Remove both 'android' and 'ios' directories if they exist
    try {
      await Promise.all(
        ["android", "ios"].map((it) => {
          return rimraf(path.project.resolve(it));
        })
      );
    } catch (e: any) {
      throw Error(
        `[CleanActionError]: unable to remove ios and android directories, ${e.message}`
      );
    }

    // Return a success message
    return "removed ios and android native directories";
  }

  if (doesIOSExist) {
    // Remove 'ios' directory if it exists
    try {
      await rimraf(path.project.resolve("ios"));
    } catch (e: any) {
      throw Error(
        `[CleanActionError]: unable to remove ios directory, ${e.message}`
      );
    }

    // Return a success message
    return "removed ios native directory, android does not exist";
  }

  if (doesAndroidExist) {
    // Remove 'android' directory if it exists
    try {
      await rimraf(path.project.resolve("android"));
    } catch (e: any) {
      throw Error(
        `[CleanActionError]: unable to remove android directory, ${e.message}`
      );
    }

    // Return a success message
    return "removed android native directory, ios does not exist";
  }

  // Return a message indicating that no directories were removed
  return "did not remove any native directories, ios and android directories do not exist";
}, "clean");
