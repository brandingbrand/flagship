import { bundleRequire, config, defineAction, withAction } from "@/lib";
import {
  PackageJson,
  canRunAndroid,
  canRunIOS,
  path,
} from "@brandingbrand/code-cli-kit";

/**
 * Executes an action for running plugins.
 * @returns {Promise<string>} A promise that resolves with a message indicating successful plugin execution.
 * @throws {Error} Throws an error if there are uninstalled plugins or if there are errors during plugin execution.
 */
export default defineAction(async () => {
  // Load the package.json file of the project.
  const pkg = require(path.project.resolve("package.json")) as PackageJson;

  // Check if the package.json file contains a devDependencies object.
  if (!pkg.devDependencies) {
    // Throw an error if devDependencies object is not found.
    throw Error(
      "[PluginsActionError]: Unable to locate devDependencies object in package.json. Please note that the absence of the devDependencies object does not allow us to verify installed plugins."
    );
  }

  // Extract the keys of the devDependencies object.
  const dependencyKeys = Object.keys(pkg.devDependencies);

  // Filter out plugins that are not listed as devDependencies.
  const uninstalledPlugins = config.code.plugins.filter(
    (it) => !dependencyKeys.includes(it)
  );

  // Check if there are uninstalled plugins.
  if (uninstalledPlugins.length) {
    // Throw an error indicating the uninstalled plugins.
    throw Error(
      `[PluginsActionError]: some of your plugins are not installed as devDependencies: ${uninstalledPlugins.map((it) => it).join(", ")}. Please install these plugins as devDependencies.`
    );
  }

  // Bundle and require all plugins listed in the config.
  const plugins = await Promise.all(
    config.code.plugins.map((it) => {
      return bundleRequire(it);
    })
  );

  // Execute iOS-specific actions for each plugin if the environment supports iOS.
  if (canRunIOS(config.options)) {
    // Iterate over the plugins and their indexes.
    for (const [index, plugin] of plugins.entries()) {
      // Skip if the plugin does not have an ios function.
      if (typeof plugin.ios !== "function") continue;

      // Get the name of the plugin or use a default name.
      const name = config.code.plugins?.[index] ?? "unknown plugin";

      // Execute the iOS action with the plugin and its name.
      await withAction(plugin.ios, name)(config.build, config.options);
    }
  }

  // Execute Android-specific actions for each plugin if the environment supports Android.
  if (canRunAndroid(config.options)) {
    // Iterate over the plugins and their indexes.
    for (const [index, plugin] of plugins.entries()) {
      // Skip if the plugin does not have an android function.
      if (typeof plugin.android !== "function") continue;

      // Get the name of the plugin or use a default name.
      const name = config.code.plugins?.[index] ?? "unknown plugin";

      // Execute the Android action with the plugin and its name.
      await withAction(plugin.android, name)(config.build, config.options);
    }
  }

  // Return a success message with the list of executed plugins.
  return `successfully ran plugins: ${config.code.plugins.map((it) => it).join(", ")}.`;
}, "plugins");
