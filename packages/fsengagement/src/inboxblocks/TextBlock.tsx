import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View
} from 'react-native';

const styles = StyleSheet.create({
  default: {
    color: '#000'
  }
});

interface LocalizationData {
  value: string;
  language: string;
}
export interface TextBlockProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<TextStyle>;
  localization?: LocalizationData[];
}
export default class TextBlock extends Component<TextBlockProps> {
  static contextTypes: any = {
    language: PropTypes.string
  };

  shouldComponentUpdate(nextProps: TextBlockProps): boolean {
    return nextProps.textStyle !== this.props.textStyle ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.text !== this.props.text;
  }
  render(): JSX.Element {
    const {
      textStyle,
      containerStyle,
      localization
    } = this.props;

    let { text } = this.props;
    const { language } = this.context;
    const filterLocalization = localization && localization.find(item => {
      return item.language === language;
    }) || null;
    if (filterLocalization) {
      text = filterLocalization.value;
    }
    return (
      <View style={containerStyle}>
        <Text style={[styles.default, textStyle]}>{text}</Text>
      </View>
    );
  }
}
