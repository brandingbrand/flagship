import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Button } from '../Button';
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

export class ProductItemVerticalAction extends Component<ProductItemProps> {
  renderButton = () => {
    const {
      buttonText,
      buttonStyle,
      buttonTextStyle,
      buttonProps,
      onButtonPress,
      renderButton
    } = this.props;

    if (renderButton) {
      return renderButton();
    }

    if (!buttonText || !onButtonPress) {
      return null;
    }

    return (
      <Button
        title={buttonText}
        style={buttonStyle}
        titleStyle={buttonTextStyle}
        onPress={onButtonPress}
        {...buttonProps}
      />
    );
  }

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
          <View style={contentStyle}>
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
            <ProductItemSwatches
              swatchItems={swatchItems}
              swatchStyle={swatchStyle}
              swatchesProps={swatchesProps}
              renderSwatches={renderSwatches}
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
            {this.renderButton()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
