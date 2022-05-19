/**
 * Component to display a product's brand, title, price, and review stars.
 */
import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

import type { CommerceTypes } from '@brandingbrand/fscommerce';

import { Price } from './Price';
import type { ReviewIndicatorProps } from './ReviewIndicator';
import { ReviewIndicator } from './ReviewIndicator';

export interface ProductMetadataProps extends CommerceTypes.Product {
  style?: StyleProp<ViewStyle>;
  brandStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  reviewCountStyle?: StyleProp<TextStyle>;
  reviewIndicatorProps?: ReviewIndicatorProps;
  priceStyle?: StyleProp<TextStyle>;
  salePriceStyle?: StyleProp<TextStyle>;
  originalPriceStyle?: StyleProp<TextStyle>;
}

const styles = StyleSheet.create({
  brand: {
    lineHeight: 25,
  },
  originalPrice: {
    lineHeight: 25,
    marginRight: 10,
    textDecorationLine: 'line-through',
  },
  price: {
    lineHeight: 25,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  reviewCount: {
    fontSize: 14,
  },
  reviewCountContainer: {
    marginLeft: 5,
  },
  reviewsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  salePrice: {
    color: 'red',
  },
  title: {
    lineHeight: 25,
  },
});

export const ProductMetadata: FunctionComponent<ProductMetadataProps> = memo(
  (props): JSX.Element => {
    const renderBrand = (): JSX.Element => (
      <Text style={[styles.brand, props.brandStyle]}>{props.brand}</Text>
    );
    const renderTitle = (): JSX.Element => (
      <Text style={[styles.title, props.titleStyle]}>{props.title}</Text>
    );
    const renderPrice = (): JSX.Element => {
      const { originalPrice, originalPriceStyle, price, priceStyle, salePriceStyle } = props;

      return (
        <View style={styles.priceContainer}>
          <Price
            originalPrice={originalPrice}
            originalPriceFirst
            originalPriceStyle={StyleSheet.flatten([styles.originalPrice, originalPriceStyle])}
            price={price}
            priceStyle={StyleSheet.flatten([styles.price, priceStyle])}
            salePriceStyle={StyleSheet.flatten([styles.salePrice, salePriceStyle])}
          />
        </View>
      );
    };
    const renderReviews = (): JSX.Element => {
      const { review, reviewCountStyle, reviewIndicatorProps } = props;

      const statsType: Record<string, number> = {};
      const stats = (review && review.statistics) || statsType;
      const { averageRating, reviewCount } = stats;

      return (
        <View style={styles.reviewsContainer}>
          <ReviewIndicator value={averageRating} {...reviewIndicatorProps} />
          {typeof reviewCount !== 'undefined' && (
            <View style={styles.reviewCountContainer}>
              <Text style={[styles.reviewCount, reviewCountStyle]}>({reviewCount})</Text>
            </View>
          )}
        </View>
      );
    };
    return (
      <View style={props.style}>
        {props.brand && renderBrand()}
        {props.title && renderTitle()}
        {(props.originalPrice || props.price) && renderPrice()}
        {typeof props.review !== 'undefined' && renderReviews()}
      </View>
    );
  }
);
