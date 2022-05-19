import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

export interface PageIndicatorProps {
  currentIndex: number;
  itemsCount: number;
  style?: StyleProp<ViewStyle>;
  dotStyle?: StyleProp<ViewStyle>;
  dotActiveStyle?: StyleProp<ViewStyle>;
}

const S = StyleSheet.create({
  indicator: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    height: 8,
    marginHorizontal: 10,
    width: 8,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  indicatorSelected: {
    backgroundColor: '#777',
  },
});

const newArray = (num: number): number[] => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(i);
  }
  return arr;
};

export const PageIndicator: FunctionComponent<PageIndicatorProps> = memo((props): JSX.Element => {
  const { currentIndex, dotActiveStyle, dotStyle, itemsCount, style } = props;
  return (
    <View style={[S.indicatorContainer, style]}>
      {newArray(itemsCount).map((i) => (
        <View
          key={i}
          style={[
            S.indicator,
            dotStyle,
            i === currentIndex && S.indicatorSelected,
            i === currentIndex && dotActiveStyle,
          ]}
        />
      ))}
    </View>
  );
});
