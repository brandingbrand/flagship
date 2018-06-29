/**
 * Component to display a product's brand, title, price, and review stars.
 */

import React, { Component } from 'react';

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

export class ProductMetadata extends Component<ProductMetadataProps> {
  renderBrand(): JSX.Element {
    return (
      <Text style={[styles.brand, this.props.brandStyle]}>{this.props.brand}</Text>
    );
  }

  renderTitle(): JSX.Element {
    return (
      <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
    );
  }

  renderPrice(): JSX.Element {
    const {
      originalPriceStyle,
      priceStyle,
      salePriceStyle,
      originalPrice,
      price
    } = this.props;

    const priceStyleGenerated = [
      styles.price,
      priceStyle || null,
      originalPrice && styles.salePrice || null,
      originalPrice && salePriceStyle || null
    ];

    return (
      <View style={styles.priceContainer}>
        {originalPrice && (
          <Text style={[styles.originalPrice, originalPriceStyle]}>
            {FSI18n.currency(originalPrice)}
          </Text>
        )}
        {price && (
          <View style={styles.priceContainer}>
            <Text
              style={priceStyleGenerated}
            >
              {FSI18n.currency(price)}
            </Text>
          </View>
        )}
      </View>
    );
  }

  renderReviews(): JSX.Element {
    const {
      review,
      reviewCountStyle,
      reviewIndicatorProps
    } = this.props;

    const stats = review && review.statistics || {} as any;
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
  }

  render(): JSX.Element {
    return (
      <View style={this.props.style}>
        {this.props.brand && this.renderBrand()}
        {this.props.title && this.renderTitle()}
        {(this.props.originalPrice || this.props.price) && this.renderPrice()}
        {(typeof this.props.review !== 'undefined') && this.renderReviews()}
      </View>
    );
  }
}
