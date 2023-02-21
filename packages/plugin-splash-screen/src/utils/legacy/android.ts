import { fs, fsk, path as kpath } from "@brandingbrand/code-core";

import type { Config } from "@brandingbrand/code-core";

import type { CodePluginSplashScreen } from "../../types";

export default async (config: Config & CodePluginSplashScreen) => {
  const { path = "assets/splash-screen/android/legacy" } =
    config.codePluginSplashScreen.plugin?.android?.legacy ?? {};

  await fs.copy(kpath.config.resolve(path), kpath.android.resourcesPath(), {
    overwrite: true,
  });

  await fsk.update(
    kpath.android.mainActivityPath(config),
    /(package[\s\S]+?;)/,
    `$1
    
    import android.os.Bundle;
    import androidx.annotation.Nullable;
    `
  );

  await fsk.update(
    kpath.android.mainActivityPath(config),
    /(public class[\s\S]+?{)/,
    `$1
        @Override
        protected void onCreate(@Nullable Bundle savedInstanceState) {
          super.onCreate(savedInstanceState);
          setContentView(R.layout.splash);
        }
    `
  );
};
