import React from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import type { SerializableTotalProps, TotalProps } from './Total';
import { Total } from './Total';

export interface TotalsProps {
  totals: TotalProps[];
  style?: StyleProp<ViewStyle>;
}

export interface SerializableTotalsProps extends TotalsProps {
  totals: SerializableTotalProps[];
  style?: ViewStyle;
}

export const Totals: React.FunctionComponent<TotalsProps> = (props) => {
  const { style, totals } = props;

  return (
    <View style={style}>
      {totals.map((total: TotalProps, index: number) => (
        <Total key={typeof total.keyName === 'string' ? total.keyName : index} {...total} />
      ))}
    </View>
  );
};
