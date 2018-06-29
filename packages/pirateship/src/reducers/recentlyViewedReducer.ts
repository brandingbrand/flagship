import {
  LOAD_RECENTLY_VIEWED,
  UPDATE_RECENTLY_VIEWED
} from '../lib/constants';

const initialState = { items: [] };

export interface RecentlyViewedStore {
  items: any[];
}

export default function recentlyViewedReducer(
  recentlyViewedStore: RecentlyViewedStore = initialState,
  action: any
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

