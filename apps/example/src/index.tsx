import {register} from '@brandingbrand/code-app-router';

import assets from './assets';
import HelloWorldModal from './components/HelloWorldModal';

register({
  routes: [
    {
      type: 'bottomtab',
      stackId: 'HOME_STACK',
      name: 'home',
      Component: require('./routes/home').default,
      path: '/home',
      options: {
        topBar: {
          visible: false,
        },
        bottomTab: {
          icon: assets.home,
          iconColor: 'grey',
          selectedIconColor: 'black',
          textColor: 'grey',
          selectedTextColor: 'black',
          text: 'Home',
        },
      },
      children: [],
    },
    {
      type: 'bottomtab',
      stackId: 'SHOP_STACK',
      name: 'shop',
      Component: require('./routes/shop').default,
      path: '/shop',
      options: {
        topBar: {
          visible: false,
        },
        bottomTab: {
          icon: assets.shop,
          iconColor: 'grey',
          selectedIconColor: 'black',
          textColor: 'grey',
          selectedTextColor: 'black',
          text: 'Shop',
        },
      },
      children: [],
    },
    {
      type: 'bottomtab',
      stackId: 'CART_STACK',
      name: 'cart',
      Component: require('./routes/cart').default,
      path: '/cart',
      options: {
        topBar: {
          visible: false,
        },
        bottomTab: {
          icon: assets.bag,
          iconColor: 'grey',
          selectedIconColor: 'black',
          textColor: 'grey',
          selectedTextColor: 'black',
          text: 'Cart',
        },
      },
      children: [
        {
          type: 'action',
          name: 'applyDiscount',
          path: '/cart/discount/:discount',
          action: require('./routes/cart.discount.$discount').default,
          guards: [
            async function (to, from, next) {
              console.log('to1:', to);
              console.log('from1:', from);
              console.log('next:', next);

              await next.showModal(HelloWorldModal, {}, {});
            },
            async function (to, from, next) {
              console.log('to2:', to);
              console.log('from2:', from);
              console.log('next:', next);
            },
          ],
        },
      ],
    },
    {
      type: 'bottomtab',
      stackId: 'ACCOUNT_STACK',
      name: 'account',
      Component: require('./routes/account').default,
      path: '/account',
      options: {
        topBar: {
          visible: false,
        },
        bottomTab: {
          icon: assets.account,
          iconColor: 'grey',
          selectedIconColor: 'black',
          textColor: 'grey',
          selectedTextColor: 'black',
          text: 'Account',
        },
      },
      children: [
        {
          type: 'component',
          name: 'AccountSettings',
          path: '/account/settings',
          Component: require('./routes/account.settings').default,
        },
      ],
    },
  ],
});
