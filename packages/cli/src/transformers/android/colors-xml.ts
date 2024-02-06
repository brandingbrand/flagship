import {
  type BuildConfig,
  type PrebuildOptions,
  type ColorsXML,
  withColors,
} from "@brandingbrand/code-cli-kit";

import { Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the Android project's "colors.xml" file.
 *
 * @type {typeof defineTransformer}
 * @template {(content: ColorsXML, config: BuildConfig, options: PrebuildOptions) => void} T - Type of transformations to be applied.
 * @param {StylesTransformer} transformerConfig - Configuration for the Android colors.xml transformer.
 * @returns {Transforms<ColorsXML, void>} - The type of the transformer.
 */
export default defineTransformer<Transforms<ColorsXML, void>>({
  /**
   * Specifies the file to be transformed, which is colors.xml in this case.
   */
  file: "colors.xml",

  /**
   * An array of transformer functions to be applied to the "colors.xml" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: ColorsXML, config: BuildConfig, options: PrebuildOptions) => void>}
   */
  transforms: [
    /**
     * Function that applies URL scheme configuration to the colors.xml file.
     * @param xml The StylesXML object representing the contents of the colors.xml file.
     * @param config The build configuration containing Android-specific manifest options.
     */
    (xml: ColorsXML, config: BuildConfig) => {
      if (!config.android.colors) return;

      if (!xml.resources.color) {
        xml.resources = { color: [] };
      }

      Object.entries(config.android.colors).forEach(([name, _]) =>
        xml.resources.color!.push({
          $: { name },
          _,
        })
      );
    },
  ],

  /**
   * Asynchronous function that performs the transformation of the colors.xml file.
   * @param config The build configuration containing Android-specific options.
   * @param options The prebuild options.
   * @returns A promise that resolves when the transformation is complete.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withColors((xml) => {
      return this.transforms.forEach((it) => it(xml, config, options));
    });
  },
});
