import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Navigator } from 'react-native-navigation';

import {
  Button,
  ProductItemProps,
  ReviewIndicator,
  Swatches
} from '@brandingbrand/fscomponents';

import PSHTMLView from './PSHTMLView';

import { color, fontSize, palette } from '../styles/variables';
import translate from '../lib/translations';

const styles = StyleSheet.create({
  twoPaneContainer: {
    flexDirection: 'row'
  },
  horizontalRightColumn: {
    flex: 1,
    marginLeft: 10
  },
  horizontalTitleContainer: {
    marginBottom: 10
  },
  title: {
    fontSize: 15,
    fontWeight: '600'
  },
  promo: {
    fontStyle: 'italic',
    fontSize: fontSize.small,
    color: palette.secondary
  },
  centerHorizontal: {
    justifyContent: 'center'
  },
  brand: {
    fontSize: 11,
    color: color.gray
  },
  verticalDetailsContainer: {
    marginTop: 10
  },
  verticalSwatches: {
    marginBottom: 10
  },
  verticalPriceContainer: {
    marginBottom: -10
  },
  verticalPromosContainer: {
    marginTop: 10,
    marginBottom: 0
  },
  verticalSpacing: {
    marginBottom: 5
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain'
  },
  imageContainer: {
    alignItems: 'center'
  },
  imagePane: {
    width: 105,
    paddingRight: 15
  },
  variantText: {
    fontSize: fontSize.small
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 0,
    marginBottom: 2
  },
  reviewCountStyle: {
    fontSize: 10,
    marginLeft: 5,
    lineHeight: 18
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10
  },
  salePrice: {
    marginLeft: 5
  },
  badge: {
    fontSize: 10,
    color: palette.accent,
    fontWeight: 'bold'
  },
  textAlignCenter: {
    textAlign: 'center'
  },
  textAlignLeft: {
    textAlign: 'left'
  },
  id: {
    fontSize: 11,
    textAlign: 'center'
  },
  iconBarWrapper: {
    paddingBottom: 10
  },
  iconBar: {
    paddingTop: 6,
    flexDirection: 'row'
  },
  iconBarImage: {
    width: 13,
    height: 13,
    marginRight: 6
  },
  iconBarTextWrapper: {
    flex: 1
  },
  iconBarText: {
    fontSize: 11,
    fontStyle: 'italic'
  },
  row: {
    flexDirection: 'row'
  },
  originalPrice: {
    fontSize: 13,
    color: color.gray,
    textDecorationLine: 'line-through',
    paddingRight: 10
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.secondary
  },
  savings: {
    fontSize: 11,
    fontWeight: '500',
    color: color.red,
    paddingTop: 5
  },
  signInLink: {
    color: palette.primary
  }
});

export interface PSProductItemProps extends ProductItemProps {
  navigator?: Navigator;
  id: string;
  description?: string;
  savings?: string;
  shipsDate?: string;
  freeShipping?: boolean;
  memberPricing?: boolean;
  badge?: string;
  badgeStyle?: any;
  renderBadge?: () => JSX.Element;
  priceContainerStyle?: any;
  priceStyle?: any;
  priceTextStyle?: any;
  promosContainerStyle?: any;
  format?: string;
}

export interface PSProductItemState {
  isVertical: boolean;
  alignStyle: any;
}

export default class PSProductItem extends Component<
  PSProductItemProps,
  PSProductItemState
