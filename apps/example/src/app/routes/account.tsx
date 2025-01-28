import React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import {i18n, keys} from '@/shared/i18n';

const AccountStack = createStackNavigator();

function Account() {
  return (
    <View>
      <Text>{i18n.string(keys.account.tab)}</Text>
      <Text>{i18n.string(keys.tab.message)}</Text>
    </View>
  );
}

export function AccountStackNavigator() {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen name="Account" component={Account} />
    </AccountStack.Navigator>
  );
}
