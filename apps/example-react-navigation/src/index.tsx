import React from 'react';
import {NavigationContainer, LinkingOptions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import {Home} from './app/routes/home';
import {Shop} from './app/routes/shop';
import {Cart} from './app/routes/cart';
import {Account} from './app/routes/account';
import {AccountSettings} from './app/routes/account.settings';
import {navigationRef, overrideNavigationDispatch} from './shared/lib/guard';
import {SignInModal} from './pages/account/SignInModal';
import {ModalProvider} from './shared/components/ModalProvider';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AccountStack = createStackNavigator();

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: ['app://', 'https://yourapp.com'],
  config: {
    screens: {
      Home: 'home',
      Shop: 'shop',
      Cart: 'cart',
      AccountStack: {
        screens: {
          Account: 'account',
          AccountSettings: 'account/settings',
        },
      },
      SignInModal: '/modal',
    },
  },
};

function AccountStackNavigator() {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="Account"
        component={Account}
        options={{title: 'Account'}}
      />
      <AccountStack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{title: 'Account Settings'}}
      />
    </AccountStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} options={{title: 'Home'}} />
      <Tab.Screen name="Shop" component={Shop} options={{title: 'Shop'}} />
      <Tab.Screen name="Cart" component={Cart} options={{title: 'Cart'}} />
      <Tab.Screen
        name="AccountStack"
        component={AccountStackNavigator}
        options={{headerShown: false, title: 'Account'}}
      />
    </Tab.Navigator>
  );
}
export function App() {
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={() => overrideNavigationDispatch({})}
      onUnhandledAction={action =>
        console.error('Unhandled navigation action:', action)
      }>
      <ModalProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignInModal"
            component={SignInModal}
            options={{
              presentation: 'modal',
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </ModalProvider>
    </NavigationContainer>
  );
}
