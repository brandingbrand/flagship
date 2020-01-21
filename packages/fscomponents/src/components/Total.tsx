import React from 'react';

import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import FSI18n from '@brandingbrand/fsi18n';
type CurrencyValue = import ('@brandingbrand/fscommerce').CommerceTypes.CurrencyValue;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 3
  },
  leftColumn: {
    flex: 1
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  rightColumnText: {
    textAlign: 'right'
  }
});

export interface TotalProps {
  keyName: string | JSX.Element; // String or element for the row's key
  value: string | CurrencyValue | JSX.Element; // String or element for the row's value

  keyStyle?: StyleProp<TextStyle>; // Optional styling for the key text element
  valueStyle?: StyleProp<TextStyle>; // Optional styling for the value text element

  style?: StyleProp<ViewStyle>; // Optional styling for the entire total row
}

function isCurrency(data: JSX.Element | CurrencyValue): data is CurrencyValue {
  return !!((data as CurrencyValue).value && (data as CurrencyValue).currencyCode);
}

export const Total = React.memo((props: TotalProps): JSX.Element => {
  const renderData = (
    data: string | CurrencyValue | JSX.Element,
    style?: StyleProp<ViewStyle>): JSX.Element => {
    if (typeof data === 'string') {
      return (
        <Text style={style}>{data}</Text>
      );
    }
    if (isCurrency(data)) {
      return (
        <Text style={style}>{FSI18n.currency(data)}</Text>
      );
    }
    return data;
  };

  return (
    <View style={[styles.row, props.style]}>
      <View style={styles.leftColumn}>
        {renderData(
          props.keyName,
          [props.keyStyle]
        )}
      </View>
      <View style={styles.rightColumn}>
        {renderData(
          props.value,
          [styles.rightColumnText as StyleProp<TextStyle>, props.valueStyle]
        )}
      </View>
    </View>
  );
});
