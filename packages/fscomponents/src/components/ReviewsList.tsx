import React, { Component } from 'react';
import { ImageURISource, ScrollView, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ReviewIndicatorProps } from './ReviewIndicator';
import { MoreTextProps } from './MoreText';
import { ReviewItem, ReviewItemProps } from './ReviewItem';

export interface SerializableReviewsListProps {
  recommendedImage?: ImageURISource;
  verifiedImage?: ImageURISource;
}

export interface ReviewsListProps extends SerializableReviewsListProps {
  reviews: import ('@brandingbrand/fscommerce').ReviewTypes.Review[];
  reviewStyle?: import ('@brandingbrand/fsfoundation').Dictionary<StyleProp<TextStyle | ViewStyle>>;
  reviewItemProps?: Partial<ReviewItemProps>;

  // chidlren
  reviewIndicatorProps?: Partial<ReviewIndicatorProps>;
  moreTextProps?: MoreTextProps;

  // actions
  onHelpful?: (props: ReviewItemProps) => void;
  onNotHelpful?: (props: ReviewItemProps) => void;
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
