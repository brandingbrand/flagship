import React, { Component } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

import { PromoForm } from '@brandingbrand/fscomponents';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarFullBleed } from '../styles/Navigation';
import { CommerceTypes } from '@brandingbrand/fscommerce';

import PSButton from '../components/PSButton';
import PSScreenWrapper from '../components/PSScreenWrapper';
import PSCartItem from '../components/PSCartItem';
import PSTotals from '../components/PSTotals';
import PSRecentlyViewedCarousel from '../components/PSRecentlyViewedCarousel';

import { border, palette } from '../styles/variables';
import GlobalStyle from '../styles/Global';

import withAccount, { AccountProps } from '../providers/accountProvider';
import withCart, { CartProps } from '../providers/cartProvider';
import withRecentlyViewed, {
  RecentlyViewedProps
} from '../providers/recentlyViewedProvider';
import Analytics from '../lib/analytics';
import translate, { translationKeys } from '../lib/translations';

const CartStyle = StyleSheet.create({
  loading: {
    backgroundColor: palette.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 15,
    color: palette.primary,
    fontWeight: 'bold'
  },
  title: {
    marginTop: 15,
    color: palette.secondary
  },
  cartContainer: {
    marginHorizontal: 15
  },
  cartItemContainer: {
    margin: 0,
    paddingBottom: 20,
    marginVertical: 15,
    borderBottomColor: border.color,
    borderBottomWidth: border.width
  },
  promoContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: border.width,
    borderTopColor: border.color
  },
  fieldsStyleConfig: {
    height: 50,
    borderRadius: 0,
    fontSize: 14,
    paddingHorizontal: 10,
    borderColor: border.color,
    borderWidth: border.width
  },
  fieldsStyleErrorConfig: {
    height: 50,
    borderRadius: 0,
    fontSize: 14,
    paddingHorizontal: 10,
    borderTopColor: 'red',
    borderBottomColor: 'red',
    borderLeftColor: 'red',
    borderRightColor: 'red',
    borderWidth: 1
  },
  submitButtonStyle: {
    backgroundColor: palette.primary,
    height: 50
  },
  submitTextStyle: {
    color: palette.onPrimary
  },
  summaryContainer: {
    marginBottom: 20
  },
  lastItemTextStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: palette.primary
  },
  checkoutButton: {
    borderWidth: 0,
    borderRadius: 3,
    marginBottom: 10,
    backgroundColor: palette.accent
  },
  apCheckoutButton: {
    paddingVertical: 20,
    borderRadius: 5,
    marginBottom: 20
  },
  checkoutButtonTitle: {
    color: 'white'
  },
  apCheckoutButtonTitle: {
    color: 'white'
  },
  checkoutIcon: {
    width: 15,
    height: 15,
    resizeMode: 'stretch'
  },
  apCheckoutIconAP: {
    width: 15,
    height: 15,
    resizeMode: 'stretch'
  },
  lastItemViewStyle: {
    borderWidth: 0
  },
  savingsText: {
    color: palette.accent
  },
  footerButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerButtonText: {
    color: palette.primary
  },
  footerButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.primary
  },
  buttonContainer: {
    flex: 1
  },
  footerNortonContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 25
  },
  footerNortonImage: {
    marginBottom: 20
  },
  emptyText: {
    color: palette.secondary,
    marginTop: 10,
    fontSize: 15
  },
  continueShopping: {
    marginVertical: 20,
    borderRadius: 5
  },
  loginText: {
    borderTopWidth: 1,
    borderTopColor: border.color,
    paddingTop: 20,
    marginTop: 10,
    fontSize: 15,
    marginBottom: 20
  },
  signIn: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: border.color,
    backgroundColor: palette.secondary
  },
  signInButtonTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  },
  continueShoppingButtonTitle: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  emptyCartTopContainer: {
    backgroundColor: palette.surface,
    paddingHorizontal: 15,
    flex: 1,
    paddingBottom: 20
  },
  recentProductsCarousel: {
    marginVertical: 20
  },
  container: {
    backgroundColor: palette.primary
  },
  scrollView: {
    backgroundColor: palette.background
  }
});

