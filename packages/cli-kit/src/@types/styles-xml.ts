/**
 * Represents the attributes of an item within a style.
 */
type ItemAttributes = {
  name: string;
};

/**
 * Represents an item within a style, containing attributes and a text value.
 */
type StyleItem = {
  /**
   * Attributes of the style item.
   */
  $: ItemAttributes;

  /**
   * The text value of the style item.
   */
  _: string;
};

/**
 * Represents the attributes of a style.
 */
type StyleAttributes = {
  /**
   * The name of the style.
   */
  name: string;

  /**
   * Optional: The name of the parent style.
   */
  parent?: string;
};

/**
 * Represents the elements within a style, which may include items.
 */
type StyleElements = {
  /**
   * Array of style items.
   */
  item?: StyleItem[];
};

/**
 * Represents an Android style defined in the styles.xml file.
 */
type Style = {
  /**
   * Attributes of the style.
   */
  $: StyleAttributes;
} & StyleElements;

/**
 * Represents the entire styles.xml file for Android.
 */
export type StylesXML = {
  /**
   * Resources section containing an array of styles.
   */
  resources: {
    style: Style[];
  };
};
