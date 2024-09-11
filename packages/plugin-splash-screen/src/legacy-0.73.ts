import fse from 'fs-extra';
import {BuildConfig, path, withUTF8, string} from '@brandingbrand/code-cli-kit';

import type {CodePluginSplashScreen} from './types';

/**
 * Generates Android splash screen using provided configuration.
 * @param config The build configuration including splash screen settings.
 */
export async function android(config: BuildConfig & CodePluginSplashScreen) {
  if (config.codePluginSplashScreen.plugin.android?.type !== 'legacy') {
    throw Error(
      "[CodePluginSplashScreen]: generated was inadvertently executed with the incorrect config - 'type' must be 'legacy'",
    );
  }

  // Extract assetsDir from the Android legacy splash screen configuration
  const {assetsDir} = config.codePluginSplashScreen.plugin.android.legacy;

  // Copy assetsDir to Android res directory
  await fse.copy(
    path.project.resolve(assetsDir),
    path.project.resolve('android', 'app', 'src', 'main', 'res'),
    {
      overwrite: true,
    },
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
