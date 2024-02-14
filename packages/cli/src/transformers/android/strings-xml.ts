import {
  type BuildConfig,
  type PrebuildOptions,
  type StringsXML,
  withStrings,
} from "@brandingbrand/code-cli-kit";

import { Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the Android project's "strings.xml" file.
 *
 * @type {typeof defineTransformer}
 * @template {(content: StringsXML, config: BuildConfig, options: PrebuildOptions) => void} T - Type of transformations to be applied.
 * @param {StringsTransformer} transformerConfig - Configuration for the Android strings.xml transformer.
 * @returns {Transforms<StringsXML, void>} - The type of the transformer.
 */
export default defineTransformer<Transforms<StringsXML, void>>({
  /**
   * Specifies the file to be transformed, which is strings.xml in this case.
   */
  file: "strings.xml",

  /**
   * An array of transformer functions to be applied to the "strings.xml" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: StringsXML, config: BuildConfig, options: PrebuildOptions) => void>}
   */
  transforms: [
    /**
     * Function that applies display name to the strings.xml file.
     * @param xml The StringsXML object representing the contents of the strings.xml file.
     * @param config The build configuration containing Android-specific manifest options.
     */
    (xml: StringsXML, config: BuildConfig) => {
      if (!xml.resources.string) return;

      const index = xml.resources.string.findIndex(
        (it) => it.$.name === "app_name"
      );

      if (index > -1) {
        xml.resources.string.splice(index, 1, {
          $: { name: "app_name" },
          _: config.android.displayName,
        });
      }
    },

    /**
     * Function that applies string configuration to the strings.xml file.
     * @param xml The StringsXML object representing the contents of the strings.xml file.
     * @param config The build configuration containing Android-specific manifest options.
     */
    (xml: StringsXML, config: BuildConfig) => {
      if (!config.android.strings?.string) return;

      if (!xml.resources.string) {
        xml.resources = { ...xml.resources, string: [] };
      }

      Object.entries(config.android.strings.string).forEach(([name, _]) =>
        xml.resources.string?.push({
          $: { name },
          _,
        })
      );
    },

    /**
     * Function that applies stringArray configuration to the strings.xml file.
     * @param xml The StringsXML object representing the contents of the strings.xml file.
     * @param config The build configuration containing Android-specific manifest options.
     */
    (xml: StringsXML, config: BuildConfig) => {
      if (!config.android.strings?.stringArray) return;

      if (!xml.resources["string-array"]) {
        xml.resources = { ...xml.resources, "string-array": [] };
      }

      Object.entries(config.android.strings.stringArray).forEach(
        ([name, items]) => {
          xml.resources["string-array"]?.push({
            $: { name },
            item: items.map((it) => ({
              _: it,
            })),
          });
        }
      );
    },

    /**
     * Function that applies plurals configuration to the strings.xml file.
     * @param xml The StringsXML object representing the contents of the strings.xml file.
     * @param config The build configuration containing Android-specific manifest options.
     */
    (xml: StringsXML, config: BuildConfig) => {
      if (!config.android.strings?.plurals) return;

      if (!xml.resources.plurals) {
        xml.resources = { ...xml.resources, plurals: [] };
      }

      Object.entries(config.android.strings.plurals).forEach(
        ([name, items]) => {
          xml.resources.plurals?.push({
            $: { name },
            item: items.map(({ value, quantity }) => ({
              _: value,
              $: {
                quantity,
              },
            })),
          });
        }
      );
    },
  ],

  /**
   * Asynchronous function that performs the transformation of the strings.xml file.
   * @param config The build configuration containing Android-specific options.
   * @param options The prebuild options.
   * @returns A promise that resolves when the transformation is complete.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withStrings((xml) => {
      return this.transforms.forEach((it) => it(xml, config, options));
    });
  },
});
