import React, { Component } from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  TextStyle,
  View
} from 'react-native';

export interface ImageBlockProps {
  source: ImageURISource;
  resizeMode?: any;
  resizeMethod?: any;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<TextStyle>;
}

export default class ImageBlock extends Component<ImageBlockProps> {
  render(): JSX.Element {
    const {
      imageStyle,
      containerStyle,
      resizeMode = 'contain',
      resizeMethod = 'resize',
      source
    } = this.props;

    return (
      <View style={containerStyle}>
        <Image
          source={source}
          style={[{ height: 200 }, imageStyle]}
          resizeMode={resizeMode}
          resizeMethod={resizeMethod}
        />
      </View>
    );
  }
}
