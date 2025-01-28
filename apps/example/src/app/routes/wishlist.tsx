import React from 'react';
import {View, Text} from 'react-native';

import {i18n, keys} from '@/shared/i18n';
import {createStackNavigator} from '@react-navigation/stack';

const WishlistStack = createStackNavigator();

function Wishlist() {
  return (
    <View>
      <Text>{i18n.string(keys.wishlist.tab)}</Text>
      <Text>{i18n.string(keys.tab.message)}</Text>
    </View>
  );
}

export function WishlistStackNavigator() {
  return (
    <WishlistStack.Navigator>
      <WishlistStack.Screen name="Wishlist" component={Wishlist} />
    </WishlistStack.Navigator>
  );
}
