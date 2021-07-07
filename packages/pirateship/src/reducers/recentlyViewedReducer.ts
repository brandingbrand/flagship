import {
  LOAD_RECENTLY_VIEWED,
  UPDATE_RECENTLY_VIEWED
} from '../lib/constants';
import { CommerceTypes } from '@brandingbrand/fscommerce';

const initialState = { items: [] };

export interface RecentlyViewedStore {
  items: CommerceTypes.Product[];
}

export interface RecentlyViewedAction extends RecentlyViewedStore {
  type: 'LOAD_RECENTLY_VIEWED' | 'UPDATE_RECENTLY_VIEWED';
}

export default function recentlyViewedReducer(
  recentlyViewedStore: RecentlyViewedStore = initialState,
  action: RecentlyViewedAction
): RecentlyViewedStore {
  switch (action.type) {
    case LOAD_RECENTLY_VIEWED: // fall-through
    case UPDATE_RECENTLY_VIEWED: {
      return {
        items: action.items
      };
    }
    default: {
      return recentlyViewedStore;
    }
  }
}

