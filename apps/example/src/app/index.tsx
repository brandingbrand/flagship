import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import {DiscoverStackNavigator} from './routes/discover';
import {ShopStackNavigator} from './routes/shop';
import {CartStackNavigator} from './routes/cart';
import {AccountStackNavigator} from './routes/account';
import {WishlistStackNavigator} from './routes/wishlist';
import {createStackNavigator} from '@react-navigation/stack';

import {ForceUpdateModal} from '@/pages/maintenance/ForceUpdateModal';
import {SoftUpdateModal} from '@/pages/maintenance/SoftUpdateModal';
import {MaintenanceModal} from '@/pages/maintenance/MaintenanceModal';

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

export function App() {
  return (
    <NavigationContainer
      onUnhandledAction={action =>
        console.error('Unhandled navigation action:', action)
      }>
      <BottomTab.Navigator>
        <BottomTab.Screen
          name="DiscoverStack"
          component={DiscoverStackNavigator}
          options={{headerShown: false, title: 'Discover'}}
        />
        <BottomTab.Screen
          name="ShopStack"
          component={ShopStackNavigator}
          options={{headerShown: false, title: 'Shop'}}
        />
        <BottomTab.Screen
          name="WishlistStack"
          component={WishlistStackNavigator}
          options={{headerShown: false, title: 'Wishlist'}}
        />
        <BottomTab.Screen
          name="CartStack"
          component={CartStackNavigator}
          options={{headerShown: false, title: 'Cart'}}
        />
        <BottomTab.Screen
          name="AccountStack"
          component={AccountStackNavigator}
          options={{headerShown: false, title: 'Account'}}
        />
      </BottomTab.Navigator>
      <Stack.Navigator screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name="ForceUpdateModal" component={ForceUpdateModal} />
        <Stack.Screen name="SoftUpdateModal" component={SoftUpdateModal} />
        <Stack.Screen name="MaintenanceModal" component={MaintenanceModal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
