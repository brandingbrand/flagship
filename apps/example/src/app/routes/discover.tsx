import React from 'react';
import {View, Text} from 'react-native';

import {i18n, keys} from '@/shared/i18n';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DiscoverSlug} from './discover.$slug';

const DiscoverStack = createNativeStackNavigator();

function Discover() {
  return (
    <View>
      <Text>{i18n.string(keys.discover.tab)}</Text>
      <Text>{i18n.string(keys.tab.message)}</Text>
    </View>
  );
}

export function DiscoverStackNavigator() {
  return (
    <DiscoverStack.Navigator>
      <DiscoverStack.Screen name="Discover" component={Discover} />
      <DiscoverStack.Screen name="DiscoverSlug" component={DiscoverSlug} />
    </DiscoverStack.Navigator>
  );
}
