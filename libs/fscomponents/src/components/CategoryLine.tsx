import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import type {
  AccessibilityRole,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Image, Text, View } from 'react-native';

import type { CommerceTypes } from '@brandingbrand/fscommerce';

import { style as S } from '../styles/CategoryLine';

import { TouchableHighlightLink } from './TouchableHighlightLink';

export interface SerializableCategoryLineProps extends CommerceTypes.Category {
  accessoryStyle?: ImageStyle;
  href?: string;
  imageStyle?: ImageStyle;
  showAccessory?: boolean;
  showImage?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  underlayColor?: string;
  accessorySrc?: ImageSourcePropType;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
}

export interface CategoryLineProps
  extends Omit<
    SerializableCategoryLineProps,
    'accessoryStyle' | 'imageStyle' | 'style' | 'titleStyle'
  > {
  accessoryStyle?: StyleProp<ImageStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  onPress?: (item: CommerceTypes.Category) => void;
  renderAccessory?: () => React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

export const CategoryLine: FunctionComponent<CategoryLineProps> = memo((props): JSX.Element => {
  const {
    accessibilityLabel,
    accessibilityRole,
    accessorySrc,
    accessoryStyle,
    href,
    image,
    imageStyle,
    renderAccessory,
    showAccessory,
    showImage,
    style,
    title,
    titleStyle,
    underlayColor,
  } = props;

  /**
   * Called when a user taps on the item.
   *
   * @return
   */
  const handlePress = () => {
    const { onPress } = props;

    if (onPress) {
      onPress(props);
    }
  };

  const showAccessoryValue = showAccessory === undefined ? true : showAccessory;
  const showImageValue = showImage === undefined ? true : showImage;

  return (
    <TouchableHighlightLink
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole={accessibilityRole || 'link'}
      href={href}
      onPress={handlePress}
      style={[S.container, style]}
      underlayColor={underlayColor || '#eee'}
    >
      <View style={S.rowInner}>
        {showImageValue && image ? <Image source={image} style={imageStyle} /> : null}
        <Text style={[S.buttonText, titleStyle]}>{title}</Text>
        {showAccessoryValue && accessorySrc ? (
          <Image resizeMode="contain" source={accessorySrc} style={accessoryStyle} />
        ) : null}
        {renderAccessory ? renderAccessory() : null}
      </View>
    </TouchableHighlightLink>
  );
});
