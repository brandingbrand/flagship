import React, { Component } from 'react';

import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';

import { border, palette } from '../styles/variables';

export interface PageDotsProps {
  numDots: number;
  activeIndex?: number;
  style?: StyleProp<ViewStyle>;
  activeDotStyle?: StyleProp<ViewStyle>;
  inactiveDotStyle?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10
  },
  lastDot: {
    marginRight: 0
  },
  active: {
    backgroundColor: palette.secondary
  },
  inactive: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: border.color
  }
});

export default class PageDots extends Component<PageDotsProps> {
  renderDot = (index: number) => {
    const otherStyles: any = index === this.props.activeIndex ?
      [styles.active, this.props.activeDotStyle] :
      [styles.inactive, this.props.inactiveDotStyle];

    if (index === this.props.numDots - 1) {
      otherStyles.push(styles.lastDot);
    }

    return (
      <View key={index} style={[styles.dot, ...otherStyles]} />
    );
  }

  render(): JSX.Element {
    return (
      <View style={[styles.container, this.props.style]}>
        {[...Array(this.props.numDots)].map((value, index) => this.renderDot(index))}
      </View>
    );
  }
}
