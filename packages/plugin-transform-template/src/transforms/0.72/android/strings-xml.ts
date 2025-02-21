import {BuildConfig, StringsXML} from '@brandingbrand/code-cli-kit';

/**
 * Configuration object for handling Android string resources
 */
export default {
  /** Regular expression to match strings.xml files */
  __test: /\bstrings\.xml$/gm,

  /**
   * Updates the app display name in the strings.xml file
   * @param xml - The strings XML object to modify
   * @param config - Build configuration containing the display name
   */
  displayName: (xml: StringsXML, config: BuildConfig) => {
    if (!xml.resources.string) return;

    const index = xml.resources.string.findIndex(
      it => it.$.name === 'app_name',
    );

    if (index > -1) {
      xml.resources.string.splice(index, 1, {
        $: {name: 'app_name'},
        _: config.android.displayName,
      });
    }
  },

  /**
   * Adds or updates string resources in the strings.xml file
   * @param xml - The strings XML object to modify
   * @param config - Build configuration containing string values
   */
  string: (xml: StringsXML, config: BuildConfig) => {
    if (!config.android.strings?.string) return;

    if (!xml.resources.string) {
      xml.resources = {...xml.resources, string: []};
    }

    Object.entries(config.android.strings.string).forEach(([name, _]) =>
      xml.resources.string?.push({
        $: {name},
        _,
      }),
    );
  },

  /**
   * Adds or updates string-array resources in the strings.xml file
   * @param xml - The strings XML object to modify
   * @param config - Build configuration containing string array values
   */
  stringArray: (xml: StringsXML, config: BuildConfig) => {
    if (!config.android.strings?.stringArray) return;

    if (!xml.resources['string-array']) {
      xml.resources = {...xml.resources, 'string-array': []};
    }

    Object.entries(config.android.strings.stringArray).forEach(
      ([name, items]) => {
        xml.resources['string-array']?.push({
          $: {name},
          item: items.map(it => ({
            _: it,
          })),
        });
      },
    );
  },

  /**
   * Adds or updates plural string resources in the strings.xml file
   * @param xml - The strings XML object to modify
   * @param config - Build configuration containing plural string values
   */
  plurals: (xml: StringsXML, config: BuildConfig) => {
    if (!config.android.strings?.plurals) return;

    if (!xml.resources.plurals) {
      xml.resources = {...xml.resources, plurals: []};
    }

    Object.entries(config.android.strings.plurals).forEach(([name, items]) => {
      xml.resources.plurals?.push({
        $: {name},
        item: items.map(({value, quantity}) => ({
          _: value,
          $: {
            quantity,
          },
        })),
      });
    });
  },
};
