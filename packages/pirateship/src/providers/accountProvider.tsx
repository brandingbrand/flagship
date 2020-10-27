import React from 'react';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { dataSource } from '../lib/datasource';
import {
  SIGN_IN,
  SIGN_OUT,
  STORAGE_KEYS,
  UPDATE_ACCOUNT
} from '../lib/constants';
import { CombinedStore } from '../reducers';
import { connect } from 'react-redux';
import { AccountStore } from '../reducers/accountReducer';
import globalDataLoaders from '../lib/globalDataLoaders';
// @ts-ignore TODO: Add types for react-native-sensitive-info
import SInfo from 'react-native-sensitive-info';

export interface AccountStateProps {
  account: AccountStore;
}

export interface AccountActionProps {
  signIn: (
    email: string,
    password: string
  ) => Promise<CommerceTypes.SessionToken>;
  signOut: (clearSaved?: boolean) => Promise<void>;
  updateAccount: (details: CommerceTypes.CustomerAccount) =>
    Promise<CommerceTypes.CustomerAccount | void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  saveCredentials: (email: string, password: string) => Promise<void>;
  updateCredentials: (email: string, password: string) => Promise<void>;
  getCredentials: () => Promise<{ email: string; password: string }>;
}

export interface AccountProps extends AccountStateProps, AccountActionProps {}

// provide data (from redux store) to wrapped component as props
function mapStateToProps(
  combinedStore: CombinedStore
): AccountStateProps {
  return {
    account: combinedStore.account
  };
}

const reloadSessionData = async (dispatch: any): Promise<any> => {
  const {
    loadAccountData,
    loadCartData
  } = globalDataLoaders(dispatch);

  return Promise.all([
    loadCartData(),
    loadAccountData()
  ]).catch(e => {
    console.warn(
      'Unable to fetch wishlist and/or account after authenticating',
      e
    );
  });
};

export const signOut = (dispatch: React.Dispatch<any>) => async (clearSaved: boolean = true) => {
  return dataSource
    .logout('', '')
    .then(async () => {
      if (!clearSaved) {
        return;
      }

      return Promise.all([
        SInfo.deleteItem(STORAGE_KEYS.username, {}),
        SInfo.deleteItem(STORAGE_KEYS.password, {})
      ]);
    })
    .then(() => {
      dispatch({ type: SIGN_OUT });
    })
    .then(() => reloadSessionData(dispatch));
};

// provide actions (that can change redux store) to wrapped component as props
function mapDispatchToProps(dispatch: React.Dispatch<any>): AccountActionProps {
  return {
    signIn: async (email, password) => {
      return dataSource
        .login(email, password)
        .then((signInData: CommerceTypes.SessionToken) => {
          dispatch({ type: SIGN_IN, data: signInData });
        })
        .then(() => reloadSessionData(dispatch));
    },
    signOut: signOut(dispatch),
    updateAccount: async (details: CommerceTypes.CustomerAccount) => {
      return dataSource
        .updateAccount(details)
        .then((account: CommerceTypes.CustomerAccount) => {
          dispatch({ type: UPDATE_ACCOUNT, account });

          return account;
        })
        .catch((e: Error) => console.warn('Unable to update account info', e));
    },
    updatePassword: async (oldPassword: string, newPassword: string) => {
      return dataSource
        .updatePassword(oldPassword, newPassword)
        .then(() => reloadSessionData(dispatch));
    },
    saveCredentials: async (email: string, password: string) => {
      if (!email || !password) {
        return;
      }
      await Promise.all([
        SInfo.setItem(STORAGE_KEYS.username, email, {}),
        SInfo.setItem(STORAGE_KEYS.password, password, {})
      ]);
    },
    updateCredentials: async (email: string, password: string) => {
      if (!email || !password) {
        return;
      }

      const storedEmail = await SInfo.getItem(STORAGE_KEYS.username, {});
      if (storedEmail === email) {
        await SInfo.setItem(STORAGE_KEYS.password, password, {});
      }
    },
    getCredentials: async () => {
      const [email, password] = await Promise.all([
        SInfo.getItem(STORAGE_KEYS.username, {}),
        SInfo.getItem(STORAGE_KEYS.password, {})
      ]);
      return { email, password };
    }
  };
}

export default function withAccount(
  WrappedComponent: React.ComponentClass<any>
): any {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
