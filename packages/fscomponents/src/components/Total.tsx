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

export interface SerializableTotalProps {
  keyName: string | JSX.Element; // String or element for the row's key
  value: string | CurrencyValue | JSX.Element; // String or element for the row's value

  keyStyle?: TextStyle; // Optional styling for the key text element
  valueStyle?: TextStyle; // Optional styling for the value text element

  style?: ViewStyle; // Optional styling for the entire total row
}

export interface TotalProps extends Pick<SerializableTotalProps, 'keyName' | 'value'> {
  keyStyle?: StyleProp<TextStyle>; // Optional styling for the key text element
  valueStyle?: StyleProp<TextStyle>; // Optional styling for the value text element

  style?: StyleProp<ViewStyle>; // Optional styling for the entire total row
}

function isCurrency(data: JSX.Element | CurrencyValue): data is CurrencyValue {
  return !!((data as CurrencyValue).value && (data as CurrencyValue).currencyCode);
}

const TotalInner = (props: TotalProps): JSX.Element => {
  const renderData = (
    data: string | CurrencyValue | JSX.Element,
    style?: StyleProp<ViewStyle>): JSX.Element => {
    if (typeof data === 'string') {
      return (
        <Text style={style}>{data}</Text>
      );
    }
    if (isCurrency(data)) {
      let convertedTotal: string | undefined;
      try {
        convertedTotal = FSI18n.currency(data);
      } catch (e) {
        console.error(e);
      }
      return (
        <Text style={style}>{convertedTotal}</Text>
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
};

export const Total = React.memo(TotalInner);
