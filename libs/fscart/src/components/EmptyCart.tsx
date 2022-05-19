import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import { Text } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const EmptyCart: FunctionComponent = () => (
  <Text>{FSI18n.string(translationKeys.flagship.cart.isEmpty)}</Text>
);

export default memo(EmptyCart);
