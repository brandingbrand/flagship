import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { ProductItemProps } from './ProductItemProps';
import {
  ProductItemBrand,
  ProductItemImage,
  ProductItemPrice,
  ProductItemPromos,
  ProductItemReviews,
  ProductItemSwatches,
  ProductItemTitle,
  ProductItemVariant
} from './components';

export class ProductItemVerticalTopSwatches extends Component<ProductItemProps> {
  render(): JSX.Element {
    const {
      style,
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
      promos, // deprecated
      swatchItems,
      swatchStyle,
      swatchesProps,
      renderSwatches
    } = this.props;

    return (
      <TouchableWithoutFeedback
        accessibilityLabel={title}
        onPress={onPress}
      >
        <View style={style}>
          <ProductItemImage
            images={images}
            imageStyle={imageStyle}
            imageContainerStyle={imageContainerStyle}
            renderImage={renderImage}
            image={image}
          />
          <ProductItemSwatches
            swatchItems={swatchItems}
            swatchStyle={swatchStyle}
            swatchesProps={swatchesProps}
            renderSwatches={renderSwatches}
          />
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
      </TouchableWithoutFeedback>
    );
  }
}
