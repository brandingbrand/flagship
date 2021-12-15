import React, { Component } from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { InjectedProps } from '../types';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

export interface CardProps extends InjectedProps {
  containerStyle?: StyleProp<TextStyle>;
}

export default class WhiteInboxWrapper extends Component<CardProps> {
  render(): JSX.Element {
    return <View style={styles.container}>{this.props.children}</View>;
  }
}
