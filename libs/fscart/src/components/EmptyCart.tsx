import React, { FunctionComponent, memo } from 'react';
import { Text } from 'react-native';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const EmptyCart: FunctionComponent = () => {
  return <Text>{FSI18n.string(translationKeys.flagship.cart.isEmpty)}</Text>;
};

export default memo(EmptyCart);
