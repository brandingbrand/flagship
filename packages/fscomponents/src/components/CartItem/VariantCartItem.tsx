import React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle
} from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { Button, ButtonProps } from '../Button';
import { Stepper, StepperProps } from '../Stepper';
import { Price } from '../Price';
import i18n, { translationKeys } from '@brandingbrand/fsi18n';
import { palette } from '../../styles/variables';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 30
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 0.5,
    color: palette.onBackground,
    marginBottom: 15
  },
  productImage: {
    resizeMode: 'contain',
    width: 132,
    height: 155
  },
  wishlistButton: {
    marginTop: 7
  },
  wishlistButtonText: {
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 15,
    letterSpacing: 0.5,
    flexWrap: 'nowrap'
  },
  itemWrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  itemWrapperLeft: {
    marginRight: 15,
    minWidth: 135
  },
  itemWrapperRight: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 45
  },
  optionValue: {
    fontWeight: '500'
  },
  outOfStockContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5
  },
  outOfStockText: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
    color: palette.error,
    marginLeft: 5
  },
  priceWrapper: {
    marginBottom: 7
  },
  detailLine: {
    lineHeight: 20,
    marginBottom: 2
  }
});

const icons = {
  error: require('../../../assets/images/error.png')
};

export interface SerializableVariantCartItemProps {
  /**
   * Additional props that can be applied to the 'move to wishlist' button
   */
  wishlistButtonProps?: Partial<ButtonProps>;

  /**
   * Styles to apply to the main container
   */
  style?: ViewStyle;

  /**
   * Styles to apply to the product item title
   */
  titleStyle?: TextStyle;

  /**
   * Styles to apply to the left column container
   * (eg. the column with the product image and move to wishlist button)
   */
  leftColumnStyle?: ViewStyle;

  /**
   * Styles to apply to the right column container
   * (eg. the column with the product details and qty stepper)
   */
  rightColumnStyle?: ViewStyle;

  productImageStyle?: ImageStyle;
  originalPriceStyle?: TextStyle;
  priceStyle?: TextStyle;

  /**
   * Text styles that will apply to the price if the item's price is less than originalPrice
   */
  salePriceStyle?: TextStyle;

  /**
   * Text styles that will apply to the item variant detail label (eg. 'Size')
   */
  itemDetailLabelStyle?: TextStyle;

  /**
   * Text styles that will apply to the item variant detail value (eg. 'Small')
   */
  itemDetailValueStyle?: TextStyle;

  outOfStockTextStyle?: TextStyle;
  stepperStyle?: ViewStyle;

  /**
   * Additional props that will be provided to the stepper
   */
  stepperProps?: Partial<StepperProps>;
}

export interface VariantCartItemProps extends
  SerializableVariantCartItemProps,
  CommerceTypes.CartItem {
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

const isOutOfStock = (item: CommerceTypes.CartItem): boolean => {
  const variant = item.variants?.find(({ id }) => id === item.productId)?.available;
  return !!variant;
};

export const VariantCartItem: React.FC<VariantCartItemProps> = React.memo(props => {
  const {
    onQtyChange,
    onMoveToWishlist,
    onImagePress,
    wishlistButtonProps,
    style,
    titleStyle,
    leftColumnStyle,
    rightColumnStyle,
    productImageStyle,
    originalPriceStyle,
    priceStyle,
    salePriceStyle,
    itemDetailLabelStyle,
    itemDetailValueStyle,
    outOfStockTextStyle,
    stepperStyle,
    stepperProps,
    ...item
   } = props;
  const onQtyChangeHandler = (qty: number) => {
    return onQtyChange?.(item.itemId, qty).catch(e => console.log(e));
  };
  const onMoveToWishlistHandler = () => onMoveToWishlist?.(item);
  const onImagePressHandler = () => onImagePress?.(item);
  const image = item.images?.find(img => !!img.uri);

  const details = [
    ['SKU#', item.productId],
    ...variantToSelectedOptions(item)
  ];

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, titleStyle]}>
        {item.title}
      </Text>
      <View style={styles.itemWrapper}>
        <View style={[styles.itemWrapperLeft, leftColumnStyle]}>
          {image && (
            <TouchableHighlight
              disabled={!!onImagePressHandler}
              onPress={onImagePressHandler}
            >
              <Image
                source={image}
                style={[styles.productImage, productImageStyle]}
              />
            </TouchableHighlight>
          )}
          {!!onMoveToWishlist && (
            <Button
              onPress={onMoveToWishlistHandler}
              title={i18n.string(translationKeys.flagship.cart.moveToWishlist)}
              color={'accent'}
              titleStyle={styles.wishlistButtonText}
              style={styles.wishlistButton}
              {...wishlistButtonProps}
            />
          )}
        </View>
        <View style={[styles.itemWrapperRight, rightColumnStyle]}>
          <View>
            <View style={styles.priceWrapper}>
              <Price
                price={item.price}
                originalPrice={item.originalPrice}
                originalPriceStyle={originalPriceStyle}
                priceStyle={priceStyle}
                salePriceStyle={salePriceStyle}
              />
            </View>
            {details.map(([label, val]) => (
              <Text
                key={label}
                style={styles.detailLine}
              >
                <Text style={itemDetailLabelStyle}>{label}{': '}</Text>
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
            countUpperLimit={item.inventory?.stock}
            onChange={onQtyChangeHandler}
            stepperStyle={stepperStyle}
            {...stepperProps}
          />
        </View>
      </View>
    </View>
  );
});

function variantToSelectedOptions(item: CommerceTypes.CartItem): string[][] {
  const variantOptions = item.variants?.find(({ id }) => id === item.productId)?.optionValues;
  const variantDetails = variantOptions?.map(selected => {
    const option = item.options?.find(option => option.id === selected.name);
    const name = option?.name;
    const val = option?.values.find(val => val.value === selected.value)?.name;
    return !name || !val ? undefined : [name, val];
  });
  const details = variantDetails?.filter((detail): detail is string[] => Array.isArray(detail));

  return details || [];
}