const icons = {
  secure: require('../../assets/images/lock.png'),
  applePay: require('../../assets/images/lock.png'),
  isFav: require('../../assets/images/heart-filled.png'),
  notFav: require('../../assets/images/heart.png')
};

export interface CartScreenProps
  extends ScreenProps,
  AccountProps,
  CartProps,
  RecentlyViewedProps { }

class Cart extends Component<CartScreenProps> {
  static navigatorStyle: NavigatorStyle = navBarFullBleed;

  componentDidMount(): void {
    if (!this.props.recentlyViewed.items.length) {
      this.props.loadRecentlyViewed();
    }
  }

  render(): JSX.Element {
    const { navigator } = this.props;
    const { cartData, isLoading } = this.props.cart;
    let cart;

    if (isLoading) {
      cart = (
        <View style={[CartStyle.loading]}>
          <ActivityIndicator size='large' />
          <Text style={CartStyle.loadingText}>
            {translate.string(translationKeys.cart.loading, {
              verb: this.props.cart.verb
            })}
          </Text>
        </View>
      );
    } else if (cartData && cartData.items) {
      this.props.navigator.setTabBadge({
        tabIndex: 1,
        badge: this.props.cart.cartCount || null,
        badgeColor: palette.primary
      });

      if (cartData.items.length === 0) {
        cart = this.renderEmptyCart();
      } else {
        cart = this.renderFullCart();
      }
    }

    return (
      <PSScreenWrapper
        needInSafeArea={true}
        scroll={!isLoading}
        style={CartStyle.container}
        scrollViewProps={{ style: CartStyle.scrollView }}
        navigator={navigator}
      >
        {cart}
      </PSScreenWrapper>
    );
  }

  renderFullCart = () => {
    const { cartData } = this.props.cart;
    if (!cartData) {
      return;
    }

    return (
      <View style={CartStyle.cartContainer}>
        <Text style={[GlobalStyle.h1, CartStyle.title]}>
          {translate.string(translationKeys.cart.cartCount, {
            count: cartData.items.length
          })}
        </Text>

        {cartData.items.map(i => this.renderCartItem(i))}

        {this.renderSummary()}
        {this.renderActionBar()}
      </View>
    );
  }

  updateQuantity = (item: CommerceTypes.CartItem) => {
    return (qty: number) => {
      this.props.updateItemQuantity(item, qty);

      if (qty === 0) {
        Analytics.remove.product('Cart', {
          identifier: item.itemId,
          name: item.title
        });
      }
    };
  }

  afterLoad = (cartData: CommerceTypes.Cart): void => {
    this.setState({
      cartData
    });

    this.props.navigator.setTabBadge({
      tabIndex: 1,
      badge:
        (cartData.items &&
          cartData.items.reduce((total, item) => total + item.quantity, 0)) ||
        null,
      badgeColor: palette.secondary
    });
  }

  renderEmptyCart = (): JSX.Element => {
    const login = [];
    if (!this.props.account.isLoggedIn) {
      login.push(
        <Text key='text' style={CartStyle.loginText}>
          {translate.string(translationKeys.cart.notes.missingItems)}
        </Text>
      );

      login.push(
        <PSButton
          key='button'
          style={CartStyle.signIn}
          title={translate.string(
            translationKeys.account.actions.signIn.actionBtn
          )}
          titleStyle={CartStyle.signInButtonTitle}
          onPress={this.signIn}
        />
      );
    }

    let recentProducts;
    if (
      this.props.recentlyViewed.items &&
      this.props.recentlyViewed.items.length
    ) {
      recentProducts = (
        <PSRecentlyViewedCarousel
          items={this.props.recentlyViewed.items}
          navigator={this.props.navigator}
        />
      );
    }

    return (
      <View>
        <View style={CartStyle.emptyCartTopContainer}>
          <Text style={[GlobalStyle.h1, CartStyle.title, { marginLeft: 0 }]}>
            {translate.string(translationKeys.cart.emptyCart)}
          </Text>
          <Text style={CartStyle.emptyText}>
            {translate.string(translationKeys.cart.emptyCartDetails)}
          </Text>

          <PSButton
            style={CartStyle.continueShopping}
            title={translate.string(
              translationKeys.cart.actions.continueShopping.actionBtn
            )}
            titleStyle={CartStyle.continueShoppingButtonTitle}
            onPress={this.continueShopping}
          />

          {login}
        </View>
        {recentProducts}
      </View>
    );
  }

