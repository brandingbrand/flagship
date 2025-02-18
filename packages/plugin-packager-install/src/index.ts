import {
  canRunAndroid,
  canRunIOS,
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
  /**
   * The main function that executes the package installation process for iOS and Android platforms.
   * @returns A Promise representing the completion of the package installation process.
   */
  common: async (_, options: PrebuildOptions): Promise<void> => {
    // Dynamically import the execa library for running shell commands
    const {execa} = await import('execa');

    const runBundleInstall = async (platform: string, cwd: string) => {
      try {
        for await (const line of execa('bundle', ['exec', 'install'], {cwd})) {
          logger.debug(line);
        }
        logger.log(`Installed Ruby gems for the ${platform} project`);
      } catch (error: any) {
        throw new Error(
          `Error: failed to run "bundle exec install" for ${platform}: ${error.message}`,
        );
      }
    };

    if (canRunAndroid(options)) {
      await runBundleInstall('Android', path.project.resolve('android'));
    }

    if (canRunIOS(options)) {
      await runBundleInstall('iOS', path.project.resolve('ios'));

      try {
        const podInstallOut = execa('bundle', ['exec', 'pod', 'install'], {
          cwd: path.project.resolve('ios'),
        });

        for await (const line of podInstallOut) {
          logger.debug(line);
        }

        logger.log('Installed pods for the iOS project');
      } catch (error: any) {
        throw new Error(
          `Error: failed to run "bundle exec pod install" for iOS: ${error.message}`,
        );
      }
    }
  },
});
