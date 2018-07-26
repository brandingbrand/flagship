import React, { Component } from 'react';
import { ImageURISource, ScrollView, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ReviewIndicatorProps } from './ReviewIndicator';
import { MoreTextProps } from './MoreText';
import { ReviewItem, ReviewItemProps } from './ReviewItem';


export interface ReviewsListProps {
  reviews: import ('@brandingbrand/fscommerce').ReviewTypes.Review[];
  reviewStyle?: import ('@brandingbrand/fsfoundation').Dictionary<StyleProp<TextStyle | ViewStyle>>;

  // chidlren
  reviewIndicatorProps?: ReviewIndicatorProps;
  moreTextProps?: MoreTextProps;
  recommendedImage?: ImageURISource;
  verifiedImage?: ImageURISource;

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
      verifiedImage
    } = this.props;

    return (
      <ScrollView>
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
            />
          );
        })}
      </ScrollView>
    );
  }
}
