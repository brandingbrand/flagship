import React, { Component } from 'react';

import type { ImageStyle, ImageURISource, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { TouchableWithoutFeedback, View } from 'react-native';

import type { CommerceTypes } from '@brandingbrand/fscommerce';

import { style as S } from '../../styles/ProductItem';
import type { ButtonProps } from '../Button';
import type { ReviewIndicatorProps } from '../ReviewIndicator';
import type { SwatchItemType, SwatchesProps } from '../Swatches';

import {
  ProductItemBrand,
  ProductItemButton,
  ProductItemImage,
  ProductItemPrice,
  ProductItemPromos,
  ProductItemReviews,
  ProductItemSwatches,
  ProductItemTitle,
  ProductItemVariant,
} from './components';

export interface ProductItemProps extends CommerceTypes.Product {
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  brandStyle?: StyleProp<TextStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
  priceStyle?: StyleProp<TextStyle>;
  originalPriceStyle?: StyleProp<TextStyle>;
  salePriceStyle?: StyleProp<TextStyle>;
  promoContainerStyle?: StyleProp<ViewStyle>;
  promoStyle?: StyleProp<TextStyle>;
  variantText?: string;
  variantTextStyle?: StyleProp<TextStyle>;
  reviewStyle?: StyleProp<ViewStyle>;
  reviewCountStyle?: StyleProp<TextStyle>;
  reviewIndicatorProps?: Partial<ReviewIndicatorProps>;
  extraElement?: JSX.Element;
  swatchItems?: SwatchItemType[];
  swatchStyle?: StyleProp<ViewStyle>;
  swatchesProps?: SwatchesProps;

  /**
   * @deprecated you probably want FSCommerce's "promotions"
   */
  promos?: string[];
  /**
   * @deprecated you probably want FSCommerce's "images"
   */
  image?: ImageURISource;
  /**
   * @deprecated you probably want FSCommerce's "reviews"
   */
  reviewValue?: number;
  /**
   * @deprecated you probably want FSCommerce's "reviews"
   */
  reviewCount?: number;
  showReviewCount?: boolean;

  // button
  buttonText?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  buttonProps?: Partial<ButtonProps>;
  onButtonPress?: () => void;
  renderButton?: () => React.ReactNode;

  // fav button
  onFavButtonPress?: () => void;
  favButtonImage?: ImageURISource;
  renderFavButton?: () => React.ReactNode;

  // custom render
  renderPrice?: () => React.ReactNode;
  renderPromos?: () => React.ReactNode;
  renderTitle?: () => React.ReactNode;
  renderVariantText?: () => React.ReactNode;
  renderBrand?: () => React.ReactNode;
  renderImage?: () => React.ReactNode;
  renderReviews?: () => React.ReactNode;
  renderSwatches?: () => React.ReactNode;

  // hide components
  hidePrice?: boolean;
  hidePromos?: boolean;
  hideTitle?: boolean;
  hideVariantText?: boolean;
  hideBrand?: boolean;
  hideImage?: boolean;
  hideReviews?: boolean;
  hideSwatches?: boolean;
  hideButton?: boolean;

  // orientation
  orientation?: 'horizontal' | 'vertical';
}

export class ProductItem extends Component<ProductItemProps> {
  // eslint-disable-next-line max-lines-per-function
  public render(): JSX.Element {
    const {
      brand,
      brandStyle,
      buttonProps,
      buttonStyle,
      buttonText,
      buttonTextStyle,
      contentStyle,
      extraElement = null,
      hideBrand,
      hideButton, // deprecated
      hideImage,
      hidePrice,
      hidePromos,
      hideReviews,
      hideSwatches,
      hideTitle,
      hideVariantText,
      image,
      imageContainerStyle,
      imageStyle,
      images,
      onButtonPress,
      onPress,
      orientation = 'vertical',
      originalPrice,
      originalPriceStyle,
      price,
      priceStyle,
      promoContainerStyle,
      promoStyle,
      promos,
      promotions,
      renderBrand,
      renderButton, // deprecated
      renderImage,
      renderPrice,
      renderPromos,
      renderReviews,
      renderSwatches,
      renderTitle,
      renderVariantText,
      review,
      reviewCountStyle,
      reviewIndicatorProps,
      reviewStyle,
      salePriceStyle,
      style,
      swatchItems,
      swatchStyle,
      swatchesProps,
      title,
      titleStyle,
      variantText,
      variantTextStyle,
    } = this.props;

    const isHorizontal = orientation === 'horizontal';
    let {
      reviewCount, // deprecated
      reviewValue, // deprecated
    } = this.props;

    if (review) {
      if (review.summary) {
        reviewValue = review.summary.averageRating;
        reviewCount = review.summary.reviewCount;
      } else if (review.statistics) {
        reviewValue = review.statistics.averageRating;
        reviewCount = review.statistics.reviewCount;
      }
    }

    return (
      <TouchableWithoutFeedback accessibilityLabel={title} onPress={onPress}>
        <View style={style}>
          <View style={isHorizontal ? S.horizontalListContainer : null}>
            <View style={isHorizontal ? S.horizontalLeft : null}>
              {!hideImage && (
                <ProductItemImage
                  image={image}
                  imageContainerStyle={imageContainerStyle}
                  imageStyle={imageStyle}
                  images={images}
                  renderImage={renderImage}
                />
              )}
              {!hideVariantText && (
                <ProductItemVariant
                  renderVariantText={renderVariantText}
                  variantText={variantText}
                  variantTextStyle={variantTextStyle}
                />
              )}
            </View>
            <View style={[isHorizontal ? S.horizontalRight : null, contentStyle]}>
              {!hideSwatches && (
                <ProductItemSwatches
                  renderSwatches={renderSwatches}
                  swatchItems={swatchItems}
                  swatchStyle={swatchStyle}
                  swatchesProps={swatchesProps}
                />
              )}
              {!hideBrand && (
                <ProductItemBrand brand={brand} brandStyle={brandStyle} renderBrand={renderBrand} />
              )}
              {!hideTitle && (
                <ProductItemTitle renderTitle={renderTitle} title={title} titleStyle={titleStyle} />
              )}
              {!hidePrice && (
                <ProductItemPrice
                  originalPrice={originalPrice}
                  originalPriceStyle={originalPriceStyle}
                  price={price}
                  priceStyle={priceStyle}
                  renderPrice={renderPrice}
                  salePriceStyle={salePriceStyle}
                />
              )}
              {!hideReviews && (
                <ProductItemReviews
                  renderReviews={renderReviews}
                  review={review}
                  reviewCount={reviewCount}
                  reviewCountStyle={reviewCountStyle}
                  reviewIndicatorProps={reviewIndicatorProps}
                  reviewStyle={reviewStyle}
                  reviewValue={reviewValue}
                />
              )}
              {!hidePromos && (
                <ProductItemPromos
                  promoContainerStyle={promoContainerStyle}
                  promoStyle={promoStyle}
                  promos={promos}
                  promotions={promotions}
                  renderPromos={renderPromos}
                />
              )}
              {extraElement}
            </View>
          </View>
          <View>
            {!hideButton && (
              <ProductItemButton
                buttonStyle={buttonStyle}
                buttonText={buttonText}
                buttonTextStyle={buttonTextStyle}
                onButtonPress={onButtonPress}
                renderButton={renderButton}
                {...buttonProps}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
