import React, { PureComponent } from 'react';

import Svg, { Line } from 'react-native-svg';
import { StyleProp, View, ViewStyle } from 'react-native';

export interface NavArrowProps {
  height?: number;
  width?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export class NavArrow extends PureComponent<NavArrowProps> {
  private kDefaultHeight: number = 16;
  private kDefaultWidth: number = 10;
  private kDefaultColor: string = 'black';
  private kDefaultStrokeWidth: number = 1;

  render(): JSX.Element {
    const {
      height = this.kDefaultHeight,
      width = this.kDefaultWidth,
      color = this.kDefaultColor,
      strokeWidth = this.kDefaultStrokeWidth
    } = this.props;

    if (height % 2 !== 0) {
      console.warn(`NavArrow component: height should be an even number; provided ${height}`);
    }

    const intersectY = Math.round(height / 2);

    return (
      <View style={this.props.style}>
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
  }
}
