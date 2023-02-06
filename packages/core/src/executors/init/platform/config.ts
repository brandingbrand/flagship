import { Xcode, fs, path, rename } from "../../../utils";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";
import { addApplicationEelement } from "../../../utils/android/manifest-fp";

export const execute = (options: InitOptions, config: Config) => {
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
        const xcode = new Xcode(config);

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
            await fs.copy(source, destination);

            xcode.addFramework(destination, { customFramework: true });
          } else {
            xcode.addFramework(framework.framework, {});
          }
        }

        await xcode.build();
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

      if (config.android.manifest?.applicationElements) {
        addApplicationEelement(config.android.manifest.applicationElements);
      }
    },
  };
};
