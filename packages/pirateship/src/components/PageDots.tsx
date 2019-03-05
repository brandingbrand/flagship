import React, { FunctionComponent } from 'react';

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

const PageDots: FunctionComponent<PageDotsProps> = (props): JSX.Element => {
  const renderDot = (index: number) => {
    const otherStyles: any = index === props.activeIndex ?
      [styles.active, props.activeDotStyle] :
      [styles.inactive, props.inactiveDotStyle];

    if (index === props.numDots - 1) {
      otherStyles.push(styles.lastDot);
    }

    return (
      <View key={index} style={[styles.dot, ...otherStyles]} />
    );
  };

  return (
    <View style={[styles.container, props.style]}>
      {[...Array(props.numDots)].map((value, index) => renderDot(index))}
    </View>
  );

};

export default PageDots;

