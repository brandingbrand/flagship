import React, { Component } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Total, TotalProps } from './Total';

export interface TotalsProps {
  totals: TotalProps[];
  style?: StyleProp<ViewStyle>;
}

export class Totals extends Component<TotalsProps> {
  render(): JSX.Element {
    const { style, totals } = this.props;

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
  }
}
