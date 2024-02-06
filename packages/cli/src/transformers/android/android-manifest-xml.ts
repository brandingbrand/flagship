import {
  type AndroidManifestXML,
  type BuildConfig,
  type PrebuildOptions,
  withManifest,
} from "@brandingbrand/code-cli-kit";

import { Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the Android project's "androidmanifest.xml" file.
 *
 * @type {typeof defineTransformer}
 * @template {(content: AndroidManifestXML, config: BuildConfig, options: PrebuildOptions) => void} T - Type of transformations to be applied.
 * @param {AndroidManifestTransformer} transformerConfig - Configuration for the Android androidmanifest.xml transformer.
 * @returns {Transforms<AndroidManifestXML, void>} - The type of the transformer.
 */
export default defineTransformer<Transforms<AndroidManifestXML, void>>({
  /**
   * Specifies the file to be transformed, which is AndroidManifest.xml in this case.
   */
  file: "AndroidManifest.xml",

  /**
   * An array of transformer functions to be applied to the "AndroidManifest.xml" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: AndroidManifestXML, config: BuildConfig, options: PrebuildOptions) => void>}
   */
  transforms: [
    /**
     * Function that applies URL scheme configuration to the AndroidManifest.xml file.
     * @param xml The AndroidManifestXML object representing the contents of the AndroidManifest.xml file.
     * @param config The build configuration containing Android-specific manifest options.
     */
    (xml: AndroidManifestXML, config: BuildConfig) => {
      // Check if URL scheme configuration is provided in the build configuration
      if (!config.android.manifest?.urlScheme) return;

      // Extract scheme and host from the URL scheme configuration
      const { scheme, host } = config.android.manifest.urlScheme;

      // Find the main application activity in the manifest and update its intent filter
      xml.manifest.application
        ?.find((it) => it.$["android:name"] === ".MainApplication")
        ?.activity?.find((it) => it.$["android:name"] === ".MainActivity")
        ?.["intent-filter"]?.push({
          // Add action for viewing content
          action: [
            {
              $: {
                "android:name": "android.intent.action.VIEW",
              },
            },
          ],
          // Add categories for default and browsable actions
          category: [
            {
              $: {
                "android:name": "android.intent.category.DEFAULT",
              },
            },
            {
              $: {
                "android:name": "android.intent.category.BROWSABLE",
              },
            },
          ],
          // Add data element for URL scheme
          data: [
            {
              $: {
                "android:scheme": scheme,
                ...(host && {
                  "android:host": host,
                }),
              },
            },
          ],
        });
    },
  ],

  /**
   * Asynchronous function that performs the transformation of the AndroidManifest.xml file.
   * @param config The build configuration containing Android-specific options.
   * @param options The prebuild options.
   * @returns A promise that resolves when the transformation is complete.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withManifest((xml) => {
      return this.transforms.forEach((it) => it(xml, config, options));
    });
  },
});
