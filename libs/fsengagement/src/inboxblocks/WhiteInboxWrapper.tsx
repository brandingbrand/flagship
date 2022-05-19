import React, { Component } from 'react';

import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import type { InjectedProps } from '../types';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

export interface CardProps extends InjectedProps {
  containerStyle?: StyleProp<TextStyle>;
}

export default class WhiteInboxWrapper extends Component<CardProps> {
  public render(): JSX.Element {
    return <View style={styles.container}>{this.props.children}</View>;
  }
}
