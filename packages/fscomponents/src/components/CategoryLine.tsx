import React, { PureComponent } from 'react';
import {
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
  onPress?: (item: CommerceTypes.Category) => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  underlayColor?: string;
  imageBool?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  accessoryBool?: boolean;
  accessorySrc?: ImageURISource;
  accessoryStyle?: StyleProp<ImageStyle>;
  href?: string;
}

export class CategoryLine extends PureComponent<CategoryLineProps> {
  static defaultProps: Partial<CategoryLineProps> = {
    accessoryBool: true,
    imageBool: true
  };

  render(): JSX.Element {
    const {
      accessoryBool,
      accessorySrc,
      accessoryStyle,
      href,
      image,
      imageBool,
      imageStyle,
      style,
      title,
      titleStyle,
      underlayColor
    } = this.props;

    return (
      <TouchableHighlightLink
        style={[S.container, style]}
        underlayColor={underlayColor || '#eee'}
        onPress={this.handlePress}
        href={href}
      >
        <View style={S.rowInner}>
          {imageBool && image && <Image source={image} style={imageStyle} />}
          <Text style={[S.buttonText, titleStyle]}>
            {title}
          </Text>
          {accessoryBool && accessorySrc && <Image source={accessorySrc} style={accessoryStyle} />}
        </View>
      </TouchableHighlightLink>
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
