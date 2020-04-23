import React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { ReviewIndicator, ReviewIndicatorProps } from './ReviewIndicator';
import { style as S } from '../styles/ReviewsSummary';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

export interface SerializableReviewsSummaryProps {
  value: number;
  count: number;
  base?: number;
  recommend?: number;
  style?: ViewStyle;
  countStyle?: TextStyle;
  averageStyle?: TextStyle;
  recommendStyle?: TextStyle;
  rowStyle?: ViewStyle;
  hideReviewIndicatorSubtitle?: boolean;
  reviewIndicatorSubtitle?: string;
  reviewIndicatorRowStyle?: ViewStyle;
  reviewIndicatorTitleText?: string;
  reviewIndicatorTitleTextStyle?: TextStyle;
}

export interface ReviewsSummaryProps extends Omit<SerializableReviewsSummaryProps,
  'style' |
  'countStyle' |
  'averageStyle' |
  'recommendStyle' |
  'rowStyle' |
  'reviewIndicatorRowStyle' |
  'reviewIndicatorTitleTextStyle'
  > {
  style?: StyleProp<ViewStyle>;
  countStyle?: StyleProp<TextStyle>;
  averageStyle?: StyleProp<TextStyle>;
  recommendStyle?: StyleProp<TextStyle>;
  rowStyle?: StyleProp<ViewStyle>;
  reviewIndicatorProps?: Partial<ReviewIndicatorProps>;
  reviewIndicatorRowStyle?: StyleProp<ViewStyle>;
  reviewIndicatorTitleTextStyle?: StyleProp<TextStyle>;
}

export const ReviewsSummary: React.FunctionComponent<ReviewsSummaryProps> = props => {
  const {
    value,
    count,
    style,
    base = 5,
    recommend,
    reviewIndicatorProps = {},
    countStyle,
    averageStyle,
    recommendStyle,
    rowStyle,
    hideReviewIndicatorSubtitle,
    reviewIndicatorSubtitle,
    reviewIndicatorRowStyle,
    reviewIndicatorTitleText,
    reviewIndicatorTitleTextStyle
  } = props;

  const numberFormatting = { maximumFractionDigits: 1 };
  const reviewIndicatorCopy = reviewIndicatorSubtitle ? reviewIndicatorSubtitle :
                  'based on ' + count + ' reviews';

  return (
    <View style={[S.container, style]}>
      <View style={[S.row, rowStyle, reviewIndicatorRowStyle]}>
        {reviewIndicatorTitleText && (
          <Text style={reviewIndicatorTitleTextStyle}>{reviewIndicatorTitleText}</Text>
        )}
        <ReviewIndicator value={value} {...reviewIndicatorProps} />
        <Text style={[S.averageStyle, averageStyle]}>
          {FSI18n.number(value, numberFormatting)} / {FSI18n.number(base, numberFormatting)}
        </Text>
      </View>
      {!hideReviewIndicatorSubtitle && (
        <View style={[S.row, rowStyle]}>
          <Text style={[S.countStyle, countStyle]}>{reviewIndicatorCopy}</Text>
        </View>
      )}
      {recommend && (
      <View style={[S.row, rowStyle]}>
        <Text style={[S.recommendStyle, recommendStyle]}>
          {FSI18n.string(translationKeys.flagship.reviews.recommendCount, {
            recommendPercent: recommend
          })}
        </Text>
      </View>
      )}
    </View>
  );
};
