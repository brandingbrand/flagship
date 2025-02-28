import fse from 'fs-extra';
import * as recast from 'recast';
import {
  fs,
  path,
  logger,
  withTS,
  definePlugin,
} from '@brandingbrand/code-cli-kit';

/**
 * A plugin that handles the generation of new plugins for the platform.
 * This plugin creates the necessary directory structure, copies template files,
 * and updates relevant configuration files.
 *
 * @remarks
 * This plugin is used to scaffold new plugins with the correct structure and configuration.
 */
export default definePlugin({
  common: async (): Promise<void> => {
    const pluginName = '@brandingbrand/code-plugin-example';
    const pluginPath = path.project.resolve('./coderc/plugins');

    logger.debug(`Starting plugin generation for ${pluginName}`);

    try {
      // Copy template files
      const templatePath = path.join(
        require.resolve('@brandingbrand/code-templates/package.json'),
        '..',
        `plugin`,
      );

      await fse
        .copy(templatePath, path.resolve(pluginPath, pluginName))
        .catch(e => {
          throw new Error(
            `Error: unable to copy plugin template to ${pluginPath}, ${e.message}`,
          );
        });

      logger.info(
        `Created plugin directory for ${pluginName} at ${pluginPath}`,
      );

      // Update package.json dependencies
      await updateDependencies({}, pluginName, pluginPath);

      // Update flagship-code.config.ts to include the new plugin
      await updateConfig({}, pluginName);
    } catch (error: any) {
      logger.error('Failed to generate plugin', error);
      throw error;
    }
  },

  ios: async (): Promise<void> => {
    logger.debug('No iOS-specific configuration needed for this plugin.');
  },

  android: async (): Promise<void> => {
    logger.debug('No Android-specific configuration needed for this plugin.');
  },
});

/**
 * Updates project dependencies to include the new plugin
 */
async function updateDependencies(
  config: any,
  pluginName: string,
  pluginPath: string,
): Promise<void> {
  try {
    const {updatePackage} = await import('write-package');
    const relativePluginPath = path.relative(
      path.project.resolve(),
      pluginPath,
    );

    // Update project's package.json
    await updatePackage({
      devDependencies: {
        [pluginName]: `link:${path.join(relativePluginPath, pluginName)}`,
      },
    }).catch(e => {
      throw new Error(`Error: unable to update package.json, ${e.message}`);
    });

    // Update plugin's package.json
    await updatePackage(path.resolve(pluginPath, pluginName), {
      name: pluginName,
    }).catch(e => {
      throw new Error(
        `Error: unable to update plugin package.json, ${e.message}`,
      );
    });

    logger.info('Successfully updated package dependencies');
  } catch (error: any) {
    logger.error('Failed to update dependencies', error);
    throw error;
  }
}

/**
 * Updates the flagship-code.config.ts file to include the new plugin
 */
async function updateConfig(config: any, pluginName: string): Promise<void> {
  try {
    await withTS(path.project.resolve('flagship-code.config.ts'), {
      visitArrayExpression(path) {
        if (
          path.parentPath.value.key &&
          path.parentPath.value.key.name === 'plugins'
        ) {
          path.value.elements.push(recast.types.builders.literal(pluginName));
          return false;
        }
        this.traverse(path);
      },
    }).catch(e => {
      throw new Error(
        `Error: unable to update flagship-code.config.ts with new plugin, ${e.message}`,
      );
    });

    logger.info('Successfully updated flagship-code.config.ts');
  } catch (error: any) {
    logger.error('Failed to update config file', error);
    throw error;
  }
}
