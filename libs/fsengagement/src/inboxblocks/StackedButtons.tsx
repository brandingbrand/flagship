import React, { Component } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import type { JSON, ScreenProps } from '../types';

import { CTABlock } from './CTABlock';

export interface StackedButtonsProps extends ScreenProps {
  story?: JSON;
  contents: any;
  containerStyle?: StyleProp<ViewStyle>;
  buttonSpacing?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
  },
});
export default class StackedButtons extends Component<StackedButtonsProps> {
  public render(): JSX.Element {
    const { buttonSpacing, containerStyle, contents, story } = this.props;

    return (
      <View style={containerStyle}>
        <View style={[styles.item, buttonSpacing]}>
          <CTABlock {...contents.topCTA} story={story} />
        </View>
        <View style={styles.item}>
          <CTABlock {...contents.bottomCTA} story={story} />
        </View>
      </View>
    );
  }
}
