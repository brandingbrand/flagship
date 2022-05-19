import React from 'react';

import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';

import type { CommerceTypes } from '@brandingbrand/fscommerce';
import FSI18n from '@brandingbrand/fsi18n';

const styles = StyleSheet.create({
  originalPrice: {
    textDecorationLine: 'line-through',
  },
});

export interface PriceProps {
  price?: CommerceTypes.CurrencyValue;
  priceStyle?: StyleProp<TextStyle>;
  originalPrice?: CommerceTypes.CurrencyValue;
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

export const Price: React.FC<PriceProps> = React.memo((props) => {
  const { originalPrice, originalPriceFirst, originalPriceStyle, price, priceStyle } = props;
  let salePriceStyle;

  if (!price || !price.value) {
    return null;
  }

  let convertedPrice: string | undefined;
  try {
    convertedPrice = FSI18n.currency(price);
  } catch (error) {
    console.error(error);
  }

  let convertedOriginalPrice: string | undefined;
  try {
    if (originalPrice?.value.greaterThan(price.value)) {
      convertedOriginalPrice = FSI18n.currency(originalPrice);
      salePriceStyle = props.salePriceStyle;
    }
  } catch (error) {
    console.error(error);
  }

  if (!convertedPrice) {
    return null;
  }

  if (originalPriceFirst) {
    return (
      <Text>
        {convertedOriginalPrice && (
          <React.Fragment>
            <Text style={[styles.originalPrice, originalPriceStyle]}>{convertedOriginalPrice}</Text>{' '}
          </React.Fragment>
        )}
        <Text style={[priceStyle, salePriceStyle]}>{convertedPrice}</Text>
      </Text>
    );
  }
  return (
    <Text>
      <Text style={[priceStyle, salePriceStyle]}>{convertedPrice}</Text>
      {convertedOriginalPrice && (
        <React.Fragment>
          {' '}
          <Text style={[styles.originalPrice, originalPriceStyle]}>{convertedOriginalPrice}</Text>
        </React.Fragment>
      )}
    </Text>
  );
});
