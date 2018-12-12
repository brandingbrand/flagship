import React, { Component } from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';

import {
  JSON,
  ScreenProps
} from '../types';

import CTABlock from './CTABlock';

export interface CTABlockProps extends ScreenProps {
  story?: JSON;
  contents: any;
  containerStyle?: StyleProp<ViewStyle>;
  buttonSpacing?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  item: {
    flex: 1
  }
});
export default class TwinCTABlock extends Component<CTABlockProps> {
  render(): JSX.Element {
    const {
      containerStyle,
      contents,
      buttonSpacing,
      story
    } = this.props;

    return (
      <View style={[styles.row, containerStyle]}>
        <View style={styles.item}>
          <CTABlock
            {...contents.leftCTA}
            story={story}
          />
        </View>
        <View style={[styles.item, buttonSpacing]}>
          <CTABlock
            {...contents.rightCTA}
            story={story}
          />
        </View>
      </View>
    );

  }
}
