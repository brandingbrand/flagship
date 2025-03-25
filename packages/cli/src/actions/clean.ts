import {rimraf} from 'rimraf';
import {fs, path, logger} from '@brandingbrand/code-cli-kit';

import {defineAction} from '@/lib';

/**
 * Defines an action to clean native directories.
 *
 * @returns {Promise<string>} A Promise that resolves with a message indicating the result of the cleaning process.
 */
export default defineAction(async () => {
  // Check if the 'android' directory exists
  const doesAndroidExist = await fs.doesPathExist(
    path.project.resolve('android'),
  );

  // Check if the 'ios' directory exists
  const doesIOSExist = await fs.doesPathExist(path.project.resolve('ios'));

  if (doesAndroidExist && doesIOSExist) {
    // Remove both 'android' and 'ios' directories if they exist
    try {
      await Promise.all(
        ['android', 'ios'].map(it => {
          return rimraf(path.project.resolve(it));
        }),
      );

      logger.log('removed ios and android directories');
    } catch (e: any) {
      throw Error(
        `Error: unable to remove ios and android directories, ${e.message}`,
      );
    }

    return;
  }

  if (doesIOSExist) {
    // Remove 'ios' directory if it exists
    try {
      await rimraf(path.project.resolve('ios'));

      logger.log('removed ios directory');
    } catch (e: any) {
      throw Error(`Error: unable to remove ios directory, ${e.message}`);
    }

    return;
  }

  if (doesAndroidExist) {
    // Remove 'android' directory if it exists
    try {
      await rimraf(path.project.resolve('android'));

      logger.log('removed android directory');
    } catch (e: any) {
      throw Error(`Error: unable to remove android directory, ${e.message}`);
    }
  }
});
