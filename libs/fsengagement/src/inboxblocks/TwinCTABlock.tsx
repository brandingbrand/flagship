import React, { Component } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import type { JSON, ScreenProps } from '../types';

import { CTABlock } from './CTABlock';

export interface CTABlockProps extends ScreenProps {
  story?: JSON;
  contents: any;
  containerStyle?: StyleProp<ViewStyle>;
  buttonSpacing?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
  },
});
export default class TwinCTABlock extends Component<CTABlockProps> {
  public render(): JSX.Element {
    const { buttonSpacing, containerStyle, contents, story } = this.props;

    return (
      <View style={[styles.row, containerStyle]}>
        <View style={styles.item}>
          <CTABlock {...contents.leftCTA} story={story} />
        </View>
        <View style={[styles.item, buttonSpacing]}>
          <CTABlock {...contents.rightCTA} story={story} />
        </View>
      </View>
    );
  }
}
