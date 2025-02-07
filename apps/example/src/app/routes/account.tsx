import React from 'react';
import {View, Text, Button} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import {i18n, keys} from '@/shared/i18n';
import {useLinkTo} from '@react-navigation/native';

const AccountStack = createStackNavigator();

function Account() {
  const linkTo = useLinkTo();

  return (
    <View>
      <Text>{i18n.string(keys.account.tab)}</Text>
      <Text>{i18n.string(keys.tab.message)}</Text>
      <Button onPress={() => linkTo('/force-update')} title="open screen" />
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
