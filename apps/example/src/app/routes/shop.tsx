import React from 'react';
import {View, Text} from 'react-native';

import {i18n, keys} from '@/shared/i18n';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const ShopStack = createNativeStackNavigator();

function Shop() {
  return (
    <View>
      <Text>{i18n.string(keys.shop.tab)}</Text>
      <Text>{i18n.string(keys.tab.message)}</Text>
    </View>
  );
}

export function ShopStackNavigator() {
  return (
    <ShopStack.Navigator>
      <ShopStack.Screen name="Shop" component={Shop} />
    </ShopStack.Navigator>
  );
}