> {
  defaultButtonProps: any = {
    variables: {
      color: {
        primary: palette.accent
      }
    }
  };

  constructor(props: PSProductItemProps) {
    super(props);

    const { format } = this.props;
    const isVertical = !!format && format.indexOf('vertical') > -1;

    this.state = {
      isVertical,
      alignStyle: isVertical ? styles.textAlignCenter : styles.textAlignLeft
    };
  }

  // Allow the parent component to toggle between vertical and horizontal format
  // while the component is mounted
  componentWillReceiveProps(newProps: PSProductItemProps): void {
    if (newProps.format !== this.props.format) {
      const { format } = newProps;
      const isVertical = !!format && format.indexOf('vertical') > -1;

      this.setState({
        isVertical,
        alignStyle: isVertical ? styles.textAlignCenter : styles.textAlignLeft
      });
    }
  }

  renderImage = () => {
    const { image, imageStyle, imageContainerStyle, renderImage } = this.props;

    if (!image) {
      return null;
    }

    if (renderImage) {
      return renderImage();
    }

    return (
      <View style={[styles.imageContainer, imageContainerStyle]}>
        <Image source={image} style={[styles.image, imageStyle]} />
      </View>
    );
  }

  renderBadge = () => {
    const { alignStyle } = this.state;
    const { badge, badgeStyle, renderBadge } = this.props;

    if (renderBadge) {
      return renderBadge();
    }

    if (!badge) {
      return null;
    }

    return (
      <Text style={[styles.badge, alignStyle, badgeStyle]}>
        {badge.toUpperCase()}
      </Text>
    );
  }

  renderTitle = () => {
    const { alignStyle } = this.state;
    const { renderTitle, title, titleStyle } = this.props;

    if (renderTitle) {
      return renderTitle();
    }

    if (!title) {
      return null;
    }

    return <Text style={[styles.title, alignStyle, titleStyle]}>{title}</Text>;
  }

  renderPromos = () => {
    const { alignStyle } = this.state;
    const {
      promos,
      promoStyle,
      promoContainerStyle,
      renderPromos
    } = this.props;

    if (renderPromos) {
      return renderPromos();
    }

    if (!promos || !promos.length) {
      return null;
    }

    return (
      <View style={promoContainerStyle}>
        {promos.map((p, i) => (
          <Text key={i} style={[styles.promo, alignStyle, promoStyle]}>
            {p}
          </Text>
        ))}
      </View>
    );
  }

  renderBrand = () => {
    const { alignStyle } = this.state;
    const { brand, brandStyle, renderBrand } = this.props;

    if (renderBrand) {
      return renderBrand();
    }

    if (!brand) {
      return null;
    }

    return (
      <Text style={[styles.brand, alignStyle, brandStyle]}>
        {brand.toUpperCase()}
      </Text>
    );
  }

  renderSwatches = () => {
    const {
      swatchItems,
      swatchStyle,
      swatchesProps,
      renderSwatches
    } = this.props;

    if (renderSwatches) {
      return renderSwatches();
    }

    if (!swatchItems) {
      return null;
    }

    return (
      <Swatches items={swatchItems} style={swatchStyle} {...swatchesProps} />
    );
  }

  renderVariantText = () => {
    const { alignStyle } = this.state;
    const { variantText, variantTextStyle, renderVariantText } = this.props;

    if (renderVariantText) {
      return renderVariantText();
    }

    if (!variantText) {
      return null;
    }

    return (
      <Text style={[styles.variantText, alignStyle, variantTextStyle]}>
        {variantText}
      </Text>
    );
  }

  renderReviews = () => {
    const {
      reviewStyle,
      reviewValue,
      reviewCount,
      reviewCountStyle,
      reviewIndicatorProps = {},
      renderReviews
    } = this.props;

    if (renderReviews) {
      return renderReviews();
    }

    if (!reviewValue) {
      return null;
    }

    return (
      <View style={[styles.reviewContainer, reviewStyle]}>
        <ReviewIndicator value={reviewValue} {...reviewIndicatorProps} />
        {reviewCount && (
          <Text style={[styles.reviewCountStyle, reviewCountStyle]}>
            ({reviewCount})
          </Text>
        )}
      </View>
    );
  }

  renderPrice = () => {
    const {
      price,
      originalPrice,
      originalPriceStyle,
      renderPrice,
      priceStyle,
      priceTextStyle
    } = this.props;

    if (renderPrice) {
      return renderPrice();
    }

    if (!price) {
      return null;
    }

    return (
      <View style={[styles.row, { alignItems: 'center' }, priceStyle]}>
        {!!originalPrice && (
          <Text style={[styles.originalPrice, originalPriceStyle]}>
            {translate.currency(originalPrice, 'USD')}
          </Text>
        )}
        {price &&
          <Text style={[styles.price, priceTextStyle]}>
            {translate.currency(price, 'USD')}
          </Text>
        }
      </View>
    );
  }

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

    if (!buttonText) {
      return null;
    }

    return (
      <Button
        title={buttonText}
        style={buttonStyle}
        titleStyle={buttonTextStyle}
        onPress={onButtonPress}
        {...this.defaultButtonProps}
        {...buttonProps}
      />
    );
  }

  renderHorizontalList = () => {
    const {
      contentStyle,
      description,
      onPress,
      style,
      title
    } = this.props;

    return (
      <TouchableOpacity
        accessibilityLabel={title}
        onPress={onPress}
        style={style}
      >
        <View>{this.renderBadge()}</View>
        <View style={styles.horizontalTitleContainer}>
          {this.renderTitle()}
        </View>
        <View style={styles.twoPaneContainer}>
          <View style={styles.imagePane}>
            {this.renderImage()}
          </View>
          <View style={[styles.horizontalRightColumn, contentStyle]}>
            {this.renderBrand()}
            {this.renderPrice()}
            {this.renderReviews()}
            {this.renderPromos()}
            <PSHTMLView
              html={description || ''}
              collapseWhiteSpace={true}
              stylesheet={{
                b: {
                  fontWeight: '700'
                },
                div: {
                  fontSize: 13
                },
                li: {
                  fontSize: 12,
                  lineHeight: 18
                }
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderVerticalTopSwatches = () => {
    const {
      contentStyle,
      style,
      onPress,
      extraElement = null,
      title,
      priceContainerStyle,
      promosContainerStyle
    } = this.props;

    return (
      <TouchableOpacity
        accessibilityLabel={title}
        style={style}
        onPress={onPress}
      >
        {this.renderImage()}
        <View style={[styles.verticalDetailsContainer, contentStyle]}>
          <View style={styles.verticalSwatches}>{this.renderSwatches()}</View>
          <View style={styles.verticalSpacing}>{this.renderBadge()}</View>
          <View style={styles.verticalSpacing}>{this.renderBrand()}</View>
          <View style={styles.verticalSpacing}>{this.renderTitle()}</View>
          <View style={[styles.verticalPriceContainer, priceContainerStyle]}>
            {this.renderPrice()}
          </View>
          <View style={styles.verticalSpacing}>{this.renderReviews()}</View>
          <View style={[styles.verticalPromosContainer, promosContainerStyle]}>
            {this.renderVariantText()}
            {this.renderPromos()}
          </View>
          {extraElement}
        </View>
        {this.renderButton()}
      </TouchableOpacity>
    );
  }

  render(): JSX.Element {
    const { isVertical } = this.state;
    if (isVertical) {
      return this.renderVerticalTopSwatches();
    }

    return this.renderHorizontalList();
  }
}
