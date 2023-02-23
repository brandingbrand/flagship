import { fs, fsk, path } from "@brandingbrand/code-core";

import type { Config } from "@brandingbrand/code-core";

import type { CodePluginSplashScreen } from "../../types";

export default async (config: Config & CodePluginSplashScreen) => {
  const {
    logoPath = "./assets/splash-screen/android/generated/logo.png",
    size = 180,
    backgroundColor = "#333132",
  } = config.codePluginSplashScreen?.plugin?.android?.generated ?? {};

  const inputFile = path.config.resolve(logoPath);
  const { generate } = require(path.project.resolve(
    "node_modules",
    "react-native-bootsplash",
    "dist",
    "commonjs",
    "generate.js"
  ));

  await generate({
    ios: null,
    android: { sourceDir: path.project.resolve("android", "app") },
    flavor: "main",
    workingPath: path.project.path(),
    logoPath: inputFile,
    assetsPath: null,
    backgroundColor,
    logoWidth: size,
  });

  await fs.mkdirp(path.project.resolve(path.android.resourcesPath(), "layout"));
  await fs.writeFile(
    path.project.resolve(path.android.resourcesPath(), "layout", "splash.xml"),
    `<?xml version="1.0" encoding="utf-8"?>
    <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:gravity="center_horizontal|center_vertical"
        android:background="${backgroundColor}">
        <ImageView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:background="@mipmap/bootsplash_logo"
            />
    </LinearLayout>
    `
  );

  await fsk.update(
    path.android.mainActivityPath(config),
    /(package[\s\S]+?;)/,
    `$1
    
    import android.os.Bundle;
    import androidx.annotation.Nullable;
    `
  );

  await fsk.update(
    path.android.mainActivityPath(config),
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
