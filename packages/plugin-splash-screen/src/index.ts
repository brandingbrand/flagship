import { Config, fs, fsk, path } from "@brandingbrand/kernel-core";

const ios = async (config: Config) => {
  const { iosSize = 212, backgroundColor = "#333132" } = {};

  const inputFile = path.project.resolve(
    path.config.assetsPath(),
    "splash-screen",
    "logo.png"
  );
  const { generate } = require(path.project.resolve(
    "node_modules",
    "react-native-bootsplash",
    "dist",
    "commonjs",
    "generate.js"
  ));

  await generate({
    ios: { projectPath: path.project.resolve("ios", config.ios.name) },
    android: null,
    workingPath: path.project.path(),
    logoPath: inputFile,
    assetsPath: null,
    backgroundColor,
    logoWidth: iosSize,
  });

  await fs.move(
    path.project.resolve("ios", config.ios.name, "BootSplash.storyboard"),
    path.project.resolve("ios", config.ios.name, "LaunchScreen.storyboard"),
    { overwrite: true }
  );
};

const android = async (config: Config) => {
  const { androidSize = 180, backgroundColor = "#333132" } = {};

  const inputFile = path.project.resolve(
    path.config.assetsPath(),
    "splash-screen",
    "logo.png"
  );
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
    logoWidth: androidSize,
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

export { ios, android };
