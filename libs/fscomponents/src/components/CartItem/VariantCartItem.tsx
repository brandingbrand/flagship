import React from 'react';

import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import type { CommerceTypes } from '@brandingbrand/fscommerce';
import i18n, { translationKeys } from '@brandingbrand/fsi18n';

import error from '../../../assets/images/error.png';
import { palette } from '../../styles/variables';
import type { ButtonProps, SerializableFSButtonProps } from '../Button';
import { Button } from '../Button';
import { Price } from '../Price';
import type { SerializableStepperProps, StepperProps } from '../Stepper';
import { Stepper } from '../Stepper';

const variantToSelectedOptions = (item: CommerceTypes.CartItem): string[][] => {
  const variantOptions = item.variants?.find(({ id }) => id === item.productId)?.optionValues;
  const variantDetails = variantOptions?.map((selected) => {
    const option = item.options?.find((option) => option.id === selected.name);
    const name = option?.name;
    const val = option?.values.find((val) => val.value === selected.value)?.name;
    return !name || !val ? undefined : [name, val];
  });
  const details = variantDetails?.filter((detail): detail is string[] => Array.isArray(detail));

  return details || [];
};

const icons = {
  error,
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  detailLine: {
    lineHeight: 20,
    marginBottom: 2,
  },
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  itemWrapperLeft: {
    marginRight: 15,
    minWidth: 135,
  },
  itemWrapperRight: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 45,
  },
  optionValue: {
    fontWeight: '500',
  },
  outOfStockContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  outOfStockText: {
    color: palette.error,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 20,
    marginLeft: 5,
  },
  priceWrapper: {
    marginBottom: 7,
  },
  productImage: {
    height: 155,
    resizeMode: 'contain',
    width: 132,
  },
  title: {
    color: palette.onBackground,
    fontSize: 17,
    letterSpacing: 0.5,
    lineHeight: 24,
    marginBottom: 15,
  },
  wishlistButton: {
    marginTop: 7,
  },
  wishlistButtonText: {
    flexWrap: 'nowrap',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 15,
  },
});

interface BaseVariantCartItemProp extends CommerceTypes.CartItem {
  /**
   * Additional props that can be applied to the 'move to wishlist' button
   */
  wishlistButtonProps?: Partial<ButtonProps>;

  /**
   * Additional props that will be provided to the stepper
   */
  stepperProps?: Partial<StepperProps>;
  /**
   * Styles to apply to the main container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Styles to apply to the product item title
   */
  titleStyle?: StyleProp<TextStyle>;

  /**
   * Styles to apply to the left column container
   * (eg. the column with the product image and move to wishlist button)
   */
  leftColumnStyle?: StyleProp<ViewStyle>;

  /**
   * Styles to apply to the right column container
   * (eg. the column with the product details and qty stepper)
   */
  rightColumnStyle?: StyleProp<ViewStyle>;

  productImageStyle?: StyleProp<ImageStyle>;
  originalPriceStyle?: StyleProp<TextStyle>;
  priceStyle?: StyleProp<TextStyle>;

  /**
   * Text styles that will apply to the price if the item's price is less than originalPrice
   */
  salePriceStyle?: StyleProp<TextStyle>;

  /**
   * Text styles that will apply to the item variant detail label (eg. 'Size')
   */
  itemDetailLabelStyle?: StyleProp<TextStyle>;

  /**
   * Text styles that will apply to the item variant detail value (eg. 'Small')
   */
  itemDetailValueStyle?: StyleProp<TextStyle>;

  outOfStockTextStyle?: StyleProp<TextStyle>;
  stepperStyle?: StyleProp<ViewStyle>;
}

export interface VariantCartItemProps extends BaseVariantCartItemProp {
  /**
   * A function to invoke when the user wants to modify the quantity of an item in cart.
   */
  onQtyChange?: (itemId: string, qty: number) => Promise<void>;

  /**
   * A function to invoke when the user wants move the item to their wishlist.
   *
   * The move to wishlist button will only display if this is provided.
   */
  onMoveToWishlist?: (item: CommerceTypes.CartItem) => void;

