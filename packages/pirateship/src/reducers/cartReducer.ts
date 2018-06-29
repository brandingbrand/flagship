import {
  RESET_CART_UPDATING,
  SET_CART_UPDATING,
  UPDATE_CART
} from '../lib/constants';
import { CommerceTypes } from '@brandingbrand/fscommerce';

const initialState = {
  isLoading: true,
  cartData: undefined,
  verb: 'Loading',
  cartCount: 0
};

export interface CartAction {
  type: 'RESET_CART_UPDATING' | 'SET_CART_UPDATING' | 'UPDATE_CART';
  cartData: CommerceTypes.Cart;
  verb: string;
}

export interface CartStore {
  isLoading: boolean;
  cartData?: CommerceTypes.Cart;
  verb: string;
  cartCount: number;
}

export default function cartReducer(
  cartStore: CartStore = initialState,
  action: CartAction
): CartStore {
  switch (action.type) {
    case UPDATE_CART: {
      const { cartData } = action;
      const cartItems = (cartData && cartData.items) || [];
      const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

      return {
        cartData,
        cartCount,
        isLoading: false,
        verb: 'Loading'
      };
    }

    case SET_CART_UPDATING: {
      return {
        ...cartStore,
        verb: action.verb,
        isLoading: true
      };
    }

    case RESET_CART_UPDATING: {
      return {
        ...cartStore,
        verb: 'Loading',
        isLoading: false
      };
    }

    default: {
      return cartStore;
    }
  }
}
