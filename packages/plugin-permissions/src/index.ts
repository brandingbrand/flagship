/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  type BuildConfig,
  type PrebuildOptions,
  definePlugin,
  withUTF8,
  string,
  withInfoPlist,
  withManifest,
  path,
} from '@brandingbrand/code-cli-kit';

import * as permissions from './permissions';
import {CodePluginPermissions} from './types';

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig & CodePluginPermissions} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginPermissions>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig & CodePluginPermissions} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (
    build: BuildConfig & CodePluginPermissions,
    options: PrebuildOptions,
  ): Promise<void> {
    // Check if the iOS plugin permissions are defined
    if (!build.codePluginPermissions.plugin.ios) return;

    // Update podspec file with appropriate permissions
    await withUTF8(path.ios.podfile, content => {
      const pods = build.codePluginPermissions.plugin.ios?.map(
        it => `'${it.permission}'`,
      );

      if (!pods) return content;

      const setupPodsString = `setup_permissions([
  ${pods.join(',\n  ')}
])`;

      return string.replace(
        content,
        /(.)/m,
        `def node_require(script)
  # Resolve script with node to allow for hoisting
  require Pod::Executable.execute_command('node', ['-p',
    "require.resolve(
      '#{script}',
      {paths: [process.argv[1]]},
    )", __dir__]).strip
end

node_require('react-native-permissions/scripts/setup.rb')

${setupPodsString}

$1`,
      );
    });

    // Update Info.plist with appropriate permissions and texts
    await withInfoPlist(plist => {
      const newPlist = build.codePluginPermissions.plugin
        .ios!.filter(it => it.text)
        .reduce((acc, curr) => {
          const pod = permissions.ios[curr.permission];

          if (!pod?.usageKey) return acc;

          if (!curr.text) {
            throw Error(
              `[CodePermissionsPluginError]: ${pod.pod} permission requires a 'usageKey'.`,
            );
          }

          // Exception case for LocationAccuracy permission which requires a purpose key
          // https://developer.apple.com/documentation/bundleresources/information_property_list/nslocationtemporaryusagedescriptiondictionary
          if (curr.permission === 'LocationAccuracy') {
            if (!curr.purposeKey) {
              throw Error(
                "[CodePermissionsPluginError]: 'LocationAccuracy' permission requires a 'purposekey'.",
              );
            }
            return {
              ...acc,
              [pod.usageKey]: {
                [curr.purposeKey]: curr.text,
              },
            };
          }

          return {
            ...acc,
            [pod.usageKey]: curr.text,
          };
        }, plist);

      return newPlist;
    });
  },

  /**
   * Function to be executed for Android platform.
   * @param {BuildConfig & CodePluginPermissions} build - The build configuration object for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (
    build: BuildConfig & CodePluginPermissions,
    options: PrebuildOptions,
  ): Promise<void> {
    // Check if the Android plugin permissions are defined
    if (!build.codePluginPermissions.plugin.android) return;

    // Update AndroidManifest.xml with appropriate permissions
    await withManifest(xml => {
      if (!xml.manifest['uses-permission']) {
        xml.manifest = {...xml.manifest, 'uses-permission': []};
      }

      // Iterate through Android permissions, filtering out empty strings or objects.
      // An object is a permissible type to extend any permission typings.
      build.codePluginPermissions.plugin.android
        ?.filter(it => typeof it === 'string' && !!it)
        ?.forEach(it => {
          // Push valid permissions to the Android manifest.
          xml.manifest['uses-permission']?.push({
            $: {
              'android:name': `android.permission.${it}`,
            },
          });
        });
    });
  },
});

export type {CodePluginPermissions};
