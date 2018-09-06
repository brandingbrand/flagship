import React, { Component } from 'react';
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

export interface ReviewsSummaryProps {
  value: number;
  count: number;
  base?: number;
  recommend?: number;
  style?: StyleProp<ViewStyle>;
  countStyle?: StyleProp<TextStyle>;
  averageStyle?: StyleProp<TextStyle>;
  recommendStyle?: StyleProp<TextStyle>;
  rowStyle?: StyleProp<ViewStyle>;
  reviewIndicatorProps?: ReviewIndicatorProps;
  hideReviewIndicatorSubtitle?: boolean;
  reviewIndicatorSubtitle?: string;
  reviewIndicatorRowStyle?: StyleProp<ViewStyle>;
  reviewIndicatorTitleText?: string;
  reviewIndicatorTitleTextStyle?: StyleProp<TextStyle>;
}

export class ReviewsSummary extends Component<ReviewsSummaryProps> {
  render(): JSX.Element {
    const {
      value,
      count,
      style,
      base= 5,
      recommend,
      reviewIndicatorProps= {},
      countStyle,
      averageStyle,
      recommendStyle,
      rowStyle,
      hideReviewIndicatorSubtitle,
      reviewIndicatorSubtitle,
      reviewIndicatorRowStyle,
      reviewIndicatorTitleText,
      reviewIndicatorTitleTextStyle
    } = this.props;

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
              recommendPercent: FSI18n.percent(recommend)
            })}
          </Text>
        </View>
        )}
      </View>
    );
  }
}
