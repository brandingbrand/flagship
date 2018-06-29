import React, { Component } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { MultiCarousel } from '@brandingbrand/fscomponents';
import PSProductItem, { PSProductItemProps } from './PSProductItem';
import { color, fontSize } from '../styles/variables';

const styles = StyleSheet.create({
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
    fontWeight: 'normal',
    fontSize: 13
  },
  productPriceText: {
    fontSize: 15
  },
  productPrice: {
    justifyContent: 'center',
    marginTop: 5
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
    color: color.red,
    fontSize: fontSize.small,
    fontStyle: 'normal'
  },
  promosContainer: {
    marginTop: 5
  }
});

export interface PSProductCarouselProps {
  style?: StyleProp<ViewStyle>;
  items: PSProductItemProps[];
}

export default class PSProductCarousel extends Component<
  PSProductCarouselProps
> {
  render(): JSX.Element {
    return (
      <MultiCarousel
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

  renderItem = (item: PSProductItemProps) => {
    return (
      <View style={styles.item}>
        <PSProductItem
          format='verticalTopSwatches'
          titleStyle={styles.productTitle}
          priceStyle={styles.productPrice}
          priceTextStyle={styles.productPriceText}
          priceContainerStyle={styles.priceContainer}
          reviewStyle={styles.reviews}
          promoStyle={styles.promoText}
          promosContainerStyle={styles.promosContainer}
          reviewIndicatorProps={{ itemSize: 15 } as any}
          {...item}
        />
      </View>
    );
  }
}
