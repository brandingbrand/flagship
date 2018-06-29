import accountReducer, { AccountStore } from './reducers/accountReducer';
import cartReducer, { CartStore } from './reducers/cartReducer';
import topCategoryReducer, { TopCategoryStore } from './reducers/topCategoryReducer';
import recentlyViewedReducer, { RecentlyViewedStore } from './reducers/recentlyViewedReducer';

export interface CombinedStore {
  account: AccountStore;
  cart: CartStore;
  topCategory: TopCategoryStore;
  recentlyViewed: RecentlyViewedStore;
}

export default {
  account: accountReducer,
  cart: cartReducer,
  topCategory: topCategoryReducer,
  recentlyViewed: recentlyViewedReducer
};
