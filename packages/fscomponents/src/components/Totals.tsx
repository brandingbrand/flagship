import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Total, TotalProps } from './Total';

export interface SerializableTotalsProps {
  totals: TotalProps[];
  style?: ViewStyle;
}

export interface TotalsProps extends Pick<SerializableTotalsProps, 'totals'> {
  style?: StyleProp<ViewStyle>;
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
