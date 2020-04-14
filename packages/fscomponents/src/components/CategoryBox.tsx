import React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle
} from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { style as S } from '../styles/CategoryBox';

export interface CategoryBoxProps extends CommerceTypes.Category {
  imageStyle?: StyleProp<ImageStyle>;
  onPress?: (item: CommerceTypes.Category) => void;
  showImage?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  underlayColor?: string;
}

const CategoryBoxInner = (props: CategoryBoxProps): JSX.Element => {
  const {
    image,
    showImage,
    imageStyle,
    style,
    title,
    titleStyle,
    underlayColor
  } = props;

  // Called when a user taps on the item.
  const handlePress = () => {
    const { onPress } = props;
    if (onPress) {
      return onPress(props);
    }
  };

  return (
    <TouchableHighlight
      style={[S.boxOuter, style]}
      underlayColor={underlayColor || '#eee'}
      onPress={handlePress}
      accessibilityRole='imagebutton'
    >
      <View style={S.boxInner}>
        {showImage !== false && image && <Image source={image} style={imageStyle} />}
        <Text style={[S.boxText, titleStyle]}>
          {title}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export const CategoryBox = React.memo(CategoryBoxInner);
