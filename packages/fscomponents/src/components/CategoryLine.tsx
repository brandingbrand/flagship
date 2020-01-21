import React, { FunctionComponent, memo } from 'react';
import {
  AccessibilityRole,
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { TouchableHighlightLink } from './TouchableHighlightLink';

import { style as S } from '../styles/CategoryLine';

export interface CategoryLineProps extends CommerceTypes.Category {
  accessorySrc?: ImageURISource;
  accessoryStyle?: StyleProp<ImageStyle>;
  href?: string;
  imageStyle?: StyleProp<ImageStyle>;
  onPress?: (item: CommerceTypes.Category) => void;
  showAccessory?: boolean;
  renderAccessory?: () => React.ReactNode;
  showImage?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  underlayColor?: string;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
}

// tslint:disable-next-line:cyclomatic-complexity
export const CategoryLine: FunctionComponent<CategoryLineProps> = memo((props): JSX.Element => {

  const {
    renderAccessory,
    showAccessory,
    accessibilityLabel,
    accessibilityRole,
    accessorySrc,
    accessoryStyle,
    href,
    image,
    showImage,
    imageStyle,
    style,
    title,
    titleStyle,
    underlayColor
  } = props;

  /**
   * Called when a user taps on the item.
   * @returns {void}
   */
  const handlePress = () => {
    const { onPress } = props;

    if (onPress) {
      return onPress(props);
    }
  };

  const showAccessoryValue = showAccessory === undefined ? true : showAccessory;
  const showImageValue = showImage === undefined ? true : showImage;

  return (
    <TouchableHighlightLink
      style={[S.container, style]}
      underlayColor={underlayColor || '#eee'}
      onPress={handlePress}
      href={href}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole={accessibilityRole || 'link'}
    >
      <View style={S.rowInner}>
        {showImageValue && image && <Image source={image} style={imageStyle} />}
        <Text style={[S.buttonText, titleStyle]}>
          {title}
        </Text>
        {showAccessoryValue && accessorySrc &&
          <Image source={accessorySrc} style={accessoryStyle} resizeMode='contain' />
        }
        {renderAccessory && renderAccessory()}
      </View>
    </TouchableHighlightLink>
  );
});

