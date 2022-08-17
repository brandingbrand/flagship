import type { FC } from 'react';
import React, { useMemo } from 'react';

import type { AccessibilityRole, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Text, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { style as S } from '../styles/ReviewIndicator';

const componentTranslationKeys = translationKeys.flagship.reviews;

export interface ReviewIndicatorProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityHint?: string;

  value: number;
  base?: number;
  itemSize?: number;
  itemColor?: string;
  emptyColor?: string;
  emptyStar?: boolean;
  style?: StyleProp<ViewStyle>;
  renderFullStar?: () => React.ReactNode;
  renderHalfStar?: () => React.ReactNode;
  renderEmptyStar?: () => React.ReactNode;

  dataSet?: Record<string, ''>;
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

interface HalfStarProps {
  itemSize?: number;
  itemColor?: string;
  emptyStar?: boolean;
  emptyColor?: string;

  renderHalfStar?: () => React.ReactNode;
}

const HalfStar: FC<HalfStarProps> = ({
  emptyColor,
  emptyStar,
  itemColor,
  itemSize,
  renderHalfStar,
}) => {
  const customStarStyle = useMemo<StyleProp<TextStyle>>(
    () => ({
      ...(itemSize ? { fontSize: itemSize, width: itemSize, height: itemSize * 1.2 } : {}),
      ...(itemColor ? { color: itemColor } : {}),
    }),
    [itemColor, itemSize]
  );
  const containerStarStyle = useMemo<StyleProp<TextStyle>>(
    () => ({
      ...(itemSize ? { width: itemSize, height: itemSize * 1.2 } : {}),
    }),
    [itemSize]
  );
  const starHalfRightStyle = useMemo<StyleProp<TextStyle>>(
    () => ({
      ...(itemSize ? { marginLeft: -itemSize / 2 } : {}),
    }),
    [itemSize]
  );

  if (renderHalfStar) {
    return renderHalfStar() as JSX.Element;
  }

  return (
    <View style={[S.halfStarContainer, containerStarStyle]}>
      <View style={S.starHalfLeftWrap}>
        <Star style={[S.starHalfLeft, customStarStyle]} text="★" />
      </View>
      <View style={S.starHalfRightWrap}>
        <Star
          style={[
            customStarStyle,
            S.starHalfRight,
            starHalfRightStyle,
            S.emptyStar,
            emptyColor
              ? {
                  color: emptyColor,
                }
              : undefined,
          ]}
          text={emptyStar === true ? '☆' : '★'}
        />
      </View>
    </View>
  );
};

const getItemData = (value: number, base = 5): NormalizedValue => {
  if (value >= base) {
    return {
      full: base,
      empty: 0,
      hasHalf: false,
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
    empty -= 1;
  } else {
    hasHalf = false;
    full += 1;
    empty -= 1;
  }

  return {
    full,
    empty,
    hasHalf,
  };
};

const newArray = (num: number): number[] => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(i);
  }

  return arr;
};

export const ReviewIndicator: FC<ReviewIndicatorProps> = ({
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole,
  accessible,
  base,
  dataSet,
  emptyColor,
  emptyStar,
  itemColor,
  itemSize,
  renderEmptyStar,
  renderFullStar,
  renderHalfStar,
  style,
  value,
}): JSX.Element => {
  const itemData = useMemo(() => getItemData(value, base), [base, value]);
  const fullStars = useMemo(() => newArray(itemData.full), [itemData.full]);
  const emptyStars = useMemo(() => newArray(itemData.empty), [itemData.empty]);

  const customStarStyle = useMemo<StyleProp<TextStyle>>(
    () => ({
      ...(itemSize ? { fontSize: itemSize, width: itemSize, height: itemSize * 1.2 } : {}),
      ...(itemColor ? { color: itemColor } : {}),
    }),
    [itemColor, itemSize]
  );

  const label = accessibilityLabel
    ? accessibilityLabel
    : value + FSI18n.string(componentTranslationKeys.indicatorDefault);

  return (
    <View
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
      style={[S.container, style]}
      {...{ dataSet }}
    >
      {fullStars.map((v) => (
        <Star key={v} renderStar={renderFullStar} style={customStarStyle} text="★" />
      ))}
      {itemData.hasHalf ? (
        <HalfStar
          emptyColor={emptyColor}
          emptyStar={emptyStar}
          itemColor={itemColor}
          itemSize={itemSize}
          renderHalfStar={renderHalfStar}
        />
      ) : null}
      {emptyStars.map((v) => (
        <Star
          key={v}
          renderStar={renderEmptyStar}
          style={[
            customStarStyle,
            S.emptyStar,
            emptyColor
              ? {
                  color: emptyColor,
                }
              : undefined,
          ]}
          text={emptyStar === true ? '☆' : '★'}
        />
      ))}
    </View>
  );
};
