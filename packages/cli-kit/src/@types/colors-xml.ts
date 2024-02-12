/**
 * Represents the attributes of a color resource.
 */
type ColorAttributes = {
  /**
   * The name of the color resource.
   */
  name: string;
};

/**
 * Represents a color resource, containing attributes and a color value.
 */
type Color = {
  /**
   * Attributes of the color resource.
   */
  $: ColorAttributes;

  /**
   * The color value.
   */
  _: string;
};

/**
 * Represents the elements within the colors section, which may include color resources.
 */
type ColorsElements = {
  /**
   * Array of color resources.
   */
  color?: Color[];
};

/**
 * Represents the entire colors.xml file for Android.
 */
export type ColorsXML = {
  /**
   * Resources section containing an array of color resources.
   */
  resources: ColorsElements;
};
