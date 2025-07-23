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
   * Function that handles removal of iOS directory
   */
  ios: async (_): Promise<void> => {
    logger.debug('Checking for iOS directory existence...');
    // Check if the 'ios' directory exists
    const doesIOSExist = await fs.doesPathExist(path.project.resolve('ios'));

    if (doesIOSExist) {
      logger.info('iOS directory found, proceeding with removal');
      try {
        await rimraf(path.project.resolve('ios'));
        logger.info('Successfully removed iOS directory');
      } catch (e: any) {
        logger.error('Failed to remove iOS directory', e);
        throw new Error(`Error: unable to remove iOS directory, ${e.message}`);
      }
    } else {
      logger.debug('iOS directory not found, skipping removal');
    }
  },

  /**
   * Function that handles removal of Android directory
   */
  android: async (_): Promise<void> => {
    logger.debug('Checking for Android directory existence...');
    // Check if the 'android' directory exists
    const doesAndroidExist = await fs.doesPathExist(
      path.project.resolve('android'),
    );

    if (doesAndroidExist) {
      logger.info('Android directory found, proceeding with removal');
      try {
        await rimraf(path.project.resolve('android'));
        logger.info('Successfully removed Android directory');
      } catch (e: any) {
        logger.error('Failed to remove Android directory', e);
        throw new Error(
          `Error: unable to remove Android directory, ${e.message}`,
        );
      }
    } else {
      logger.debug('Android directory not found, skipping removal');
    }
  },
});
