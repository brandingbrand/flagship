import React, { PureComponent } from 'react';
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
  onPress?: (item: CommerceTypes.Category) => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  underlayColor?: string;
  imageStyle?: StyleProp<ImageStyle>;
}

export class CategoryBox extends PureComponent<CategoryBoxProps> {
  render(): JSX.Element {
    const {
      image,
      imageStyle,
      style,
      title,
      titleStyle,
      underlayColor
    } = this.props;

    return (
      <TouchableHighlight
        style={[S.boxOuter, style]}
        underlayColor={underlayColor || '#eee'}
        onPress={this.handlePress}
      >
        <View style={S.boxInner}>
          {image && <Image source={image} style={imageStyle} />}
          <Text style={[S.boxText, titleStyle]}>
            {title}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  /**
   * Called when a user taps on the item.
   */
  private handlePress = () => {
    const { onPress } = this.props;

    if (onPress) {
      return onPress(this.props);
    }
  }
}
