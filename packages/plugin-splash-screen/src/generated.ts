import {
  BuildConfig,
  fs,
  path,
  string,
  withUTF8,
} from "@brandingbrand/code-cli-kit";

import type { CodePluginSplashCreen } from "./types";

/**
 * Generates iOS splash screen using provided configuration.
 * @param config The build configuration including splash screen settings.
 */
export async function ios(config: BuildConfig & CodePluginSplashCreen) {
  // Extract logoPath and background color from the iOS splash screen configuration
  const { logoPath, backgroundColor: background } =
    // @ts-ignore
    config.codePluginSplashScreen.plugin.ios.generated;

  // Resolve the input file path
  const inputFile = path.project.resolve(logoPath);

  // Require the generate function from react-native-bootsplash
  const { generate } = require(
    require.resolve("react-native-bootsplash/dist/commonjs/generate.js", {
      paths: [process.cwd()],
    })
  );

  // Generate iOS splash screen using the specified configuration
  await generate({
    ios: { projectPath: path.project.resolve("ios", "app") },
    android: null,
    workingPath: path.project.resolve(),
    logoPath: inputFile,
    background,
    logoWidth: 212,
    platforms: ["ios"],
  });

  // Rename the generated BootSplash.storyboard file to LaunchScreen.storyboard
  await fs.rename(
    path.project.resolve("ios", "app", "BootSplash.storyboard"),
    path.project.resolve("ios", "app", "LaunchScreen.storyboard")
  );
}

/**
 * Generates Android splash screen using provided configuration.
 * @param config The build configuration including splash screen settings.
 */
export async function android(config: BuildConfig & CodePluginSplashCreen) {
  // Extract logoPath and background color from the Android splash screen configuration
  const { logoPath, backgroundColor: background } =
    // @ts-ignore
    config.codePluginSplashScreen.plugin.android.generated;

  // Resolve the input file path
  const inputFile = path.project.resolve(logoPath);

  // Require the generate function from react-native-bootsplash
  const { generate } = require(
    require.resolve("react-native-bootsplash/dist/commonjs/generate.js", {
      paths: [process.cwd()],
    })
  );

  // Generate Android splash screen using the specified configuration
  await generate({
    ios: null,
    android: { sourceDir: path.project.resolve("android", "app") },
    flavor: "main",
    workingPath: path.project.resolve(),
    logoPath: inputFile,
    background,
    logoWidth: 180,
  });

  // Create the necessary directory structure for the Android splash screen layout
  await fs.mkdir(
    path.project.resolve("android", "src", "main", "res", "layout"),
    {
      recursive: true,
    }
  );

  // Write the splash.xml layout file for Android splash screen
  await fs.writeFile(
    path.project.resolve(
      "android",
      "src",
      "main",
      "res",
      "layout",
      "splash.xml"
    ),
    `<?xml version="1.0" encoding="utf-8"?>
    <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:gravity="center_horizontal|center_vertical"
        android:background="${background}">
        <ImageView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:background="@mipmap/bootsplash_logo"
            />
    </LinearLayout>
    `
  );

  // Update the main activity file to set the splash screen layout
  await withUTF8(path.android.mainActivity(config), (content) => {
    // Add package imports to the main activity
    content = string.replace(
      content,
      /(package[\s\S]+?;)/,
      `$1
    
    import android.os.Bundle;
    import androidx.annotation.Nullable;
    `
    );

    // Add onCreate method to the main activity to set the splash screen layout
    content = string.replace(
      content,
      /(public class[\s\S]+?{)/,
      `$1
      @Override
        protected void onCreate(@Nullable Bundle savedInstanceState) {
          super.onCreate(savedInstanceState);
          setContentView(R.layout.splash);
        }
    `
    );

    return content;
  });
}
