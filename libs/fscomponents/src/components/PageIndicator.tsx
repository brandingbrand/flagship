import React, { FunctionComponent, memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export interface PageIndicatorProps {
  currentIndex: number;
  itemsCount: number;
  style?: StyleProp<ViewStyle>;
  dotStyle?: StyleProp<ViewStyle>;
  dotActiveStyle?: StyleProp<ViewStyle>;
}

const S = StyleSheet.create({
  indicatorContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: '#ccc'
  },
  indicatorSelected: {
    backgroundColor: '#777'
  }
});

export const PageIndicator: FunctionComponent<PageIndicatorProps> = memo((props): JSX.Element => {
  const {
    currentIndex,
    itemsCount,
    style,
    dotStyle,
    dotActiveStyle
  } = props;
  return (
    <View style={[S.indicatorContainer, style]}>
      {newArray(itemsCount).map(i => (
        <View
          key={i}
          style={[
            S.indicator,
            dotStyle,
            i === currentIndex && S.indicatorSelected,
            i === currentIndex && dotActiveStyle
          ]}
        />
      ))}
    </View>
  );
});

function newArray(num: number): number[] {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(i);
  }
  return arr;
}
