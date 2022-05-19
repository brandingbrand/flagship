import React from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

import FSI18n from '@brandingbrand/fsi18n';

type CurrencyValue = import('@brandingbrand/fscommerce').CommerceTypes.CurrencyValue;

const styles = StyleSheet.create({
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  rightColumnText: {
    textAlign: 'right',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 3,
    paddingTop: 3,
  },
});

export interface SerializableTotalProps {
  keyName: JSX.Element | string; // String or element for the row's key
  value: CurrencyValue | JSX.Element | string; // String or element for the row's value

  keyStyle?: TextStyle; // Optional styling for the key text element
  valueStyle?: TextStyle; // Optional styling for the value text element

  style?: ViewStyle; // Optional styling for the entire total row
}

export interface TotalProps extends Pick<SerializableTotalProps, 'keyName' | 'value'> {
  keyStyle?: StyleProp<TextStyle>; // Optional styling for the key text element
  valueStyle?: StyleProp<TextStyle>; // Optional styling for the value text element
  leftColumnStyle?: StyleProp<ViewStyle>;
  rightColumnStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>; // Optional styling for the entire total row
}

const isCurrency = (data: CurrencyValue | JSX.Element): data is CurrencyValue =>
  Boolean((data as CurrencyValue).value && (data as CurrencyValue).currencyCode);

const TotalInner = (props: TotalProps): JSX.Element => {
  const renderData = (
    data: CurrencyValue | JSX.Element | string,
    style?: StyleProp<ViewStyle>
  ): JSX.Element => {
    if (typeof data === 'string') {
      return <Text style={style}>{data}</Text>;
    }
    if (isCurrency(data)) {
      let convertedTotal: string | undefined;
      try {
        convertedTotal = FSI18n.currency(data);
      } catch (error) {
        console.error(error);
      }
      return <Text style={style}>{convertedTotal}</Text>;
    }
    return data;
  };

  return (
    <View style={[styles.row, props.style]}>
      <View style={[styles.leftColumn, props.leftColumnStyle]}>
        {renderData(props.keyName, [props.keyStyle])}
      </View>
      <View style={[styles.rightColumn, props.rightColumnStyle]}>
        {renderData(props.value, [
          styles.rightColumnText as StyleProp<TextStyle>,
          props.valueStyle,
        ])}
      </View>
    </View>
  );
};

export const Total = React.memo(TotalInner);
