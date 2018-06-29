import React, { Component } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

const styles = StyleSheet.create({
  container: {},
  label: {
    fontWeight: 'bold'
  },
  value: {}
});

export interface KeyValuePair {
  label: string;
  value: string;
  textStyle?: any;
}

export interface PSLabeledValuesProps {
  items: KeyValuePair | KeyValuePair[];
  containerStyle?: StyleProp<ViewStyle>;
  containerTextStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}

export default class PSLabeledValues extends Component<PSLabeledValuesProps> {
  render(): JSX.Element {
    const { items, containerStyle } = this.props;

    let body = null;
    if (Array.isArray(items)) {
      body = items.map(this.renderLine);
    } else {
      body = this.renderLine(items, 0);
    }

    return (
      <View style={[styles.container, containerStyle]}>
        {body}
      </View>
    );
  }

  renderLine = (item: KeyValuePair, index: number) => {
    const { label, value } = item;
    const { labelStyle, valueStyle, containerTextStyle } = this.props;

    return (
      <Text
        key={index}
        style={containerTextStyle}
      >
        <Text style={[styles.label, labelStyle]}>
          {label}:{' '}
        </Text>
        <Text style={[styles.value, valueStyle]}>
          {value}
        </Text>
      </Text>
    );
  }
}
