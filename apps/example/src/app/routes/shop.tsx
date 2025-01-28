import React from 'react';
import {View, Text} from 'react-native';

import {i18n, keys} from '@/shared/i18n';

export function Shop() {
  return (
    <View>
      <Text>{i18n.string(keys.shop.tab)}</Text>
      <Text>{i18n.string(keys.tab.message)}</Text>
    </View>
  );
}
