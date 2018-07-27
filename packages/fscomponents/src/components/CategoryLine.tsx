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
}

export class CategoryLine extends PureComponent<CategoryLineProps> {
  static defaultProps: Partial<CategoryLineProps> = {
    showAccessory: true,
    showImage: true
  };

  render(): JSX.Element {
    const {
      renderAccessory,
      showAccessory,
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
    } = this.props;

    return (
      <TouchableHighlightLink
        style={[S.container, style]}
        underlayColor={underlayColor || '#eee'}
        onPress={this.handlePress}
        href={href}
      >
        <View style={S.rowInner}>
          {showImage && image && <Image source={image} style={imageStyle} />}
          <Text style={[S.buttonText, titleStyle]}>
            {title}
          </Text>
          {showAccessory && accessorySrc &&
            <Image source={accessorySrc} style={accessoryStyle} resizeMode='contain' />
          }
          {renderAccessory && renderAccessory()}
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
