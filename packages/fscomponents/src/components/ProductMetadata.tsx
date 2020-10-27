/**
 * Component to display a product's brand, title, price, and review stars.
 */
import React, { FunctionComponent, memo } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { ReviewIndicator, ReviewIndicatorProps } from './ReviewIndicator';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { Price } from './Price';

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
    lineHeight: 25
  },
  title: {
    lineHeight: 25
  },
  priceContainer: {
    flexDirection: 'row'
  },
  reviewsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  reviewCountContainer: {
    marginLeft: 5
  },
  reviewCount: {
    fontSize: 14
  },
  originalPrice: {
    lineHeight: 25,
    textDecorationLine: 'line-through',
    marginRight: 10
  },
  price: {
    lineHeight: 25
  },
  salePrice: {
    color: 'red'
  }
});

export const ProductMetadata: FunctionComponent<ProductMetadataProps> = memo((props):
  JSX.Element => {
  const renderBrand = (): JSX.Element => {
    return (
      <Text style={[styles.brand, props.brandStyle]}>{props.brand}</Text>
    );
  };
  const renderTitle = (): JSX.Element => {
    return (
      <Text style={[styles.title, props.titleStyle]}>{props.title}</Text>
    );
  };
  // tslint:disable-next-line: cyclomatic-complexity
  const renderPrice = (): JSX.Element => {
    const {
      originalPriceStyle,
      priceStyle,
      salePriceStyle,
      originalPrice,
      price
    } = props;

    return (
      <View style={styles.priceContainer}>
        <Price
          originalPriceFirst={true}
          originalPrice={originalPrice}
          price={price}
          originalPriceStyle={StyleSheet.flatten([styles.originalPrice, originalPriceStyle])}
          priceStyle={StyleSheet.flatten([styles.price, priceStyle])}
          salePriceStyle={StyleSheet.flatten([styles.salePrice, salePriceStyle])}
        />
      </View>
    );
  };
  const renderReviews = (): JSX.Element => {
    const {
      review,
      reviewCountStyle,
      reviewIndicatorProps
    } = props;

    const statsType: {[p: string ]: number } = {};
    const stats = review && review.statistics || statsType;
    const { averageRating, reviewCount } = stats;

    return (
      <View style={styles.reviewsContainer}>
        <ReviewIndicator value={averageRating} {...reviewIndicatorProps} />
        {(typeof reviewCount !== 'undefined') && (
          <View style={styles.reviewCountContainer}>
            <Text
              style={[styles.reviewCount, reviewCountStyle]}
            >
              ({reviewCount})
            </Text>
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
      {(typeof props.review !== 'undefined') && renderReviews()}
    </View>
  );
});
