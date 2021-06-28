import React, { FunctionComponent, memo, useCallback } from 'react';
import {
  AccessibilityRole,
  Image,
  ImageStyle,
  ImageURISource,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { TouchableHighlightLink } from '../../TouchableHighlightLink';

import { style as S } from '../../../styles/CategoryLine';
import { useNavigator } from '@brandingbrand/fsapp';

export interface SerializableCategoryLineProps extends CommerceTypes.Category {
  accessoryStyle?: ImageStyle;
  href?: string;
  imageStyle?: ImageStyle;
  showAccessory?: boolean;
  showImage?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  underlayColor?: string;
  accessorySrc?: ImageURISource;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
}

export const CategoryLine: FunctionComponent<SerializableCategoryLineProps> = memo(
  (props): JSX.Element => {
    const {
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

    const navigator = useNavigator();

    const handlePress = useCallback(() => {
      if (href) {
        navigator.open(href);
      }
    }, [href]);

    const showAccessoryValue = showAccessory === undefined ? true : showAccessory;
    const showImageValue = showImage === undefined ? true : showImage;

    return (
      <TouchableHighlightLink
        style={[S.container, style]}
        underlayColor={underlayColor || '#eee'}
        onPress={handlePress}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole={accessibilityRole || 'link'}
      >
        <View style={S.rowInner}>
          {showImageValue && image && <Image source={image} style={imageStyle} />}
          <Text style={[S.buttonText, titleStyle]}>{title}</Text>
          {showAccessoryValue && accessorySrc && (
            <Image source={accessorySrc} style={accessoryStyle} resizeMode='contain' />
          )}
        </View>
      </TouchableHighlightLink>
    );
  }
);
