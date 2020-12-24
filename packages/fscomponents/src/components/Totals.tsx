import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { SerializableTotalProps, Total, TotalProps } from './Total';

export interface TotalsProps {
  totals: TotalProps[];
  style?: StyleProp<ViewStyle>;
}

export interface SerializableTotalsProps extends TotalsProps {
  totals: SerializableTotalProps[];
  style?: ViewStyle;
}

export const Totals: React.FunctionComponent<TotalsProps> = props => {
  const { style, totals } = props;

  return (
    <View style={style}>
      {totals.map((total: TotalProps, index: number) => {
        return (
          <Total
            key={typeof total.keyName === 'string' ? total.keyName : index}
            {...total}
          />
        );
      })}
    </View>
  );
};
