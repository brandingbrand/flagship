import xcode from "xcode";

import type { Config } from "../../../types";
import { fs, path, rename } from "../../../utils";

export const execute = (options: any, config: Config) => {
  return {
    ios: async () => {
      if (config.ios.entitlementsFilePath) {
        await fs.copyFile(
          path.config.resolve(config.ios.entitlementsFilePath),
          path.project.resolve(
            "ios",
            config.ios.name,
            `${config.ios.name}.entitlements`
          )
        );
      }

      if (config.ios.frameworks) {
        const projectPath = path.ios.pbxprojFilePath(config);
        const project = xcode.project(projectPath);
        project.parseSync();

        for (const framework of config.ios.frameworks) {
          if (framework.path) {
            const source = path.config.resolve(
              framework.path,
              framework.framework
            );
            const destination = path.resolve(
              path.ios.nativeProjectPath(config),
              framework.framework
            );
            fs.copySync(source, destination);

            project.addFramework(destination, { customFramework: true });
          } else {
            project.addFramework(framework.framework, {});
          }
        }

        await fs.writeFile(projectPath, project.writeSync());
      }
    },
    android: async () => {
      await rename.pkgDirectory(
        "com.helloworld",
        config.android.packageName,
        path.android.mainPath(),
        "java"
      );
      await rename.pkgDirectory(
        "com.helloworld",
        config.android.packageName,
        path.android.debugPath(),
        "java"
      );
    },
  };
};
