import React, { Component } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import {
  MultiCarousel,
  ProductItem,
  ProductItemProps
} from '@brandingbrand/fscomponents';
import { fontSize, palette } from '../styles/variables';

const styles = StyleSheet.create({
  brandText: {
    color: palette.secondary
  },
  container: {},
  item: {
    marginLeft: 15
  },
  pageIndicator: {
    display: 'none'
  },
  dotStyle: {
    marginHorizontal: 5
  },
  productTitle: {
    color: palette.secondary,
    fontWeight: 'normal',
    fontSize: 13
  },
  productPriceText: {
    fontSize: 15
  },
  productPrice: {
    justifyContent: 'center',
    marginTop: 5,
    color: palette.secondary
  },
  priceContainer: {
    marginBottom: 0
  },
  reviews: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  },
  promoText: {
    color: palette.accent,
    fontSize: fontSize.small,
    fontStyle: 'normal'
  },
  promosContainer: {
    marginTop: 5
  }
});

export interface PSProductCarouselProps {
  style?: StyleProp<ViewStyle>;
  items: ProductItemProps[];
}

export default class PSProductCarousel extends Component<
  PSProductCarouselProps
  > {
  render(): JSX.Element {
    return (
      <MultiCarousel
        brandStyle={styles.brandText}
        buttonProps={{ palette }}
        itemsPerPage={2}
        peekSize={50}
        style={[styles.container, this.props.style]}
        items={this.props.items}
        pageIndicatorStyle={styles.pageIndicator}
        dotStyle={styles.dotStyle}
        renderItem={this.renderItem}
      />
    );
  }

  renderItem = (item: ProductItemProps) => {
    return (
      <View style={styles.item}>
        <ProductItem
          titleStyle={styles.productTitle}
          priceStyle={styles.productPrice}
          reviewStyle={styles.reviews}
          promoStyle={styles.promoText}
          buttonProps={{ palette }}
          promoContainerStyle={styles.promosContainer}
          reviewIndicatorProps={{ itemSize: 15 } as any}
          {...item}
        />
      </View>
    );
  }
}
