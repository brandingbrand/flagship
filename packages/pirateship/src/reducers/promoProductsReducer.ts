import { UPDATE_PROMO_PRODUCTS } from '../lib/constants';
import { CommerceTypes } from '@brandingbrand/fscommerce';

const initialState = { products: null };

export interface PromoProductsStore {
  products: CommerceTypes.Product[] | null;
}

export default function promoProductsReducer(
  promoProductsStore: PromoProductsStore = initialState,
  action: any
): PromoProductsStore {
  switch (action.type) {
    case UPDATE_PROMO_PRODUCTS: {
      return {
        products: action.data
      };
    }
    default: return promoProductsStore;
  }
}
