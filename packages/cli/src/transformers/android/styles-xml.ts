import {
  type BuildConfig,
  type PrebuildOptions,
  type StylesXML,
  withStyles,
} from "@brandingbrand/code-cli-kit";

import { Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the Android project's "styles.xml" file.
 *
 * @type {typeof defineTransformer}
 * @template {(content: StylesXML, config: BuildConfig, options: PrebuildOptions) => void} T - Type of transformations to be applied.
 * @param {StylesTransformer} transformerConfig - Configuration for the Android styles.xml transformer.
 * @returns {Transforms<StylesXML, void>} - The type of the transformer.
 */
export default defineTransformer<Transforms<StylesXML, void>>({
  /**
   * Specifies the file to be transformed, which is styles.xml in this case.
   */
  file: "styles.xml",

  /**
   * An array of transformer functions to be applied to the "styles.xml" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: StylesXML, config: BuildConfig, options: PrebuildOptions) => void>}
   */
  transforms: [
    /**
     * Function that applies styles configuration to the styles.xml file.
     * @param xml The StylesXML object representing the contents of the styles.xml file.
     * @param config The build configuration containing Android-specific manifest options.
     */
    (xml: StylesXML, config: BuildConfig) => {
      if (config.android.style === undefined) return;

      const theme = xml.resources.style.find((it) => it.$.name === "AppTheme");

      if (!theme) {
        throw Error(
          `[StylesXMLTransformer]: cannot find AppTheme - unable to apply ${config.android.style} theme`
        );
      }

      const styles = {
        light: "Theme.AppCompat.Light.NoActionBar",
        dark: "Theme.AppCompat.NoActionBar",
        system: "Theme.AppCompat.DayNight.NoActionBar",
      };

      theme.$.parent = styles[config.android.style];
    },
  ],

  /**
   * Asynchronous function that performs the transformation of the styles.xml file.
   * @param config The build configuration containing Android-specific options.
   * @param options The prebuild options.
   * @returns A promise that resolves when the transformation is complete.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withStyles((xml) => {
      return this.transforms.forEach((it) => it(xml, config, options));
    });
  },
});
