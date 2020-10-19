import React, { FunctionComponent, memo } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

import { style as S } from '../styles/ReviewIndicator';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.reviews;

export interface SerializableReviewIndicatorProps {
  value: number;
  base?: number;
  style?: ViewStyle;
  itemSize?: number;
  itemColor?: string;
  emptyColor?: string;
  accessibilityLabel?: string;
  emptyStar?: boolean;
}

export interface ReviewIndicatorProps extends Omit<SerializableReviewIndicatorProps,
  'style'
  > {
  style?: StyleProp<ViewStyle>;
  renderFullStar?: () => React.ReactNode;
  renderHalfStar?: () => React.ReactNode;
  renderEmptyStar?: () => React.ReactNode;
}

export interface NormalizedValue {
  full: number;
  empty: number;
  hasHalf: boolean;
}

interface StarProps {
  style: StyleProp<TextStyle>;
  text: string;
  renderStar?: () => React.ReactNode;
}

const Star = ({ renderStar, style, text }: StarProps): JSX.Element => {
  if (renderStar) {
    return renderStar() as JSX.Element;
  }

  return <Text style={[S.star, style]}>{text}</Text>;
};
export const ReviewIndicatorInner: FunctionComponent<ReviewIndicatorProps> =
(props): JSX.Element => {

  const getItemData = (value: number, base: number = 5): NormalizedValue => {
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
  };

  const renderHalf = (): JSX.Element => {
    const customStarStyle: StyleProp<TextStyle> = {};
    const containerStarStyle: StyleProp<ViewStyle> = {};
    const starHalfRightStyle: StyleProp<TextStyle> = {};
    const { emptyStar, itemSize, itemColor } = props;

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
            text={emptyStar === true ? '☆' : '★'}
            style={[customStarStyle, S.starHalfRight,
              starHalfRightStyle, S.emptyStar, props.emptyColor ? {
                color: props.emptyColor
              } : undefined]}
          />
        </View>
      </View>
    );
  };

  const {
    value,
    base,
    emptyStar,
    itemSize,
    itemColor,
    style,
    renderFullStar,
    renderHalfStar,
    renderEmptyStar
  } = props;

  const itemData = getItemData(value, base);
  const customStarStyle: StyleProp<TextStyle> = {};

  if (itemSize) {
    customStarStyle.fontSize = itemSize;
    customStarStyle.width = itemSize;
    customStarStyle.height = itemSize * 1.2;
  }

  if (itemColor) {
    customStarStyle.color = itemColor;
  }

  const label = props.accessibilityLabel ? props.accessibilityLabel :
    props.value + FSI18n.string(componentTranslationKeys.indicatorDefault);

  return (
    <View
      style={[S.container, style]}
      accessibilityLabel={label}
    >
      {newArray(itemData.full).map(v => (
        <Star
          text='★'
          renderStar={renderFullStar}
          style={customStarStyle}
          key={v}
        />
      ))}
      {itemData.hasHalf &&
        (renderHalfStar ? renderHalfStar() : renderHalf())}
      {newArray(itemData.empty).map(v => (
        <Star
          text={emptyStar === true ? '☆' : '★'}
          renderStar={renderEmptyStar}
          style={[customStarStyle, S.emptyStar, props.emptyColor ? {
            color: props.emptyColor
          } : undefined]}
          key={v}
        />
      ))}
    </View>
  );
};

export const ReviewIndicator = memo(ReviewIndicatorInner);

function newArray(num: number): number[] {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(i);
  }
  return arr;
}
