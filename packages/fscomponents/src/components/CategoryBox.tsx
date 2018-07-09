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
  imageStyle?: StyleProp<ImageStyle>;
  onPress?: (item: CommerceTypes.Category) => void;
  showImage?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  underlayColor?: string;
}

export class CategoryBox extends PureComponent<CategoryBoxProps> {
  static defaultProps: Partial<CategoryBoxProps> = {
    showImage: true
  };

  render(): JSX.Element {
    const {
      image,
      showImage,
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
          {showImage && image && <Image source={image} style={imageStyle} />}
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
