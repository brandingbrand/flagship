import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

export interface NavArrowProps {
  height?: number;
  width?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export const NavArrow: FunctionComponent<NavArrowProps> = memo((props): JSX.Element => {
  const kDefaultHeight = 16;
  const kDefaultWidth = 10;
  const kDefaultColor = 'black';
  const kDefaultStrokeWidth = 1;

  const {
    height = kDefaultHeight,
    width = kDefaultWidth,
    color = kDefaultColor,
    strokeWidth = kDefaultStrokeWidth,
  } = props;

  if (height % 2 !== 0) {
    console.warn(`NavArrow component: height should be an even number; provided ${height}`);
  }

  const intersectY = Math.round(height / 2);

  return (
    <View style={props.style}>
      <Svg height={height} width={width}>
        <Line stroke={color} strokeWidth={strokeWidth} x1={0} x2={width} y1={0} y2={intersectY} />
        <Line
          stroke={color}
          strokeWidth={strokeWidth}
          x1={0}
          x2={width}
          y1={height}
          y2={intersectY}
        />
      </Svg>
    </View>
  );
});
