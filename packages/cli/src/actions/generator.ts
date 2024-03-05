import * as recast from "recast";
import { path, withTS } from "@brandingbrand/code-cli-kit";

import { config, defineAction } from "@/lib";

/**
 * Defines the action to handle updating the plugin generator dependencies.
 * @returns A promise representing the completion of packagers installation.
 */
export default defineAction(async (): Promise<void> => {
  const { updatePackage } = await import("write-package");

  const pluginPath = path.relative(
    path.project.resolve(),
    path.project.resolve(config.code.pluginPath, config.generateOptions.name)
  );

  await updatePackage({
    devDependencies: {
      [config.generateOptions.name]: `link:${pluginPath}`,
    },
  });

  await updatePackage(
    path.project.resolve(config.code.pluginPath, config.generateOptions.name),
    {
      name: config.generateOptions.name,
    }
  );

  await withTS(path.project.resolve("flagship-code.config.ts"), {
    visitArrayExpression(path) {
      if (
        path.parentPath.value.key &&
        path.parentPath.value.key.name === "plugins"
      ) {
        path.value.elements.push(
          recast.types.builders.literal(config.generateOptions.name)
        );
      }

      return false;
    },
  });
}, "generator");
