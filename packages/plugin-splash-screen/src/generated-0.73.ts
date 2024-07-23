import {
  BuildConfig,
  fs,
  path,
  string,
  withUTF8,
} from '@brandingbrand/code-cli-kit';

import type {CodePluginSplashScreen} from './types';

/**
 * Generates Android splash screen using provided configuration.
 * @param config The build configuration including splash screen settings.
 */
export async function android(config: BuildConfig & CodePluginSplashScreen) {
  if (config.codePluginSplashScreen.plugin.android?.type !== 'generated') {
    throw Error(
      "[CodePluginSplashScreen]: generated was inadvertently executed with the incorrect config - 'type' must be 'generated'",
    );
  }

  // Extract logoPath and background color from the Android splash screen configuration
  const {logoPath, backgroundColor: background} =
    config.codePluginSplashScreen.plugin.android.generated;

  // Resolve the input file path
  const inputFile = path.project.resolve(logoPath);

  // Require the generate function from react-native-bootsplash
  const {generate} = require(
    require.resolve('react-native-bootsplash/dist/commonjs/generate.js', {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      ...(!process.env.JEST_WORKER_ID && {paths: [process.cwd()]}),
    }),
  );

  // Generate Android splash screen using the specified configuration
  await generate({
    flavor: 'main',
    logo: inputFile,
    background,
    logoWidth: 180,
    assetsOutput: null,
    platforms: ['android'],
    android: {
      sourceDir: path.project.resolve('android'),
      appName: 'app',
    },
  });

  // Create the necessary directory structure for the Android splash screen layout
  await fs.mkdir(
    path.project.resolve('android', 'app', 'src', 'main', 'res', 'layout'),
    {
      recursive: true,
    },
  );

  // Write the splash.xml layout file for Android splash screen
  await fs.writeFile(
    path.project.resolve(
      'android',
      'app',
      'src',
      'main',
      'res',
      'layout',
      'splash.xml',
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
        android:background="@drawable/bootsplash_logo"
    />
</LinearLayout>
`,
  );

  // Update the main activity file to set the splash screen layout
  await withUTF8(path.android.mainActivity(config), content => {
    // Add package imports to the main activity
    content = string.replace(
      content,
      /(package.*)/m,
      `$1
    
import android.os.Bundle;
    `,
    );

    // Add onCreate method to the main activity to set the splash screen layout
    content = string.replace(
      content,
      /(class.*)/m,
      `$1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.splash)
    }
`,
    );

    return content;
  });
}