  handlePromotedProductPress = (productId: string) => () => {
    this.props.navigator.push({
      screen: 'ProductDetail',
      passProps: {
        productId
      }
    });
  }

  signIn = () => {
    return this.props.navigator.showModal({
      screen: 'SignIn',
      passProps: {
        dismissible: true,
        onDismiss: () => {
          this.props.navigator.dismissModal();
        },
        onSignInSuccess: () => {
          this.props.navigator.dismissModal();
        }
      }
    });
  }

  continueShopping = () => {
    if (Platform.OS !== 'web') {
      this.props.navigator.switchToTab({
        tabIndex: 0
      });
    } else {
      this.props.navigator.push({
        screen: 'Shop'
      });
    }
  }

  renderCartItem = (item: any): JSX.Element => {
    return (
      <PSCartItem
        key={item.productId}
        isLoggedIn={this.props.account.isLoggedIn}
        navigateToProduct={this.goToProduct}
        item={item}
        updateQty={this.updateQuantity(item)}
        containerStyle={CartStyle.cartItemContainer}
      />
    );
  }

  doesProductExist = (items: any[], productId: string) => {
    return items && items.findIndex(product => product.id === productId) > -1;
  }

  goToProduct = (item: CommerceTypes.CartItem) => {
    this.props.navigator.handleDeepLink({
      link: 'shop/product/' + item.productId
    });
  }

  renderPromo = (): JSX.Element => {
    return (
      <View key='promoForm' style={CartStyle.promoContainer}>
        <PromoForm
          submitText='APPLY'
          onSubmit={this.promoSubmit}
          fieldsStyleConfig={{
            textbox: {
              normal: CartStyle.fieldsStyleConfig,
              error: CartStyle.fieldsStyleErrorConfig
            }
          }}
          submitButtonStyle={CartStyle.submitButtonStyle}
          submitTextStyle={CartStyle.submitTextStyle}
        />
      </View>
    );
  }

  promoSubmit = (value: any) => {
    alert('promo submit');
  }

  renderSummary = (): JSX.Element | null => {
    const cart = this.props.cart.cartData;
    if (!cart) {
      return null;
    }

    const items = [];

    if (cart.subtotal) {
      items.push({
        label: 'Subtotal',
        value: translate.currency(cart.subtotal)
      });
    }

    if (cart.tax) {
      items.push({
        label: 'Tax',
        value: translate.currency(cart.tax)
      });
    }

    if (cart.shipping) {
      items.push({
        label: 'Shipping',
        value: translate.currency(cart.shipping)
      });
    }

    if (cart.total) {
      items.push({
        label: 'Total',
        value: translate.currency(cart.total)
      });
    }

    return (
      <PSTotals
        style={CartStyle.summaryContainer}
        items={items}
        lastItemTextStyle={CartStyle.lastItemTextStyle}
        lastItemViewStyle={CartStyle.lastItemViewStyle}
      />
    );
  }

  renderActionBar = () => {
    return (
      <View>
        <PSButton
          icon={icons.secure}
          iconStyle={CartStyle.checkoutIcon}
          titleStyle={CartStyle.checkoutButtonTitle}
          style={CartStyle.checkoutButton}
          title={translate.string(
            translationKeys.cart.actions.checkout.actionBtn
          )}
          onPress={this.startCheckout(false)}
        />
      </View>
    );
  }

  startCheckout = (useApplePay: boolean): any => {
    return (): void => {
      if (!useApplePay) {
        alert('Not yet implemented');
      }
    };
  }
}

export default withCart(withAccount(withRecentlyViewed(Cart)));
