import { Image } from './Image';

/**
 * Interface describing a single value of a key-value pair.
 */
export interface OptionValue {
  /**
   * The name of the value.
   *
   * @example '34L'
   */
  name: string;

  /**
   * Identifier for the value. This may be a database key or other non-human-readable
   * string.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  value: string;

  /**
   * Whether the value is available. This is typically utilized for products in which an
   * OptionValue is used to represent product variant and thus indicates whether the variant
   * can be purchased.
   */
  available?: boolean;

  /**
   * Swatches to display instead of the text, typically used for colors
   * Can be a string to represent a color or an image
   */
  swatch?: string | Image;

  /**
   * Images to display when this option is selected
   * Typically used for color swatches to show images of the product in the matching color
   */
  images?: Image[];
}

/**
 * Interface describing key-value data types in which a single key can have multiple values.
 */
export interface Option {
  /**
   * A unique identifier for the option.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  id: string;

  /**
   * A name for the option which is typically presented to the user.
   *
   * @example 'Length'
   */
  name: string;

  /**
   * Array of values for the option.
   */
  values: OptionValue[];
}
