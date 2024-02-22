import type { PackageJson } from "type-fest";
import { canRunAndroid, canRunIOS, path } from "@brandingbrand/code-cli-kit";

import { bundleRequire, config, defineAction, withAction } from "@/lib";

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
    throw Error(
      `[PluginsActionError]: some of your plugins are not installed as devDependencies: ${uninstalledPlugins.map((it) => it).join(", ")}. Please install these plugins as devDependencies.`
    );
  }

  // Bundle and require all plugins listed in the config.
  const plugins = await Promise.all(
    config.code.plugins.map(async (it) => {
      const plugin = await bundleRequire(it);

      return plugin.default;
    })
  );

  // Execute iOS-specific actions for each plugin if the environment supports iOS.
  if (canRunIOS(config.options)) {
    for (const [index, plugin] of plugins.entries()) {
      // Skip if the plugin does not have an ios function.
      if (typeof plugin.ios !== "function") continue;

      const name = config.code.plugins?.[index] ?? "unknown plugin";

      // Execute the iOS action with the plugin and its name.
      await withAction(plugin.ios, `${name} - ios`)(
        config.build,
        config.options
      );
    }
  }

  // Execute Android-specific actions for each plugin if the environment supports Android.
  if (canRunAndroid(config.options)) {
    for (const [index, plugin] of plugins.entries()) {
      // Skip if the plugin does not have an android function.
      if (typeof plugin.android !== "function") continue;

      const name = config.code.plugins?.[index] ?? "unknown plugin";

      // Execute the Android action with the plugin and its name.
      await withAction(plugin.android, `${name} - android`)(
        config.build,
        config.options
      );
    }
  }

  // Return a success message with the list of executed plugins.
  return `successfully ran plugins: ${config.code.plugins.map((it) => it).join(", ")}.`;
}, "plugins");
