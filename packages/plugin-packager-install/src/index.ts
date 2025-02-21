import {
  logger,
  path,
  definePlugin,
  PrebuildOptions,
} from '@brandingbrand/code-cli-kit';

/**
 * A plugin that handles package installation for React Native projects,
 * ensuring dependencies for both iOS and Android are installed.
 * Always installs gems and uses `bundle exec` for Ruby dependencies.
 */
export default definePlugin({
  ios: async (_, options: PrebuildOptions): Promise<void> => {
    const {execa} = await import('execa');

    try {
      logger.info('Installing Ruby gems for iOS project...');
      for await (const line of execa('bundle', ['install'], {
        cwd: path.project.resolve('ios'),
      })) {
        logger.debug(line);
      }
      logger.info('Successfully installed Ruby gems for the iOS project');
    } catch (error: any) {
      logger.error('Failed to install Ruby gems for iOS');
      throw new Error(
        `Error: failed to run "bundle exec install" for iOS: ${error.message}`,
      );
    }

    try {
      logger.info('Installing pods for iOS project...');
      const podInstallOut = execa('bundle', ['exec', 'pod', 'install'], {
        cwd: path.project.resolve('ios'),
      });

      for await (const line of podInstallOut) {
        logger.debug(line);
      }

      logger.info('Successfully installed pods for the iOS project');
    } catch (error: any) {
      logger.error('Failed to install pods for iOS');
      throw new Error(
        `Error: failed to run "bundle exec pod install" for iOS: ${error.message}`,
      );
    }
  },

  android: async (_, options: PrebuildOptions): Promise<void> => {
    const {execa} = await import('execa');

    try {
      logger.info('Installing Ruby gems for Android project...');
      for await (const line of execa('bundle', ['install'], {
        cwd: path.project.resolve('android'),
      })) {
        logger.debug(line);
      }
      logger.info('Successfully installed Ruby gems for the Android project');
    } catch (error: any) {
      logger.error('Failed to install Ruby gems for Android');
      throw new Error(
        `Error: failed to run "bundle exec install" for Android: ${error.message}`,
      );
    }
  },
});
