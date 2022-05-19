import React, { Component } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import PropTypes from 'prop-types';

import { ImageBlock } from './ImageBlock';
import { TextBlock } from './TextBlock';

export interface ImageWithTextProps {
  contents: any;
  containerStyle?: StyleProp<ViewStyle>;
  cardContainerStyle?: StyleProp<ViewStyle>;
}

export default class ImageWithTextBlock extends Component<ImageWithTextProps> {
  public static contextTypes: any = {
    handleAction: PropTypes.func,
  };

  public render(): JSX.Element {
    const { cardContainerStyle, containerStyle, contents } = this.props;

    return (
      <View style={containerStyle}>
        <ImageBlock
          source={contents.Image.source}
          {...{ ...contents.Image, outerContainerStyle: containerStyle, cardContainerStyle }}
        />
        <TextBlock {...contents.Text} />
      </View>
    );
  }
}
