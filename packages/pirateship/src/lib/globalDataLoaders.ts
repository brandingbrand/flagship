import { dataSource } from './datasource';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import {
  UPDATE_ACCOUNT,
  UPDATE_CART,
  UPDATE_TOP_CATEGORIES
} from './constants';

import app from '../index';

export async function loadCartData(): Promise<void> {
  return dataSource.fetchCart().then(cartData => {
    app.store.dispatch({ type: UPDATE_CART, cartData });
  });
}

export async function loadAccountData(): Promise<void> {
  return dataSource
    .fetchAccount()
    .then(account => {
      app.store.dispatch({ type: UPDATE_ACCOUNT, account });
    })
    .catch(e => {
      console.log('not logged in', e);
    });
}

export async function loadPromoProductsAndTopCategories(): Promise<void> {
  return dataSource
    .fetchCategory()
    .then(data => {
      app.store.dispatch({
        type: UPDATE_TOP_CATEGORIES,
        data: formatCategories(data).slice(0, 10)
      });
    })
    .catch(err => {
      console.error(
        'error when fetching Promo Products And Top Categories',
        err
      );
    });
}

function formatCategories(rootCategory: CommerceTypes.Category): any {
  return (rootCategory.categories || []).map(subCategory => ({
    id: subCategory.id,
    handle: subCategory.id,
    title: subCategory.title,
    items: (subCategory.categories || []).map(subSubCategory => ({
      id: subSubCategory.id,
      title: subSubCategory.title
    }))
  }));
}
