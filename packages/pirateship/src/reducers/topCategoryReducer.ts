import { UPDATE_TOP_CATEGORIES } from '../lib/constants';
import { CommerceTypes } from '@brandingbrand/fscommerce';

const initialState = { categories: [] };

export interface TopCategoryStore {
  categories: CommerceTypes.Category[];
}

export interface TopCategoryAction {
  type: 'UPDATE_TOP_CATEGORIES';
  data: CommerceTypes.Category[];
}

export default function topCategoryReducer(
  topCategoryStore: TopCategoryStore = initialState,
  action: TopCategoryAction
): TopCategoryStore {
  if (action.type === UPDATE_TOP_CATEGORIES) {
    return {
      categories: action.data
    };
  }

  return topCategoryStore;
}
