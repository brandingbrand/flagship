import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleProp,
  View,
  ViewStyle
} from 'react-native';

import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';

export interface ImageWithTextProps {
  contents: any;
  containerStyle?: StyleProp<ViewStyle>;
}

export default class ImageWithTextBlock extends Component<ImageWithTextProps> {
  static contextTypes: any = {
    handleAction: PropTypes.func
  };
  render(): JSX.Element {
    const {
      containerStyle,
      contents
    } = this.props;

    return (
      <View style={containerStyle}>
        <TextBlock
          {...contents.Text}
        />
        <ImageBlock
          source={contents.Image.source}
          {
            ...contents.Image,
            { outerContainerStyle: containerStyle }
          }
        />
      </View>
    );
  }
}
