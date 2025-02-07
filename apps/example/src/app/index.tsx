import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {ForceUpdateModal} from '@/pages/maintenance/ForceUpdateModal';
import {SoftUpdateModal} from '@/pages/maintenance/SoftUpdateModal';
import {MaintenanceModal} from '@/pages/maintenance/MaintenanceModal';

import {DiscoverStackNavigator} from './routes/discover';
import {ShopStackNavigator} from './routes/shop';
import {CartStackNavigator} from './routes/cart';
import {AccountStackNavigator} from './routes/account';
import {WishlistStackNavigator} from './routes/wishlist';
import {ROUTES} from './lib/constants';
import {navigationRef} from './lib/navigation';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const ModalStack = createStackNavigator<ModalStackParamList>();

function MainNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <BottomTab.Screen
        name={ROUTES.DISCOVER_STACK}
        component={DiscoverStackNavigator}
        options={{title: 'Discover'}}
      />
      <BottomTab.Screen
        name={ROUTES.SHOP_STACK}
        component={ShopStackNavigator}
        options={{title: 'Shop'}}
      />
      <BottomTab.Screen
        name={ROUTES.WISHLIST_STACK}
        component={WishlistStackNavigator}
        options={{title: 'Wishlist'}}
      />
      <BottomTab.Screen
        name={ROUTES.CART_STACK}
        component={CartStackNavigator}
        options={{title: 'Cart'}}
      />
      <BottomTab.Screen
        name={ROUTES.ACCOUNT_STACK}
        component={AccountStackNavigator}
        options={{title: 'Account'}}
      />
    </BottomTab.Navigator>
  );
}

function ModalNavigator() {
  return (
    <ModalStack.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
        cardStyle: {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
      }}>
      <ModalStack.Screen
        name={ROUTES.FORCE_UPDATE_MODAL}
        component={ForceUpdateModal}
      />
      <ModalStack.Screen
        name={ROUTES.SOFT_UPDATE_MODAL}
        component={SoftUpdateModal}
      />
      <ModalStack.Screen
        name={ROUTES.MAINTENANCE_MODAL}
        component={MaintenanceModal}
      />
    </ModalStack.Navigator>
  );
}

export function App() {
  return (
    <NavigationContainer
      ref={navigationRef}
      onUnhandledAction={action =>
        console.error('Unhandled navigation action:', action)
      }>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={ROUTES.MAIN} component={MainNavigator} />
        <Stack.Screen
          name={ROUTES.MODAL}
          component={ModalNavigator}
          options={{presentation: 'modal'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
