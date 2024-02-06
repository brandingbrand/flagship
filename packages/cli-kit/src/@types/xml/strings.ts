/**
 * Represents the attributes of a string within a string resource.
 */
type String$Attributes = {
  name: string;
};

/**
 * Represents a string resource, containing attributes and a text value.
 */
type String$ = {
  /**
   * Attributes of the string resource.
   */
  $: String$Attributes;

  /**
   * The text value of the string resource.
   */
  _: string;
};

/**
 * Represents an item within a string array.
 */
type Item = {
  /**
   * The text value of the string array item.
   */
  _: string;
};

/**
 * Represents the attributes of a string array.
 */
type StringArrayAttributes = {
  name: string;
};

/**
 * Represents the elements within a string array, which include an array of items.
 */
type StringArrayElements = {
  /**
   * Array of string array items.
   */
  item: Item[];
};

/**
 * Represents a string array resource defined in the strings.xml file.
 */
type StringArray = {
  /**
   * Attributes of the string array resource.
   */
  $: StringArrayAttributes;
} & StringArrayElements;

/**
 * Represents the attributes of a plural string item.
 */
type PluralsItemAttribute = {
  /**
   * The quantity associated with the plural string item.
   */
  quantity: "zero" | "one" | "two" | "few" | "many" | "other";
};

/**
 * Represents a plural string item, containing attributes and a text value.
 */
type PluralsItem = {
  /**
   * Attributes of the plural string item.
   */
  $: PluralsItemAttribute;

  /**
   * The text value of the plural string item.
   */
  _: string;
};

/**
 * Represents the attributes of a plurals resource.
 */
type PluralsAttributes = {
  /**
   * The name of the plurals resource.
   */
  name: string;
};

/**
 * Represents the elements within a plurals resource, which include an array of plural items.
 */
type PluralsElements = {
  /**
   * Array of plural string items.
   */
  item: PluralsItem[];
};

/**
 * Represents a plurals resource defined in the strings.xml file.
 */
type Plurals = {
  /**
   * Attributes of the plurals resource.
   */
  $: PluralsAttributes;
} & PluralsElements;

/**
 * Represents the elements within the strings.xml file, which may include strings, string arrays, and plurals.
 */
type StringsElements = {
  /**
   * Array of string resources.
   */
  string?: String$[];

  /**
   * Array of string array resources.
   */
  "string-array"?: StringArray[];

  /**
   * Array of plurals resources.
   */
  plurals?: Plurals[];
};

/**
 * Represents the entire strings.xml file for Android.
 */
export type StringsXML = {
  /**
   * Resources section containing an array of strings, string arrays, and plurals.
   */
  resources: StringsElements;
};
