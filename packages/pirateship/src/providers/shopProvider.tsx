import { CombinedStore } from '../reducers';
import { ScreenProps } from '../lib/commonTypes';
import { AccountActionProps, signOut } from './accountProvider';
import { connect } from 'react-redux';

export interface ShopProps
  extends ScreenProps,
  Pick<CombinedStore, 'account' | 'topCategory' | 'promoProducts'>,
  Pick<AccountActionProps, 'signOut'> { }

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    signOut: signOut(dispatch)
  };
};

const mapStateToProps = (combinedStore: CombinedStore, ownProps: any) => {
  return {
    account: combinedStore.account,
    promoProducts: combinedStore.promoProducts,
    topCategory: combinedStore.topCategory
  };
};

export default function withShop(
  WrappedComponent: React.ComponentClass<any>
): React.ComponentClass<any> {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
