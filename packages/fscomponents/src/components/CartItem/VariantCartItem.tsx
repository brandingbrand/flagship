import React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle
} from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { Button, ButtonProps, SerializableButtonProps } from '../Button';
import { SerializableStepperProps, Stepper, StepperProps } from '../Stepper';
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
  wishlistButtonProps?: Partial<SerializableButtonProps>;
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
              {...wishlistButtonProps}
              titleStyle={[styles.wishlistButtonText, wishlistButtonProps?.titleStyle]}
              style={[styles.wishlistButton, wishlistButtonProps?.style]}
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
