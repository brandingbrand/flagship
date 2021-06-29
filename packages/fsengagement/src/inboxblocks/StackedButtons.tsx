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

import { CTABlock } from './CTABlock';

export interface StackedButtonsProps extends ScreenProps {
  story?: JSON;
  contents: any;
  containerStyle?: StyleProp<ViewStyle>;
  buttonSpacing?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  item: {
    flex: 1
  }
});
export default class StackedButtons extends Component<StackedButtonsProps> {
  render(): JSX.Element {
    const {
      containerStyle,
      contents,
      buttonSpacing,
      story
    } = this.props;

    return (
      <View style={containerStyle}>
        <View style={[styles.item, buttonSpacing]}>
          <CTABlock
            {...contents.topCTA}
            story={story}
          />
        </View>
        <View style={styles.item}>
          <CTABlock
            {...contents.bottomCTA}
            story={story}
          />
        </View>
      </View>
    );

  }
}
