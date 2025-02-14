import {BuildConfig, StylesXML} from '@brandingbrand/code-cli-kit';

/**
 * Configuration for transforming Android styles.xml file
 */
export default {
  /** Regular expression to match styles.xml files */
  __test: /\bstyles\.xml$/gm,

  /**
   * Transforms the Android theme in styles.xml based on configuration
   *
   * @param xml - The parsed styles.xml document
   * @param config - Build configuration containing Android theme settings
   * @throws Error if AppTheme style cannot be found in the xml
   */
  theme: (xml: StylesXML, config: BuildConfig) => {
    if (config.android.style === undefined) return;

    const theme = xml.resources.style.find(it => it.$.name === 'AppTheme');

    if (!theme) {
      throw Error(
        `[StylesXMLTransformer]: cannot find AppTheme - unable to apply ${config.android.style} theme`,
      );
    }

    /**
     * Available theme styles mapping
     * - light: Light theme with no action bar
     * - dark: Dark theme with no action bar
     * - system: System-controlled day/night theme with no action bar
     */
    const styles = {
      light: 'Theme.AppCompat.Light.NoActionBar',
      dark: 'Theme.AppCompat.NoActionBar',
      system: 'Theme.AppCompat.DayNight.NoActionBar',
    };

    theme.$.parent = styles[config.android.style];
  },
};
