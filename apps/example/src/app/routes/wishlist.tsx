import React from 'react';
import {View, Text} from 'react-native';

import {i18n, keys} from '@/shared/i18n';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const WishlistStack = createNativeStackNavigator();

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
