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
import FSI18n from '@brandingbrand/fsi18n';

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
    const priceStyleGenerated = [
      styles.price,
      priceStyle || null,
      originalPrice && styles.salePrice || null,
      originalPrice && salePriceStyle || null
    ];

    let convertedPrice: string | undefined;
    try {
      if (price) {
        convertedPrice = FSI18n.currency(price);
      }
    } catch (e) {
      console.error(e);
    }

    let convertedOriginalPrice: string | undefined;
    try {
      if (originalPrice) {
        convertedOriginalPrice = FSI18n.currency(originalPrice);
      }
    } catch (e) {
      console.error(e);
    }


    return (
      <View style={styles.priceContainer}>
        {convertedOriginalPrice && (
          <Text style={[styles.originalPrice, originalPriceStyle]}>
            {convertedOriginalPrice}
          </Text>
        )}
        {price && (
          <View style={styles.priceContainer}>
            <Text
              style={priceStyleGenerated}
            >
              {convertedPrice}
            </Text>
          </View>
        )}
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
