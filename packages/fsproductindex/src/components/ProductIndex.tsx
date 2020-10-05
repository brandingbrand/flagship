import React, { Component } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { isEqual } from 'lodash-es';
import {
  CommerceDataSource,
  CommerceTypes
} from '@brandingbrand/fscommerce';
import {
  FilterListDrilldownProps,
  FilterListProps,
  GridProps,
  Loading,
  ProductItemProps,
  RefineActionBarProps,
  SelectableListProps
} from '@brandingbrand/fscomponents';

import { style as S } from '../styles/ProductIndex';
import ProductIndexGrid from './ProductIndexGrid';
import {
  default as withProductIndexData,
  WithProductIndexProps,
  WithProductIndexProviderProps
} from './ProductIndexProvider';

export interface UnwrappedProductIndexProps {
  columns?: number;
  fetchProducts?: (
    productQuery?: CommerceTypes.ProductQuery
  ) => Promise<CommerceTypes.ProductIndex>;
  format?: 'list' | 'grid';
  errorText?: string;
  errorTextStyle?: StyleProp<TextStyle>;
  filterHeaderTitle?: string;
  filterListProps?: Partial<FilterListProps>;
  gridProps?: Partial<GridProps<any>>;
  handleFilterApply?: (data: any, info?: { isButtonPress: boolean }) => void;
  handleFilterReset?: () => void;
  onLoadComplete?: (
    loadMore: () => void,
    hasAnotherPage?: boolean,
    count?: number,
    responseCount?: number
  ) => void;
  handleSortChange?: (data: CommerceTypes.SortingOption['id']) => void;
  hideActionBar?: boolean;
  listStyle?: StyleProp<ViewStyle>;
  loadingStyle?: StyleProp<ViewStyle>;
  loadMoreButtonStyle?: StyleProp<ViewStyle>;
  loadMoreButtonTextStyle?: StyleProp<TextStyle>;
  loadMoreLoadingStyle?: StyleProp<ViewStyle>;
  modalCancelStyle?: StyleProp<ViewStyle>;
  modalHeaderStyle?: StyleProp<ViewStyle>;
  modalHeaderTextStyle?: StyleProp<TextStyle>;
  onNavigate?: (data: CommerceTypes.Product) => void;
  productItemProps?: Partial<ProductItemProps>;
  productQuery: CommerceTypes.ProductQuery;
  refineActionBarProps?: Partial<RefineActionBarProps>;
  renderFilter?: (
    handleFilterApply: (data: any, info?: { isButtonPress: boolean }) => void,
    handleFilterReset: () => void,
    commerceData: CommerceTypes.ProductIndex
  ) => JSX.Element;
  renderLoadPrev?: (loadPrev: () => void, hasAnotherPage: boolean) => JSX.Element;
  renderLoadMore?: (loadMore: () => void, hasAnotherPage: boolean) => JSX.Element;
  renderLoading?: () => JSX.Element;
  renderNoResult?: (
    commerceData: CommerceTypes.ProductIndex,
    handleFilterReset: () => void
  ) => JSX.Element;
  renderProductItem?: (data: CommerceTypes.Product) => JSX.Element;
  renderRefineActionBar?: (
    showFilterModal: () => void,
    showSortModal: () => void,
    commerceData: CommerceTypes.ProductIndex
  ) => JSX.Element;
  renderSort?: (
    handleSortChange: (sortItem: CommerceTypes.SortingOption) => void,
    commerceData: CommerceTypes.ProductIndex
  ) => JSX.Element;
  sortHeaderStyle?: string;
  sortListProps?: Partial<SelectableListProps>;
  FilterListDrilldownProps?: Partial<FilterListDrilldownProps>;
  style?: StyleProp<ViewStyle>;
  modalAnimationType?: 'none' | 'slide' | 'fade';
  modalType?: 'full-screen' | 'half-screen';
  filterType?: 'accordion' | 'drilldown';
  mergeSortToFilter?: boolean;
  filterInBackground?: boolean;
  renderModalLoading?: () => JSX.Element;
}

export type ProductIndexProps = UnwrappedProductIndexProps & WithProductIndexProviderProps;

export class ProductIndex extends Component<UnwrappedProductIndexProps & WithProductIndexProps> {
  onPress = (data: CommerceTypes.Product) => {
    return () => {
      if (this.props.onNavigate) {
        this.props.onNavigate(data);
      }
    };
  }

  componentDidUpdate(prevProps: UnwrappedProductIndexProps & WithProductIndexProps): void {
    if (this.props.commerceLoadData && !isEqual(prevProps.productQuery, this.props.productQuery)) {
      this.props.commerceLoadData();
    }
  }

  render(): JSX.Element {
    const { format, loadingStyle, style, commerceData } = this.props;
    const productIndexProps = {
      ...this.props,
      onPress: this.onPress
    };

    if (!commerceData) {
      return <Loading style={[S.loading, loadingStyle]} />;
    }
    let content = null;

    switch (format) {
      case 'grid':
        content = <ProductIndexGrid {...productIndexProps} />;
        break;
      case 'list':
        content = <ProductIndexGrid columns={1} {...productIndexProps} />;
        break;
      default:
        content = <ProductIndexGrid {...productIndexProps} />;
    }

    return <View style={[S.container, style]}>{content}</View>;
  }
}

export default withProductIndexData<UnwrappedProductIndexProps>(
  async (dataSource: CommerceDataSource, props: UnwrappedProductIndexProps) => {
    return dataSource.fetchProductIndex(props.productQuery);
  }
)(ProductIndex);
