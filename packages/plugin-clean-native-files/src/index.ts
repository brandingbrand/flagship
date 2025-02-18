import {rimraf} from 'rimraf';
import {fs, path, logger, definePlugin} from '@brandingbrand/code-cli-kit';

/**
 * A plugin that handles the removal of native 'android' and 'ios' directories from a project.
 * This plugin checks for the existence of both directories and removes them if they exist.
 * It provides clear logging to indicate the success or failure of the cleanup process.
 *
 * @remarks
 * This plugin can be used as part of your build or maintenance process to remove native
 * directories that are no longer needed or to reset the environment.
 */
export default definePlugin({
  /**
   * The main function that executes the removal of 'android' and 'ios' directories.
   * It checks for the existence of the directories and removes them accordingly,
   * logging the actions taken and throwing errors when something goes wrong.
   *
   * @param _ - Unused parameter, reserved for possible future extension.
   * @returns A Promise that resolves when the cleanup process is complete.
   *
   * @throws {Error} If there is an issue removing the directories.
   *
   * @example
   * // Usage in a build process
   * pluginEnvCleanup()
   *   .then(() => {
   *     console.log('Cleanup successful');
   *   })
   *   .catch(err => {
   *     console.error('Error during cleanup:', err);
   *   });
   */
  common: async (_): Promise<void> => {
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
          ['android', 'ios'].map(dir => rimraf(path.project.resolve(dir))),
        );

        logger.log('Successfully removed both ios and android directories');
      } catch (e: any) {
        logger.error('Failed to remove ios and android directories', e);
        throw new Error(
          `Error: unable to remove ios and android directories, ${e.message}`,
        );
      }

      return;
    }

    // Remove 'ios' directory if it exists
    if (doesIOSExist) {
      try {
        await rimraf(path.project.resolve('ios'));

        logger.log('Successfully removed ios directory');
      } catch (e: any) {
        logger.error('Failed to remove ios directory', e);
        throw new Error(`Error: unable to remove ios directory, ${e.message}`);
      }

      return;
    }

    // Remove 'android' directory if it exists
    if (doesAndroidExist) {
      try {
        await rimraf(path.project.resolve('android'));

        logger.log('Successfully removed android directory');
      } catch (e: any) {
        logger.error('Failed to remove android directory', e);
        throw new Error(
          `Error: unable to remove android directory, ${e.message}`,
        );
      }
    }
  },
});
