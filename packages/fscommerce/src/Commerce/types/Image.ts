import { ImageURISource } from 'react-native';

/**
 * Information about the location and dimensions of a remote image.
 */
export interface Image extends ImageURISource {
  src: string;
  /**
   * Text to provide additional context about an image or to be displayed if the image
   * cannot be loaded.
   *
   * @example 'Red Plates'
   */
  alt?: string;
}
