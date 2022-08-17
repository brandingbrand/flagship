import React from 'react';

import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Image, Text, TouchableHighlight, View } from 'react-native';

import type { CommerceTypes } from '@brandingbrand/fscommerce';

import { style as S } from '../styles/CategoryBox';

export interface SerializableCategoryBoxProps extends CommerceTypes.Category {
  imageStyle?: ImageStyle;
  showImage?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  underlayColor?: string;
}

export interface CategoryBoxProps
  extends Omit<SerializableCategoryBoxProps, 'imageStyle' | 'style' | 'titleStyle'> {
  imageStyle?: StyleProp<ImageStyle>;
  onPress?: (item: CommerceTypes.Category) => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const CategoryBoxInner = (props: CategoryBoxProps): JSX.Element => {
  const { image, imageStyle, showImage, style, title, titleStyle, underlayColor } = props;

  // Called when a user taps on the item.
  const handlePress = () => {
    const { onPress } = props;
    if (onPress) {
      onPress(props);
    }
  };

  return (
    <TouchableHighlight
      accessibilityRole="imagebutton"
      onPress={handlePress}
      style={[S.boxOuter, style]}
      underlayColor={underlayColor || '#eee'}
    >
      <View style={S.boxInner}>
        {showImage !== false && image ? <Image source={image} style={imageStyle} /> : null}
        <Text style={[S.boxText, titleStyle]}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
};

export const CategoryBox = React.memo(CategoryBoxInner);