  /**
   * A callback to invoke if the user taps on the image
   */
  onImagePress?: (item: CommerceTypes.CartItem) => void;
}

export interface SerializableVariantCartItemProps extends BaseVariantCartItemProp {
  wishlistButtonProps?: Partial<SerializableFSButtonProps>;
  stepperProps?: Partial<SerializableStepperProps>;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  leftColumnStyle?: ViewStyle;
  rightColumnStyle?: ViewStyle;
  productImageStyle?: ImageStyle;
  originalPriceStyle?: TextStyle;
  priceStyle?: TextStyle;
  salePriceStyle?: TextStyle;
  itemDetailLabelStyle?: TextStyle;
  itemDetailValueStyle?: TextStyle;
  outOfStockTextStyle?: TextStyle;
  stepperStyle?: ViewStyle;
}

const isOutOfStock = (item: CommerceTypes.CartItem): boolean => {
  const variant = item.variants?.find(({ id }) => id === item.productId)?.available;
  return Boolean(variant);
};

export const VariantCartItem: React.FC<VariantCartItemProps> = React.memo((props) => {
  const {
    itemDetailLabelStyle,
    itemDetailValueStyle,
    leftColumnStyle,
    onImagePress,
    onMoveToWishlist,
    onQtyChange,
    originalPriceStyle,
    outOfStockTextStyle,
    priceStyle,
    productImageStyle,
    rightColumnStyle,
    salePriceStyle,
    stepperProps,
    stepperStyle,
    style,
    titleStyle,
    wishlistButtonProps,
    ...item
  } = props;
  const onQtyChangeHandler = (qty: number) =>
    onQtyChange?.(item.itemId, qty).catch((error_) => {
      console.log(error_);
    });
  const onMoveToWishlistHandler = () => onMoveToWishlist?.(item);
  const onImagePressHandler = () => onImagePress?.(item);
  const image = item.images?.find((img) => Boolean(img.uri));

  const details = [['SKU#', item.productId], ...variantToSelectedOptions(item)];

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, titleStyle]}>{item.title}</Text>
      <View style={styles.itemWrapper}>
        <View style={[styles.itemWrapperLeft, leftColumnStyle]}>
          {image && (
            <TouchableHighlight
              disabled={Boolean(onImagePressHandler)}
              onPress={onImagePressHandler}
            >
              <Image source={image} style={[styles.productImage, productImageStyle]} />
            </TouchableHighlight>
          )}
          {Boolean(onMoveToWishlist) && (
            <Button
              color="accent"
              onPress={onMoveToWishlistHandler}
              title={i18n.string(translationKeys.flagship.cart.moveToWishlist)}
              {...wishlistButtonProps}
              style={[styles.wishlistButton, wishlistButtonProps?.style]}
              titleStyle={[styles.wishlistButtonText, wishlistButtonProps?.titleStyle]}
            />
          )}
        </View>
        <View style={[styles.itemWrapperRight, rightColumnStyle]}>
          <View>
            <View style={styles.priceWrapper}>
              <Price
                originalPrice={item.originalPrice}
                originalPriceStyle={originalPriceStyle}
                price={item.price}
                priceStyle={priceStyle}
                salePriceStyle={salePriceStyle}
              />
            </View>
            {details.map(([label, val]) => (
              <Text key={label} style={styles.detailLine}>
                <Text style={itemDetailLabelStyle}>
                  {label}
                  {': '}
                </Text>
                <Text style={[styles.optionValue, itemDetailValueStyle]}>{val}</Text>
              </Text>
            ))}
            {!isOutOfStock(item) && (
              <View style={styles.outOfStockContainer}>
                <Image source={icons.error} />
                <Text style={[styles.outOfStockText, outOfStockTextStyle]}>
                  {i18n.string(translationKeys.flagship.cart.outOfStock)}
                </Text>
              </View>
            )}
          </View>
          <Stepper
            count={item.quantity}
            countUpperLimit={item.inventory?.stock || 99}
            onChange={onQtyChangeHandler}
            stepperStyle={stepperStyle}
            {...stepperProps}
          />
        </View>
      </View>
    </View>
  );
});
