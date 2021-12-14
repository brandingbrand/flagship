import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { ReviewIndicator } from '../../ReviewIndicator';
import { ProductItemProps } from '../ProductItem';

const style = StyleSheet.create({
  reviewConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  reviewCountStyle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 18,
    marginLeft: 6
  }
});

export type ProductItemReviewsProps = Pick<
  ProductItemProps,
  'review' |
    'reviewStyle' |
    'reviewCountStyle' |
    'reviewIndicatorProps' |
    'renderReviews' |
    'reviewValue' |
    'reviewCount' |
    'showReviewCount'
>;

export class ProductItemReviews extends Component<ProductItemReviewsProps> {
  render(): React.ReactNode {
    const {
      review,
      reviewStyle,
      reviewCountStyle,
      reviewIndicatorProps = {},
      renderReviews,
      showReviewCount = true,
      reviewValue, // deprecated
      reviewCount  // deprecated
    } = this.props;
    const stats = review && review.statistics || {} as any;
    const avgRating = stats.averageRating || reviewValue;
    const count = stats.reviewCount || reviewCount;

    if (renderReviews) {
      return renderReviews();
    }

    if (!avgRating) {
      return null;
    }

    return (
      <View style={[style.reviewConatiner, reviewStyle]}>
        <ReviewIndicator
          value={avgRating}
          {...reviewIndicatorProps}
        />
        {showReviewCount && count && (
          <Text style={[style.reviewCountStyle, reviewCountStyle]}>
            ({count})
          </Text>
        )}
      </View>
    );
  }
}
