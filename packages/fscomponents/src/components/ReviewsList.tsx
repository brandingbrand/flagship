import React, { Component } from 'react';
import { ImageURISource, ScrollView, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Dictionary } from '@brandingbrand/fsfoundation';
import { ReviewIndicatorProps, SerializableReviewIndicatorProps } from './ReviewIndicator';
import { MoreTextProps, SerializableMoreTextProps } from './MoreText';
import { ReviewItem, ReviewItemProps, SerializableReviewItemProps } from './ReviewItem';

export interface ReviewsListProps {
  reviews: import ('@brandingbrand/fscommerce').ReviewTypes.Review[];
  reviewStyle?: Dictionary<StyleProp<TextStyle | ViewStyle>>;
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

export interface SerializableReviewsListProps extends Omit<
  ReviewsListProps,
  'onHelpful' | 'onNotHelpful'
> {
  reviewStyle?: Dictionary<TextStyle | ViewStyle>;
  reviewItemProps?: Partial<SerializableReviewItemProps>;
  reviewIndicatorProps?: Partial<SerializableReviewIndicatorProps>;
  moreTextProps?: SerializableMoreTextProps;
}

export class ReviewsList extends Component<ReviewsListProps> {
  render(): JSX.Element {
    const {
      reviews,
      reviewStyle,
      onHelpful,
      onNotHelpful,
      reviewIndicatorProps,
      moreTextProps,
      recommendedImage,
      verifiedImage,
      reviewItemProps
    } = this.props;

    return (
      <ScrollView
        style={{
          flexBasis: 'auto'
        }}
      >
        {reviews.map((review, key) => {
          return (
            <ReviewItem
              key={key}
              {...review}
              {...reviewStyle}
              recommendedImage={recommendedImage}
              verifiedImage={verifiedImage}
              reviewIndicatorProps={reviewIndicatorProps}
              moreTextProps={moreTextProps}
              onHelpful={onHelpful}
              onNotHelpful={onNotHelpful}
              {...reviewItemProps}
            />
          );
        })}
      </ScrollView>
    );
  }
}
