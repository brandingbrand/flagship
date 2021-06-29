import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
// tslint:disable-next-line:no-submodule-imports
import { CurrencyValue } from '@brandingbrand/fscommerce/dist/Commerce/CommerceTypes';
import FSI18n from '@brandingbrand/fsi18n';

const styles = StyleSheet.create({
  originalPrice: {
    textDecorationLine: 'line-through'
  }
});

export interface PriceProps {
  price?: CurrencyValue;
  priceStyle?: StyleProp<TextStyle>;
  originalPrice?: CurrencyValue;
  originalPriceStyle?: StyleProp<TextStyle>;
  originalPriceFirst?: boolean;

  /**
   * salePriceStyle is only applied if `price` is less than `originalPrice`
   */
  salePriceStyle?: StyleProp<TextStyle>;
}

export interface SerializablePriceProps extends PriceProps {
  priceStyle?: TextStyle;
  originalPriceStyle?: TextStyle;
  salePriceStyle?: TextStyle;
}

export const Price: React.FC<PriceProps> = React.memo(props => {
  const {
    price,
    priceStyle,
    originalPrice,
    originalPriceStyle,
    originalPriceFirst
  } = props;
  let salePriceStyle;

  if (!price || !price.value) {
    return null;
  }

  let convertedPrice: string | undefined;
  try {
    convertedPrice = FSI18n.currency(price);
  } catch (e) {
    console.error(e);
  }

  let convertedOriginalPrice: string | undefined;
  try {
    if (originalPrice?.value?.greaterThan?.(price.value)) {
      convertedOriginalPrice = FSI18n.currency(originalPrice);
      salePriceStyle = props.salePriceStyle;
    }
  } catch (e) {
    console.error(e);
  }

  if (!convertedPrice) {
    return null;
  }

  if (originalPriceFirst) {
    return (
      <Text>
        {convertedOriginalPrice && (
          <>
            <Text style={[styles.originalPrice, originalPriceStyle]}>
              {convertedOriginalPrice}
            </Text>
            {' '}
          </>
        )}
        <Text style={[priceStyle, salePriceStyle]}>
          {convertedPrice}
        </Text>
      </Text>
    );
  } else {
    return (
      <Text>
        <Text style={[priceStyle, salePriceStyle]}>
          {convertedPrice}
        </Text>
        {convertedOriginalPrice && (
          <>
            {' '}
            <Text style={[styles.originalPrice, originalPriceStyle]}>
              {convertedOriginalPrice}
            </Text>
          </>
        )}
      </Text>
    );
  }
});
