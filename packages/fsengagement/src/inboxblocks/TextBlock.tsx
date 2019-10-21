import React, { Component } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  default: {
    color: '#000'
  }
});
export interface TextBlockProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<TextStyle>;
  animateIndex?: number;
}
export default class TextBlock extends Component<TextBlockProps> {
  fadeInView: any;
  handleFadeInRef = (ref: any) => this.fadeInView = ref;
  componentDidMount(): void {
    if (this.props.animateIndex && this.props.animateIndex <= 3) {
      this.fadeInView.transition(
        { opacity: 0 },
        { opacity: 1 },
        400, 'ease-out');
    }
  }
  shouldComponentUpdate(nextProps: TextBlockProps): boolean {
    return nextProps.textStyle !== this.props.textStyle ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.text !== this.props.text;
  }
  render(): JSX.Element {
    const {
      textStyle,
      containerStyle,
      text
    } = this.props;

    if (this.props.animateIndex && this.props.animateIndex <= 3) {
      return (
        <View style={containerStyle}>
          <Animatable.Text
            style={[styles.default, textStyle]}
            ref={this.handleFadeInRef}
            useNativeDriver
            delay={250}
          >
          {text}
          </Animatable.Text>
        </View>

      );
    }

    return (
      <View style={containerStyle}>
        <Text style={[styles.default, textStyle]}>{text}</Text>
      </View>
    );
  }
}
