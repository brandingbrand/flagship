import { fs, path, string, withUTF8 } from "@brandingbrand/code-cli-kit";

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

  await withUTF8(path.project.resolve("flagship-code.config.ts"), (content) => {
    return string.replace(
      content,
      /(plugins:.*\[[\s\S]*)(])/m,
      `$1  '${config.generateOptions.name}',
  $2`
    );
  });
}, "generator");
