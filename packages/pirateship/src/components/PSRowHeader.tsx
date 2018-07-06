import React, { Component } from 'react';

import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

import { fontSize, palette } from '../styles/variables';

export interface PSRowHeaderProps {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  view: {
    padding: 10,
    backgroundColor: palette.surface
  },
  title: {
    fontSize: fontSize.small,
    fontWeight: 'bold',
    color: palette.onSurface
  }
});

export default class PSRowHeader extends Component<PSRowHeaderProps> {
  render(): JSX.Element {
    return (
      <View style={[styles.view, this.props.style]}>
        <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
      </View>
    );
  }
}
