import { CombinedStore } from '../reducers';
import { connect } from 'react-redux';
import { TopCategoryStore } from '../reducers/topCategoryReducer';

export interface TopCategoryProps {
  topCategory: TopCategoryStore;
}

// provide data (from redux store) to wrapped component as props
function mapStateToProps(
  combinedStore: CombinedStore,
  ownProps: any
): TopCategoryProps {
  return {
    topCategory: combinedStore.topCategory
  };
}

export default function withTopCategory(WrappedComponent: any): any {
  return connect(mapStateToProps)(WrappedComponent);
}
