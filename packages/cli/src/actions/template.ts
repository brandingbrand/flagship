import fse from 'fs-extra';
import {
  fs,
  canRunAndroid,
  canRunIOS,
  logger,
  path,
  globAndReplace,
  getReactNativeVersion,
} from '@brandingbrand/code-cli-kit';

import {config, defineAction, isGenerateCommand} from '@/lib';

/**
 * Define an action to initialize a project template.
 * @remarks
 * This action copies template files for iOS and Android platforms to the project directory based on the provided configuration options.
 * It requires the 'fs-extra' package for file system operations and uses utility functions from '@brandingbrand/code-cli-kit' for platform checks and path manipulation.
 * @returns {Promise<void>} - Promise that resolves when the action completes successfully.
 * @throws {Error} - Throws an error if there's an issue with creating directories or copying template files.
 */
export default defineAction(async () => {
  const reactNativeVersion = getReactNativeVersion();
  // Get the path to the template directory of the '@brandingbrand/code-cli' package
  const templatePath = path.join(
    require.resolve('@brandingbrand/code-cli/package.json'),
    '..',
    'templates',
    `react-native-${reactNativeVersion}`,
  );

  // If the generate cli command was executed copy the plugin template only
  // WARNING: Consider moving this in future.
  if (isGenerateCommand()) {
    const pluginPath = path.project.resolve(
      config.code.pluginPath,
      config.generateOptions.name,
    );

    await fs.mkdir(pluginPath).catch(e => {
      throw Error(
        `Error: unable to create directory ${pluginPath}, ${e.message}`,
      );
    });
    await fse
      .copy(
        path.resolve(templatePath, '..', 'flagship-code-plugin'),
        pluginPath,
      )
      .catch(e => {
        throw Error(
          `Error: unable to copy plugin template to ${pluginPath}, ${e.message}`,
        );
      });

    logger.log(
      `created plugin directory for ${config.generateOptions.name} at ${pluginPath}`,
    );

    // WARNING: this is meant to short-circuit the rest of the action as
    // the rest of the action is for prebuild.
    return;
  }

  // Check if the configuration allows running for iOS platform
  if (canRunIOS(config.options)) {
    // Create directories for iOS platform
    await fse.mkdir(path.project.resolve('ios')).catch(e => {
      throw Error(
        `Error: unable to create ios directory in project root ${path.project.resolve()}, ${e.message}`,
      );
    });

    // Copy over iOS template to ios directory
    await fse
      .copy(path.resolve(templatePath, 'ios'), path.project.resolve('ios'))
      .catch(e => {
        throw Error(
          `Error: unable to copy ios template to ios directory in project root ${path.project.resolve('ios')}, ${e.message}`,
        );
      });

    logger.log('created ios project');
  }

  // Check if the configuration allows running for Android platform
  if (canRunAndroid(config.options)) {
    // Create directories for Android platform
    await fse.mkdir(path.project.resolve('android')).catch(e => {
      throw Error(
        `Error: unable to create android directory in project root ${path.project.resolve()}, ${e.message}`,
      );
    });

    // Copy template files for Android platform to the project directory
    await fse
      .copy(
        path.resolve(templatePath, 'android'),
        path.project.resolve('android'),
      )
      .catch(e => {
        throw Error(
          `Error: unable to copy ios template to android directory in project root ${path.project.resolve('android')}, ${e.message}`,
        );
      });

    logger.log('created android project');

    // Check if signing object is available
    if (config.build.android.signing) {
      // Copy keystore file to release.keystore in app module
      await fse
        .copyFile(
          path.project.resolve(config.build.android.signing.storeFile),
          path.project.resolve('android', 'app', 'release.keystore'),
        )
        .catch(e => {
          throw Error(
            `Error: unable to copy keystore to ${path.project.resolve('android', 'app', 'release.keystore')}, ${e.message}`,
          );
        });

      logger.log('added release.keystore to android project');
    }
  }

  // Copy extra template files to the project directory based on platform availability
  await fse
    .copy(path.resolve(templatePath, 'addons'), path.project.resolve(), {
      filter: function (path) {
        // Filter out Android files if Android platform is not enabled
        if (!canRunAndroid(config.options) && path.indexOf('android') > -1) {
          return false;
        }

        // Filter out iOS files if iOS platform is not enabled
        if (!canRunIOS(config.options) && path.indexOf('ios') > -1) {
          return false;
        }

        return true;
      },
    })
    .catch(e => {
      throw Error(
        `Error: unable to copy additional template files native directories, ${e.message}`,
      );
    });

  if (canRunAndroid(config.options)) {
    // Rename android package namespace to updated package name for both debug and main packages
    await Promise.all(
      ['debug', 'main', 'release'].map(it =>
        fs.renameAndCopyDirectory(
          'com.app',
          config.build.android.packageName,
          path.project.resolve('android', 'app', 'src', it, 'java'),
        ),
      ),
    ).catch(e => {
      throw Error(
        `Error: unable to rename android directories to updated package name, ${e.message}`,
      );
    });

    // Replace package namespace in Java files for debug, main, and release builds
    await globAndReplace(
      'android/**/{debug,main,release}/**/*.{java,kt}',
      /package\s+com\.app/,
      `package ${config.build.android.packageName};`,
    ).catch(e => {
      throw Error(
        `Error: unable to to update package names in native android files, ${e.message}`,
      );
    });
  }
});
