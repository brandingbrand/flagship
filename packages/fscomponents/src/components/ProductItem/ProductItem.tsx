import React, { Component } from 'react';
import {
  ImageStyle,
  ImageURISource,
  StyleProp,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';

import { CommerceTypes } from '@brandingbrand/fscommerce';
import { ButtonProps } from '../Button';
import { ReviewIndicatorProps } from '../ReviewIndicator';
import { SwatchesProps, SwatchItemType } from '../Swatches';

import {
  ProductItemBrand,
  ProductItemButton,
  ProductItemImage,
  ProductItemPrice,
  ProductItemPromos,
  ProductItemReviews,
  ProductItemSwatches,
  ProductItemTitle,
  ProductItemVariant
} from './components';

import { style as S } from '../../styles/ProductItem';

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
  reviewIndicatorProps?: ReviewIndicatorProps;
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
  orientation?: 'vertical' | 'horizontal';
}

export class ProductItem extends Component<ProductItemProps> {

  // tslint:disable cyclomatic-complexity
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
      renderSwatches,
      hidePrice,
      hidePromos,
      hideTitle,
      hideVariantText,
      hideBrand,
      hideImage,
      hideReviews,
      hideSwatches,
      hideButton,
      buttonText,
      buttonStyle,
      buttonTextStyle,
      buttonProps,
      onButtonPress,
      renderButton,
      orientation = 'vertical'
    } = this.props;

    const isHorizontal = (orientation === 'horizontal');
    let {
      reviewCount, // deprecated
      reviewValue // deprecated
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
      <TouchableWithoutFeedback
        accessibilityLabel={title}
        onPress={onPress}
      >
        <View style={style}>
          <View style={isHorizontal ? S.horizontalListContainer : null}>
            <View style={isHorizontal ? S.horizontalLeft : null}>
              {!hideImage && <ProductItemImage
                images={images}
                imageStyle={imageStyle}
                imageContainerStyle={imageContainerStyle}
                renderImage={renderImage}
                image={image}
              />}
              {!hideVariantText && <ProductItemVariant
                variantText={variantText}
                variantTextStyle={variantTextStyle}
                renderVariantText={renderVariantText}
              />}
            </View>
            <View style={[isHorizontal ? S.horizontalRight : null, contentStyle]}>
              {!hideSwatches && <ProductItemSwatches
                swatchItems={swatchItems}
                swatchStyle={swatchStyle}
                swatchesProps={swatchesProps}
                renderSwatches={renderSwatches}
              />}
              {!hideBrand && <ProductItemBrand
                brand={brand}
                brandStyle={brandStyle}
                renderBrand={renderBrand}
              />}
              {!hideTitle && <ProductItemTitle
                title={title}
                titleStyle={titleStyle}
                renderTitle={renderTitle}
              />}
              {!hidePrice && <ProductItemPrice
                price={price}
                originalPrice={originalPrice}
                priceStyle={priceStyle}
                originalPriceStyle={originalPriceStyle}
                salePriceStyle={salePriceStyle}
                renderPrice={renderPrice}
              />}
              {!hideReviews && <ProductItemReviews
                review={review}
                reviewStyle={reviewStyle}
                reviewCountStyle={reviewCountStyle}
                reviewIndicatorProps={reviewIndicatorProps}
                renderReviews={renderReviews}
                reviewValue={reviewValue}
                reviewCount={reviewCount}
              />}
              {!hidePromos && <ProductItemPromos
                promotions={promotions}
                promoStyle={promoStyle}
                promoContainerStyle={promoContainerStyle}
                renderPromos={renderPromos}
                promos={promos}
              />}
              {extraElement}
            </View>
          </View>
          <View>
            {!hideButton && <ProductItemButton
              buttonText={buttonText}
              buttonStyle={buttonStyle}
              buttonTextStyle={buttonTextStyle}
              onButtonPress={onButtonPress}
              renderButton={renderButton}
              {...buttonProps}
            />}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
