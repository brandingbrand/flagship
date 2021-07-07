import { ComponentClass } from 'react';
import { ImageStyle, ImageURISource, TextStyle, ViewStyle } from 'react-native';
import { Accordion as FSAccordion } from '../../Accordion';

export interface SerializableAccordionProps {
  /**
   * Duration of the icon spin animation
   */
  animationDuration?: number;
  /**
   * Arrow icon to use; should be oriented facing right (>)
   */
  arrowIconImage?: ImageURISource;
  /**
   * Styles for the arrow icon
   */
  arrowIconStyle?: ImageStyle;
  /**
   * Range of rotation for open/closed arrows
   */
  arrowRange?: string[];
  /**
   * Icon to use when open if icon format is 'image'
   */
  openIconImage?: ImageURISource;
  /**
   * Styles for open icon image
   */
  openIconStyle?: ImageStyle;
  /**
   * Icon to use when closed if icon format is 'image'
   */
  closedIconImage?: ImageURISource;
  /**
   * Styles for open icon image
   */
  closedIconStyle?: ImageStyle;
  /**
   * Styles for the accordion content container
   */
  contentStyle?: ViewStyle;
  /**
   * Whether to disable the animation (default false)
   */
  disableAnimation?: boolean;
  /**
   * Whether to display the icon as an image w open/closed options,
   * an arrow which rotates on open/close, or plus/minus (default is plus/minus)
   */
  iconFormat?: 'image' | 'plusminus' | 'arrow';
  /**
   * Styles for the accordion container when open
   */
  openStyle?: ViewStyle;
  /**
   * Styles for the accordion title when open
   */
  openTitleStyle?: ViewStyle;
  /**
   * Bottom padding
   * @deprecated Put the padding on the accordion contents instead
   */
  padding?: number;
  /**
   * Styles for the plus minus icon
   */
  plusMinusStyle?: TextStyle;
  /**
   * Whether to initialize as open or closed
   */
  state?: 'open' | 'closed';
  /**
   * Styles for the accordion container
   */
  style?: ViewStyle;
  /**
   * Content of the accordion title
   */
  title: string;
  /**
   *  Styles for the accordion title container
   */
  titleContainerStyle?: ViewStyle;
  /**
   * Styles for the accordion title
   */
  titleStyle?: ViewStyle;
  /**
   * Color of the title touch highlight
   */
  titleUnderlayColor?: string;
  /**
   * Left and right padding (has defaults)
   */
  paddingHorizontal?: number;
  /**
   * Height of title touch highlight (has default)
   */
  titleTouchStyle?: ViewStyle;
}

export const Accordion: ComponentClass<SerializableAccordionProps> =
  FSAccordion as ComponentClass<SerializableAccordionProps>;
