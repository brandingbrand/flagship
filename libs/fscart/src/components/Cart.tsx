import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  CommerceDataSource,
  CommerceTypes,
  withCommerceData,
  WithCommerceProps,
  WithCommerceProviderProps,
} from '@brandingbrand/fscommerce';
import { CartItem, CartItemProps, Loading } from '@brandingbrand/fscomponents';

import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';

const kErrorMessageDataSourceMissing = 'FSCart: commerceDataSource is required';

const defaultStyles = StyleSheet.create({
  loading: {
    padding: 20,
  },
});

export interface UnwrappedCartProps {
  onChange?: (cart: CommerceTypes.Cart) => void;

  /**
   * An optional custom render function to render the loading state for
   * the cart.
   */
  renderLoading?: () => React.ReactNode;

  /**
   * An optional custom render function to render the cart summary.
   */
  renderSummary?: (cartData: CommerceTypes.Cart) => React.ReactNode;

  /**
   * An optional custom render function to render a promo form.
   */
  renderPromoForm?: (cartData: CommerceTypes.Cart) => React.ReactNode;

  /**
   * An optional custom render function to render an empty cart.
   */
  renderEmptyCart?: (cartData: CommerceTypes.Cart) => React.ReactNode;

  /**
   * An optional custom render function to render an item in the cart.
   */
  renderCartItem?: (item: CommerceTypes.CartItem) => React.ReactNode;

  /**
   * A callback to invoke if the user taps on the cart item image. Ignored if a custom cart item
   * render function is passed with `renderCartItem`.
   */
  onImagePress?: (item: CommerceTypes.CartItem) => void;

  /**
   * Props to pass to each default CartItem. Ignored if a custom cart item render function is passed
   * with `renderCartItem`.
   */
  cartItemProps?: CartItemProps;
}

export type CartProps = UnwrappedCartProps & WithCommerceProviderProps<CommerceTypes.Cart>;

class Cart extends Component<UnwrappedCartProps & WithCommerceProps<CommerceTypes.Cart>> {
  render(): React.ReactNode {
    const {
      cartItemProps,
      commerceData,
      onImagePress,
      renderCartItem,
      renderEmptyCart,
      renderLoading,
      renderPromoForm,
      renderSummary,
    } = this.props;

    if (!commerceData) {
      if (renderLoading) {
        return renderLoading();
      }

      return <Loading style={defaultStyles.loading} />;
    }

    if (!commerceData.items.length) {
      if (renderEmptyCart) {
        return renderEmptyCart(commerceData);
      }

      return <EmptyCart />;
    }

    return (
      <View>
        {renderCartItem
          ? commerceData.items.map(renderCartItem)
          : commerceData.items.map((item: CommerceTypes.CartItem) => {
              return (
                <CartItem
                  key={item.itemId}
                  removeItem={this.removeItem}
                  updateQty={this.updateQty}
                  onImagePress={onImagePress}
                  {...item}
                  {...cartItemProps}
                />
              );
            })}
        {renderPromoForm && renderPromoForm(commerceData)}
        {renderSummary ? (
          renderSummary(commerceData)
        ) : (
          <CartSummary
            shipping={commerceData.shipping}
            subtotal={commerceData.subtotal}
            tax={commerceData.tax}
            total={commerceData.total}
          />
        )}
      </View>
    );
  }

  /**
   * Updates the quantity of an item in cart.
   */
  private updateQty = async (item: CommerceTypes.CartItem, qty: number) => {
    if (!this.props.commerceDataSource) {
      throw new Error(kErrorMessageDataSourceMissing);
    }

    // TODO: We should debounce this to avoid sending multiple calls in rapid succession if the
    // user uses the stepper.
    return this.props.commerceDataSource.updateCartItemQty(item.itemId, qty).then(this.updateData);
  };

  /**
   * Removes an item from cart.
   */
  private removeItem = async (item: CommerceTypes.CartItem) => {
    if (!this.props.commerceDataSource) {
      throw new Error(kErrorMessageDataSourceMissing);
    }

    return this.props.commerceDataSource.removeCartItem(item.itemId).then(this.updateData);
  };

  /**
   * Replaces the current cart data with the newly provided data and invokes the change
   * handler.
   */
  private updateData = (data: CommerceTypes.Cart) => {
    if (!this.props.commerceLoadData) {
      throw new Error(kErrorMessageDataSourceMissing);
    }

    this.props.commerceLoadData(data);

    if (this.props.onChange) {
      this.props.onChange(data);
    }
  };
}

export default withCommerceData<UnwrappedCartProps, CommerceTypes.Cart>(
  async (dataSource: CommerceDataSource) => dataSource.fetchCart()
)(Cart);
