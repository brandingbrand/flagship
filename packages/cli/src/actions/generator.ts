import * as recast from "recast";
import { path, withTS } from "@brandingbrand/code-cli-kit";

import { config, defineAction } from "@/lib";

/**
 * Defines the action to handle updating the plugin generator dependencies.
 * @returns {Promise<void>} A promise representing the completion of packagers installation.
 */
export default defineAction(async (): Promise<void> => {
  // Dynamically import the function from the package
  const { updatePackage } = await import("write-package");

  // Get the relative path to the plugin
  const pluginPath = path.relative(
    path.project.resolve(),
    path.project.resolve(config.code.pluginPath, config.generateOptions.name)
  );

  // Update devDependencies in package.json to point to the local plugin
  await updatePackage({
    devDependencies: {
      [config.generateOptions.name]: `link:${pluginPath}`,
    },
  });

  // Update package.json in the plugin directory with its name
  await updatePackage(
    path.project.resolve(config.code.pluginPath, config.generateOptions.name),
    {
      name: config.generateOptions.name,
    }
  );

  // Update flagship-code.config.ts with the new plugin
  await withTS(path.project.resolve("flagship-code.config.ts"), {
    visitArrayExpression(path) {
      if (
        path.parentPath.value.key &&
        path.parentPath.value.key.name === "plugins"
      ) {
        // Add the plugin name to the plugins array
        path.value.elements.push(
          recast.types.builders.literal(config.generateOptions.name)
        );

        // Stop the traversal since we've found what we needed
        return false;
      }

      // Continue traversal since we've not found what we needed
      this.traverse(path);
    },
  });
}, "generator");
