import React, { Component } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

export interface Divider {
  color: string;
  thickness: number;
}
export interface TextBlockProps {
  options: Divider;
  containerStyle?: StyleProp<ViewStyle>;
}
export default class TextBlock extends Component<TextBlockProps> {
  public render(): JSX.Element {
    const { containerStyle, options } = this.props;
    const divider = {
      height: options.thickness,
      backgroundColor: options.color,
    };

    return (
      <View style={containerStyle}>
        <View style={divider} />
      </View>
    );
  }
}
