import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { ReviewIndicatorProps } from './ReviewIndicator';
import { MoreTextProps } from './MoreText';
import { ReviewItem, ReviewItemProps } from './ReviewItem';


export interface ReviewsListProps {
  reviews: any;
  reviewStyle?: any;

  // chidlren
  reviewIndicatorProps?: ReviewIndicatorProps;
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
      moreTextProps
    } = this.props;

    return (
      <ScrollView>
        {reviews.map((review: any, key: number) => {
          return (
            <ReviewItem
              key={key}
              {...review}
              {...reviewStyle}
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
