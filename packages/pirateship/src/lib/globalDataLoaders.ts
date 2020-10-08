import { dataSource } from './datasource';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { env as appEnv } from '@brandingbrand/fsapp';

import {
  UPDATE_ACCOUNT,
  UPDATE_CART,
  UPDATE_PROMO_PRODUCTS,
  UPDATE_TOP_CATEGORIES
} from './constants';

export default (dispatch?: any) => {
  const dispatcher = dispatch || (() => {
    // Fallback noop dispatcher
  });
  return {
    async loadCartData(): Promise<void> {
      return dataSource.fetchCart().then((cartData: CommerceTypes.Cart) => {
        dispatcher({ type: UPDATE_CART, cartData });
      });
    },
    async loadAccountData(): Promise<void> {
      return dataSource
        .fetchAccount()
        .then((account: CommerceTypes.CustomerAccount) => {
          dispatcher({ type: UPDATE_ACCOUNT, account });
        })
        .catch((e: Error) => {
          console.log('not logged in', e);
        });
    },
    async loadTopCategories(): Promise<void> {
      return dataSource
        .fetchCategory()
        .then((data: CommerceTypes.Category) => {
          dispatcher({
            type: UPDATE_TOP_CATEGORIES,
            data: formatCategories(data).slice(0, 10)
          });
        })
        .catch((err: Error) => {
          console.error(
            'error when fetching Top Categories',
            err
          );
        });
    },
    async loadPromoProducts(): Promise<void> {
      if (appEnv.dataSource && appEnv.dataSource.promoProducts) {
        return dataSource
          .fetchProductIndex({
            categoryId: appEnv.dataSource.promoProducts.categoryId,
            limit: 5
          })
          .then((data: CommerceTypes.ProductIndex) => {
            dispatcher({
              type: UPDATE_PROMO_PRODUCTS,
              data: data.products
            });
          })
          .catch((err: Error) => {
            console.error('error fetching promo products', err);
          });
      }
    }
  };
};

type FormattedCategory = {
  handle: string;
  id: string;
  title: string;
  items: { id: string; title: string }[];
}[];

export function formatCategories(rootCategory: CommerceTypes.Category): FormattedCategory {
  return (rootCategory.categories || []).map(subCategory => ({
    id: subCategory.id,
    handle: subCategory.id,
    title: subCategory.title,
    items: (subCategory.categories || []).map((subSubCategory: CommerceTypes.Category) => ({
      id: subSubCategory.id,
      title: subSubCategory.title
    }))
  }));
}
