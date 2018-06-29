import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { ProductItemProps } from './ProductItemProps';
import { style as S } from '../../styles/ProductItem';
import {
  ProductItemBrand,
  ProductItemImage,
  ProductItemPrice,
  ProductItemPromos,
  ProductItemReviews,
  ProductItemTitle,
  ProductItemVariant
} from './components';

export class ProductItemHorizontalList extends Component<ProductItemProps> {
  render(): JSX.Element {
    const {
      style,
      contentStyle,
      onPress,
      extraElement = null,
      title,
      images,
      imageStyle,
      imageContainerStyle,
      renderImage,
      image, // deprecated
      variantText,
      variantTextStyle,
      renderVariantText,
      brand,
      brandStyle,
      renderBrand,
      titleStyle,
      renderTitle,
      review,
      reviewStyle,
      reviewCountStyle,
      reviewIndicatorProps,
      renderReviews,
      reviewValue, // deprecated
      reviewCount,  // deprecated
      price,
      originalPrice,
      priceStyle,
      originalPriceStyle,
      salePriceStyle,
      renderPrice,
      promotions,
      promoStyle,
      promoContainerStyle,
      renderPromos,
      promos // deprecated
    } = this.props;

    return (
      <TouchableWithoutFeedback
        accessibilityLabel={title}
        onPress={onPress}
      >
        <View style={[S.horizontalListContainer, style]}>
          <View style={S.horizontalLeft}>
            <ProductItemImage
              images={images}
              imageStyle={imageStyle}
              imageContainerStyle={imageContainerStyle}
              renderImage={renderImage}
              image={image}
            />
          </View>
          <View style={[S.horizontalRight, contentStyle]}>
            <ProductItemBrand
              brand={brand}
              brandStyle={brandStyle}
              renderBrand={renderBrand}
            />
            <ProductItemTitle
              title={title}
              titleStyle={titleStyle}
              renderTitle={renderTitle}
            />
            <ProductItemReviews
              review={review}
              reviewStyle={reviewStyle}
              reviewCountStyle={reviewCountStyle}
              reviewIndicatorProps={reviewIndicatorProps}
              renderReviews={renderReviews}
              reviewValue={reviewValue}
              reviewCount={reviewCount}
            />
            <ProductItemPrice
              price={price}
              originalPrice={originalPrice}
              priceStyle={priceStyle}
              originalPriceStyle={originalPriceStyle}
              salePriceStyle={salePriceStyle}
              renderPrice={renderPrice}
            />
            <ProductItemVariant
              variantText={variantText}
              variantTextStyle={variantTextStyle}
              renderVariantText={renderVariantText}
            />
            <ProductItemPromos
              promotions={promotions}
              promoStyle={promoStyle}
              promoContainerStyle={promoContainerStyle}
              renderPromos={renderPromos}
              promos={promos}
            />
            {extraElement}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
