import {
  UPDATE_TOP_CATEGORIES
} from '../lib/constants';

const initialState = { categories: [] };

export interface TopCategoryStore {
  categories: any[];
}

export default function topCategoryReducer(
  topCategoryStore: TopCategoryStore = initialState,
  action: any
): TopCategoryStore {
  if (action.type === UPDATE_TOP_CATEGORIES) {
    return {
      categories: action.data
    };
  }

  return topCategoryStore;
}
