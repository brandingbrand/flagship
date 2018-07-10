import { dataSource } from '../lib/datasource';
import {
  RESET_CART_UPDATING,
  SET_CART_UPDATING,
  UPDATE_CART
} from '../lib/constants';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { CombinedStore } from '../reducers';
import { connect } from 'react-redux';
import Analytics, { mapProductToAnalytics } from '../lib/analytics';

export interface CartStateProps {
  cart: {
    isLoading: boolean;
    cartData?: CommerceTypes.Cart;
    verb: string;
    cartCount: number;
  };
}

export interface CartActionProps {
  addToCart: (product: CommerceTypes.Product, quantity: number, variantId?: string) => Promise<any>;
  updateItemQuantity: (item: CommerceTypes.CartItem, quantity: number) => void;
}

export interface CartProps extends CartStateProps, CartActionProps {}

// provide data (from redux store) to wrapped component as props
function mapStateToProps(
  state: CombinedStore,
  ownProps: any
): CartStateProps {
  return {
    cart: state.cart
  };
}

// provide actions (that can change redux store) to wrapped component as props
function mapDispatchToProps(dispatch: any, ownProps: any): CartActionProps {
  return {
    addToCart: async (product, quantity, variantId) => {
      dispatch({ type: SET_CART_UPDATING, verb: 'Updating' });
      const productId = variantId ? variantId : product.id;

      return dataSource
        .addToCart(productId, quantity, product)
        .then(async atcResponse => {
          Analytics.add.product('ProductDetail', mapProductToAnalytics(product, quantity));

          return dataSource.fetchCart();
        })
        .then(cartData => {
          dispatch({ type: UPDATE_CART, cartData });
          return cartData;
        })
        .catch(e => {
          dispatch({ type: RESET_CART_UPDATING });
          console.warn(e);
        });
    },
    updateItemQuantity: (item, quantity) => {
      dispatch({ type: SET_CART_UPDATING, verb: 'Updating' });

      dataSource
        .updateCartItemQty(item.itemId, quantity)
        .then(cartData => {
          dispatch({ type: UPDATE_CART, cartData });
        })
        .catch(e => {
          dispatch({ type: RESET_CART_UPDATING });
          console.warn(e);
        });
    }
  };
}

export default function withCart<P>(
  WrappedComponent: React.ComponentClass<P>
): React.ComponentClass<any> {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
