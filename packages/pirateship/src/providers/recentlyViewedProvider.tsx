import {
  LOAD_RECENTLY_VIEWED,
  UPDATE_RECENTLY_VIEWED
} from '../lib/constants';
import { CombinedStore } from '../reducers';
import { connect } from 'react-redux';
import { RecentlyViewedStore } from '../reducers/recentlyViewedReducer';
import { AsyncStorage } from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { find } from 'lodash-es';

const RECENTLY_VIEWED_ITEMS = 'RECENTLY_VIEWED_ITEMS';
const NUM_STORED_VIEWED_ITEMS = 10;

export interface RecentlyViewedStateProps {
  recentlyViewed: RecentlyViewedStore;
}

export interface RecentlyViewedActionProps {
  addToRecentlyViewed: (product: CommerceTypes.Product) => void;
  loadRecentlyViewed: () => void;
}

export interface RecentlyViewedProps
  extends RecentlyViewedStateProps,
    RecentlyViewedActionProps {}

// provide data (from redux store) to wrapped component as props
function mapStateToProps(
  combinedStore: CombinedStore,
  ownProps: any
): RecentlyViewedStateProps {
  return {
    recentlyViewed: combinedStore.recentlyViewed
  };
}

// provide actions (that can change redux store) to wrapped component as props
function mapDispatchToProps(dispatch: any, ownProps: any): RecentlyViewedActionProps {
  return {
    loadRecentlyViewed: async () => {
      try {
        const initialItems = await AsyncStorage.getItem(RECENTLY_VIEWED_ITEMS);
        let items = [];
        if (initialItems) {
          const json = JSON.parse(initialItems);
          items = (typeof json === 'object') ? json : [];
        }
        dispatch({ type: LOAD_RECENTLY_VIEWED, items });
      } catch (e) {
        const items = [] as CommerceTypes.Product[];
        dispatch({ type: LOAD_RECENTLY_VIEWED, items });
        console.warn('Failed to load previously viewed items', e);
      }
    },
    addToRecentlyViewed: async product => {
      try {
        const existingItemsJson = await AsyncStorage.getItem(RECENTLY_VIEWED_ITEMS);
        let existingItems = JSON.parse(existingItemsJson);

        if (!Array.isArray(existingItems)) {
          existingItems = [];
        }

        if (find(existingItems, { id: product.id }) === undefined) {
          existingItems.unshift(product);

          if (existingItems.length > NUM_STORED_VIEWED_ITEMS) {
            existingItems.pop();
          }

          await AsyncStorage.setItem(RECENTLY_VIEWED_ITEMS, JSON.stringify(existingItems));
          dispatch({ type: UPDATE_RECENTLY_VIEWED, existingItems });
        }
      } catch (e) {
        const items = [] as CommerceTypes.Product[];
        await AsyncStorage.setItem(RECENTLY_VIEWED_ITEMS, '');
        dispatch({ type: UPDATE_RECENTLY_VIEWED, items });
        console.warn('Failed to add to recently viewed items', e);
      }
    }
  };
}

export default function withRecentlyViewed(
  WrappedComponent: React.ComponentClass<any>
): React.ComponentClass<any> {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
