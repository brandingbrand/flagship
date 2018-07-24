import React, { Component } from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  View
} from 'react-native';

export interface TextBlockProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<TextStyle>;
}
export default class TextBlock extends Component<TextBlockProps> {
  render(): JSX.Element {
    const {
      textStyle,
      containerStyle,
      text
    } = this.props;

    return (
      <View style={containerStyle}>
        <Text style={textStyle}>{text}</Text>
      </View>
    );
  }
}
