import {BuildConfig, ColorsXML} from '@brandingbrand/code-cli-kit';

/**
 * Configuration object for handling Android colors XML generation
 */
export default {
  /**
   * Regular expression to match colors.xml files
   */
  __test: /\bcolors\.xml$/gm,

  /**
   * Processes and updates Android colors XML file
   * @param xml - The colors XML object to modify
   * @param config - Build configuration containing Android-specific settings
   * @description
   * This function handles generating and updating the colors.xml resource file:
   * 1. Checks if Android colors are configured
   * 2. Initializes the colors array if it doesn't exist
   * 3. Adds each configured color to the XML resources
   *
   * Colors are added with their name as an attribute and value as the content
   */
  colors: (xml: ColorsXML, config: BuildConfig) => {
    if (!config.android.colors) return;

    if (!xml.resources.color) {
      xml.resources = {...xml.resources, color: []};
    }

    Object.entries(config.android.colors).forEach(([name, _]) =>
      xml.resources.color?.push({
        $: {name},
        _,
      }),
    );
  },
};
