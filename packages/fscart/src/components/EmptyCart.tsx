import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

export default class EmptyCart extends PureComponent {
  render(): JSX.Element {
    return <Text>{FSI18n.string(translationKeys.flagship.cart.isEmpty)}</Text>;
  }
}
