import React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import {i18n, keys} from '@/shared/i18n';

const CartStack = createStackNavigator();

function Cart() {
  return (
    <View>
      <Text>{i18n.string(keys.cart.tab)}</Text>
      <Text>{i18n.string(keys.tab.message)}</Text>
    </View>
  );
}

export function CartStackNavigator() {
  return (
    <CartStack.Navigator>
      <CartStack.Screen name="Cart" component={Cart} />
    </CartStack.Navigator>
  );
}
