import React, { FC, useMemo } from 'react';
import { AccessibilityRole, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

import { style as S } from '../styles/ReviewIndicator';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
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
  itemSize,
  itemColor,
  emptyStar,
  emptyColor,
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
        <Star text="★" style={[S.starHalfLeft, customStarStyle]} />
      </View>
      <View style={S.starHalfRightWrap}>
        <Star
          text={emptyStar === true ? '☆' : '★'}
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
        />
      </View>
    </View>
  );
};

const getItemData = (value: number, base: number = 5): NormalizedValue => {
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
    empty = empty - 1;
  } else {
    hasHalf = false;
    full = full + 1;
    empty = empty - 1;
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
  value,
  base,
  emptyStar,
  itemSize,
  itemColor,
  style,
  renderFullStar,
  renderHalfStar,
  renderEmptyStar,
  emptyColor,
  dataSet,
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
      style={[S.container, style]}
      accessible={accessible}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={label}
      {...{ dataSet }}
    >
      {fullStars.map((v) => (
        <Star key={v} text="★" renderStar={renderFullStar} style={customStarStyle} />
      ))}
      {itemData.hasHalf && (
        <HalfStar
          itemSize={itemSize}
          itemColor={itemColor}
          emptyStar={emptyStar}
          emptyColor={emptyColor}
          renderHalfStar={renderHalfStar}
        />
      )}
      {emptyStars.map((v) => (
        <Star
          key={v}
          text={emptyStar === true ? '☆' : '★'}
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
        />
      ))}
    </View>
  );
};
