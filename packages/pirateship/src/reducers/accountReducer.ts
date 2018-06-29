import { SIGN_IN, SIGN_OUT, UPDATE_ACCOUNT } from '../lib/constants';
import { CommerceTypes } from '@brandingbrand/fscommerce';
const initialState = { isLoggedIn: false };

export interface AccountStore {
  isLoggedIn: boolean;
  store?: CommerceTypes.CustomerAccount;
}

export default function accountReducer(
  accountStore: AccountStore = initialState,
  action: any
): AccountStore {
  switch (action.type) {
    case SIGN_IN: {
      return {
        ...accountStore,
        isLoggedIn: true
      };
    }
    case UPDATE_ACCOUNT: {
      if (action.account && action.account.firstName) {
        return {
          store: action.account,
          isLoggedIn: true
        };
      } else {
        return {
          isLoggedIn: false
        };
      }
    }
    case SIGN_OUT: {
      return {
        isLoggedIn: false
      };
    }
    default: {
      return accountStore;
    }
  }
}
