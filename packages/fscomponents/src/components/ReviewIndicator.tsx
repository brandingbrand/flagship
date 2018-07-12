import React, { PureComponent } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { style as S } from '../styles/ReviewIndicator';

export interface ReviewIndicatorProps {
  value: number;
  base?: number;
  style?: StyleProp<ViewStyle>;
  itemSize?: number;
  itemColor?: string;
  renderFullStar?: () => React.ReactNode;
  renderHalfStar?: () => React.ReactNode;
  renderEmptyStar?: () => React.ReactNode;
}

export interface NormalizedValue {
  full: number;
  empty: number;
  hasHalf: boolean;
}

const Star = ({ renderStar, style, text }: any) => {
  if (renderStar) {
    return renderStar();
  }

  return <Text style={[S.star, style]}>{text}</Text>;
};

export class ReviewIndicator extends PureComponent<ReviewIndicatorProps> {
  getItemData = (value: number, base: number = 5): NormalizedValue => {
    if (value >= base) {
      return {
        full: base,
        empty: 0,
        hasHalf: false
      };
    }

    let full = Math.floor(value);
    const decimal = value - full;
    let empty = base - full;
    let hasHalf = false;

    if (decimal < 0.25) {
      hasHalf = false;
    } else if (decimal >= 0.25 && decimal <= 0.75) {
      hasHalf = true;
      empty = empty - 1;
    } else {
      hasHalf = false;
      full = full + 1;
      empty = empty - 1;
    }

    return {
      full,
      empty,
      hasHalf
    };
  }

  renderHalf = (): JSX.Element => {
    const { itemSize, itemColor } = this.props;
    const customStarStyle: any = {};
    const containerStarStyle: any = {};
    const starHalfRightStyle: any = {};

    if (itemSize) {
      customStarStyle.fontSize = itemSize;
      customStarStyle.width = itemSize;
      customStarStyle.height = itemSize * 1.2;
      containerStarStyle.width = itemSize;
      containerStarStyle.height = itemSize * 1.2;
      starHalfRightStyle.marginLeft = -itemSize / 2;
    }
    if (itemColor) {
      customStarStyle.color = itemColor;
    }

    return (
      <View style={[S.halfStarContainer, containerStarStyle]}>
        <View style={S.starHalfLeftWrap}>
          <Star text='★' style={[S.starHalfLeft, customStarStyle]} />
        </View>
        <View style={S.starHalfRightWrap}>
          <Star
            text='★'
            style={[S.starHalfRight, S.emptyStar, customStarStyle, starHalfRightStyle]}
          />
        </View>
      </View>
    );
  }

  render(): JSX.Element {
    const {
      value,
      base,
      itemSize,
      itemColor,
      style,
      renderFullStar,
      renderHalfStar,
      renderEmptyStar
    } = this.props;

    const itemData = this.getItemData(value, base);
    const customStarStyle: any = {};

    if (itemSize) {
      customStarStyle.fontSize = itemSize;
      customStarStyle.width = itemSize;
      customStarStyle.height = itemSize * 1.2;
    }

    if (itemColor) {
      customStarStyle.color = itemColor;
    }

    return (
      <View style={[S.container, style]}>
        {newArray(itemData.full).map(v => (
          <Star
            text='★'
            renderStar={renderFullStar}
            style={customStarStyle}
            key={v}
          />
        ))}
        {itemData.hasHalf &&
          (renderHalfStar ? renderHalfStar() : this.renderHalf())}
        {newArray(itemData.empty).map(v => (
          <Star
            text='★'
            renderStar={renderEmptyStar}
            style={[S.emptyStar, customStarStyle]}
            key={v}
          />
        ))}
      </View>
    );
  }
}

function newArray(num: number): number[] {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(i);
  }
  return arr;
}
