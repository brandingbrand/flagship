import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

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
const Stack = createNativeStackNavigator<RootStackParamList>();
const ModalStack = createNativeStackNavigator<ModalStackParamList>();

/**
 * Navigation linking configuration for deep linking and URL handling
 * @type {Object}
 */
const linking: LinkingOptions<RootStackParamList> = {
  /**
   * URL prefixes that the app will handle
   * Includes both custom URL scheme and web URL
   * @type {string[]}
   */
  prefixes: ['myapp://', 'https://myapp.com'],

  /**
   * Screen configuration mapping URLs to navigation routes
   * @type {Object}
   */
  config: {
    /**
     * Root level screens configuration
     * @type {Object}
     */
    screens: {
      /**
       * Main navigator containing bottom tabs
       * @type {Object}
       */
      [ROUTES.MAIN]: {
        /**
         * Bottom tab navigator screens
         * @type {Object}
         */
        screens: {
          /**
           * Discover tab stack configuration
           * Handles /discover and /discover/:slug routes
           * @type {Object}
           */
          [ROUTES.DISCOVER_STACK]: {
            screens: {
              /** @type {string} Base discover screen route */
              Discover: 'discover',
              /** @type {string} Dynamic discover detail route with slug parameter */
              DiscoverSlug: 'discover/:slug',
            },
          },
          /**
           * Shop tab stack configuration
           * Handles /shop route
           * @type {Object}
           */
          [ROUTES.SHOP_STACK]: {
            screens: {
              /** @type {string} Base shop screen route */
              Shop: 'shop',
            },
          },
          /**
           * Wishlist tab stack configuration
           * Handles /wishlist route
           * @type {Object}
           */
          [ROUTES.WISHLIST_STACK]: {
            screens: {
              /** @type {string} Base wishlist screen route */
              Wishlist: 'wishlist',
            },
          },
          /**
           * Cart tab stack configuration
           * Handles /cart route
           * @type {Object}
           */
          [ROUTES.CART_STACK]: {
            screens: {
              /** @type {string} Base cart screen route */
              Cart: 'cart',
            },
          },
          /**
           * Account tab stack configuration
           * Handles /account route
           * @type {Object}
           */
          [ROUTES.ACCOUNT_STACK]: {
            screens: {
              /** @type {string} Base account screen route */
              Account: 'account',
            },
          },
        },
      },
      /**
       * Modal screens configuration
       * @type {Object}
       */
      [ROUTES.MODAL]: {
        screens: {
          /** @type {string} Force update modal route */
          [ROUTES.FORCE_UPDATE_MODAL]: 'force-update',
          /** @type {string} Soft update modal route */
          [ROUTES.SOFT_UPDATE_MODAL]: 'soft-update',
          /** @type {string} Maintenance modal route */
          [ROUTES.MAINTENANCE_MODAL]: 'maintenance',
        },
      },
    },
  },
};

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
      linking={linking}
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
