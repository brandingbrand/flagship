import React from 'react';
import {View, Text} from 'react-native';

import {i18n, keys} from '@/shared/i18n';

export function DiscoverSlug() {
  return (
    <View>
      <Text>{i18n.string(keys.discover.tab)}</Text>
      <Text>{i18n.string(keys.tab.message)}</Text>
    </View>
  );
}
