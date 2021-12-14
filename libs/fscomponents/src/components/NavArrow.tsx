import React, { FunctionComponent, memo } from 'react';

import Svg, { Line } from 'react-native-svg';
import { StyleProp, View, ViewStyle } from 'react-native';

export interface NavArrowProps {
  height?: number;
  width?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export const NavArrow: FunctionComponent<NavArrowProps> = memo((props): JSX.Element => {
  const kDefaultHeight: number = 16;
  const kDefaultWidth: number = 10;
  const kDefaultColor: string = 'black';
  const kDefaultStrokeWidth: number = 1;

  const {
    height = kDefaultHeight,
    width = kDefaultWidth,
    color = kDefaultColor,
    strokeWidth = kDefaultStrokeWidth
  } = props;

  if (height % 2 !== 0) {
    console.warn(`NavArrow component: height should be an even number; provided ${height}`);
  }

  const intersectY = Math.round(height / 2);

  return (
    <View style={props.style}>
      <Svg height={height} width={width}>
        <Line
          x1={0}
          x2={width}
          y1={0}
          y2={intersectY}
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Line
          x1={0}
          x2={width}
          y1={height}
          y2={intersectY}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </Svg>
    </View>
  );
});
