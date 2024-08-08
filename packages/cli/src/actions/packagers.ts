import {isCI} from 'ci-info';
import {detect} from 'detect-package-manager';
import {
  canRunAndroid,
  canRunIOS,
  logger,
  path,
} from '@brandingbrand/code-cli-kit';

import {config, defineAction, isGenerateCommand} from '@/lib';

/**
 * Defines the action to handle packagers installation based on platform availability and CI environment.
 * @returns A promise representing the completion of packagers installation.
 */
export default defineAction(async (): Promise<void> => {
  /**
   * Imports the execa esm library dynamically.
   */
  const {execa} = await import('execa');

  /**
   * Executes package installation if the generate command is configured.
   * WARNING: Consider moving this in the furture
   * @throws {Error} Throws an error if the package installation fails.
   */
  if (isGenerateCommand()) {
    try {
      const packageManager = await detect(); // Detect the package manager

      for await (const line of execa({
        cwd: path.project.resolve(
          config.code.pluginPath,
          config.generateOptions.name,
        ),
      })`${packageManager}`) {
        logger.debug(line);
      }

      logger.log(
        `installed node packages for ${config.generateOptions.name} plugin`,
      );

      // Execute package installation using the detected package manager
      await execa(packageManager, {cwd: path.project.resolve()});

      logger.log(`installed node packages for your React Native project`);
    } catch (e: any) {
      // Throw an error if package installation fails
      throw Error(`Error: failed to install node dependencies: ${e.message}`);
    }

    return; // Return if package installation is successful
  }

  /**
   * Handles packagers installation for Android if running in a CI environment and Android is supported.
   */
  if (isCI && canRunAndroid(config.options)) {
    try {
      for await (const line of execa({
        cwd: path.project.resolve('android'),
      })`bundle install`) {
        logger.debug(line);
      }

      logger.log(`installed ruby gems for android project`);
    } catch (e: any) {
      throw Error(
        `Error: failed to run "bundle install" for Android: ${e.message}`,
      );
    }
  }

  /**
   * Handles packagers installation for iOS if running in a CI environment and iOS is supported.
   */
  if (isCI && canRunIOS(config.options)) {
    try {
      for await (const line of execa({
        cwd: path.project.resolve('ios'),
      })`bundle install`) {
        logger.debug(line);
      }

      logger.log(`installed ruby gems for ios project`);
    } catch (e: any) {
      throw Error(
        `Error: failed to run "bundle install" for iOS: ${e.message}`,
      );
    }
  }

  /**
   * Handles pod installation for iOS if iOS is supported.
   */
  if (canRunIOS(config.options)) {
    try {
      for await (const line of execa({
        cwd: path.project.resolve('ios'),
      })`pod install`) {
        logger.debug(line);
      }

      logger.log(`installed pods for ios project`);
    } catch (e: any) {
      throw Error(`Error: failed to run "pod install" for iOS: ${e.message}`);
    }
  }
});
