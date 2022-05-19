import React, { Component } from 'react';

import type { ImageURISource, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native';

import type { MoreTextProps } from './MoreText';
import type { ReviewIndicatorProps } from './ReviewIndicator';
import type { ReviewItemProps } from './ReviewItem';
import { ReviewItem } from './ReviewItem';

export interface ReviewsListProps {
  reviews: Array<import('@brandingbrand/fscommerce').ReviewTypes.Review>;
  reviewStyle?: Record<string, StyleProp<TextStyle | ViewStyle>>;
  reviewItemProps?: Partial<ReviewItemProps>;

  recommendedImage?: ImageURISource;
  verifiedImage?: ImageURISource;

  // chidlren
  reviewIndicatorProps?: Partial<ReviewIndicatorProps>;
  moreTextProps?: MoreTextProps;

  // actions
  onHelpful?: (props: ReviewItemProps) => void;
  onNotHelpful?: (props: ReviewItemProps) => void;
}

export class ReviewsList extends Component<ReviewsListProps> {
  public render(): JSX.Element {
    const {
      moreTextProps,
      onHelpful,
      onNotHelpful,
      recommendedImage,
      reviewIndicatorProps,
      reviewItemProps,
      reviewStyle,
      reviews,
      verifiedImage,
    } = this.props;

    return (
      <ScrollView
        style={{
          flexBasis: 'auto',
        }}
      >
        {reviews.map((review, key) => (
          <ReviewItem
            key={key}
            {...review}
            {...reviewStyle}
            moreTextProps={moreTextProps}
            onHelpful={onHelpful}
            onNotHelpful={onNotHelpful}
            recommendedImage={recommendedImage}
            reviewIndicatorProps={reviewIndicatorProps}
            verifiedImage={verifiedImage}
            {...reviewItemProps}
          />
        ))}
      </ScrollView>
    );
  }
}
