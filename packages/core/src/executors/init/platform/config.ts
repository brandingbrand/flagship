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
