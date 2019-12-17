import React, { Component } from 'react';
import {
  StyleProp,
  View,
  ViewStyle
} from 'react-native';


export interface Divider {
  color: string;
  thickness: number;
}
export interface TextBlockProps {
  options: Divider;
  containerStyle?: StyleProp<ViewStyle>;
}
export default class TextBlock extends Component<TextBlockProps> {
  render(): JSX.Element {
    const {
      options,
      containerStyle
    } = this.props;
    const divider = {
      height: options.thickness,
      backgroundColor: options.color
    };

    return (
      <View style={containerStyle}>
        <View style={divider} />
      </View>
    );
  }
}
