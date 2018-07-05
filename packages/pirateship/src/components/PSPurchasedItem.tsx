import React, { Component } from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { border, color, fontSize, padding, palette } from '../styles/variables';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import translate, { translationKeys } from '../lib/translations';

const styles = StyleSheet.create({
  container: {
    borderTopColor: border.color,
    borderTopWidth: 1,
    paddingTop: padding.base,
    paddingRight: padding.base,
    marginTop: padding.base
  },
  itemHeader: {
    fontWeight: 'bold'
  },
  itemDetailsContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  productImage: {
    height: 80,
    width: 80,
    marginRight: padding.base
  },
  itemDetails: {
    flexGrow: 1
  },
  skuText: {
    fontSize: fontSize.small,
    color: color.gray,
    lineHeight: fontSize.large
  },
  qtyTotalPriceRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  purchasedQtyText: {
    fontWeight: 'bold',
    lineHeight: fontSize.large
  },
  totalItemPriceText: {
    fontWeight: 'bold',
    color: palette.secondary,
    lineHeight: fontSize.large
  },
  unitPrice: {
    fontWeight: 'bold',
    lineHeight: fontSize.large
  }
});

export interface PSPurchasedItemProps {
  item: CommerceTypes.ProductItem;
  containerStyle?: StyleProp<ViewStyle>;
  itemHeaderStyle?: StyleProp<TextStyle>;
  itemDetailsContainerStyle?: StyleProp<ViewStyle>;
  productImageStyle?: StyleProp<ImageStyle>;
  itemDetailsStyle?: StyleProp<ViewStyle>;
  skuTextStyle?: StyleProp<TextStyle>;
  unitPriceStyle?: StyleProp<TextStyle>;
  qtyTotalPriceRowStyle?: StyleProp<ViewStyle>;
  purchasedQtyTextStyle?: StyleProp<TextStyle>;
  totalItemPriceTextStyle?: StyleProp<TextStyle>;
}

export default class PSPurchasedItem extends Component<PSPurchasedItemProps> {
  render(): JSX.Element {
    const {
      item,
      containerStyle,
      itemHeaderStyle,
      itemDetailsContainerStyle,
      productImageStyle,
      itemDetailsStyle,
      skuTextStyle,
      unitPriceStyle,
      qtyTotalPriceRowStyle,
      purchasedQtyTextStyle,
      totalItemPriceTextStyle
    } = this.props;

    const image = (item.images || []).find(img => !!img.uri);
    return (
      <View
        style={[styles.container, containerStyle]}
      >
        <Text style={[styles.itemHeader, itemHeaderStyle]}>{item.title}</Text>
        <View style={[styles.itemDetailsContainer, itemDetailsContainerStyle]}>
          { image && (
            <Image
              source={image}
              resizeMode={'contain'}
              style={[styles.productImage, productImageStyle]}
            />
          )}
          <View style={[styles.itemDetails, itemDetailsStyle]}>
            <Text style={[styles.skuText, skuTextStyle]}>
              {translate.string(translationKeys.item.sku)}: {item.productId}
            </Text>
            {item.price && <Text style={[styles.unitPrice, unitPriceStyle]}>
              {translate.currency(item.price)}
            </Text>}
            <View style={[styles.qtyTotalPriceRow, qtyTotalPriceRowStyle]}>
              <Text style={[styles.purchasedQtyText, purchasedQtyTextStyle]}>
              {translate.string(translationKeys.item.qty)}: {item.quantity}
              </Text>
              {item.totalPrice &&
                <Text style={[styles.totalItemPriceText, totalItemPriceTextStyle]}>
                  {translate.currency(item.totalPrice)}
                </Text>
              }
            </View>
          </View>
        </View>
      </View>
    );
  }
}
