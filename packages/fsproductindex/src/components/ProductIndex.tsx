import React, { Component } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { isEqual } from 'lodash-es';
import {
  CommerceDataSource,
  CommerceTypes
} from '@brandingbrand/fscommerce';
import { Loading } from '@brandingbrand/fscomponents';

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
  filterListProps?: any;
  gridProps?: any;
  handleFilterApply?: (data: any) => void;
  handleFilterReset?: () => void;
  onLoadComplete?: (
    loadMore: Function,
    hasAnotherPage?: boolean,
    count?: number,
    responseCount?: number
  ) => void;
  handleSortChange?: (data: any) => void;
  hideActionBar?: boolean;
  keywords?: any;
  listStyle?: any;
  loadingStyle?: any;
  loadMoreButtonStyle?: StyleProp<ViewStyle>;
  loadMoreButtonTextStyle?: StyleProp<TextStyle>;
  loadMoreLoadingStyle?: StyleProp<ViewStyle>;
  modalCancelStyle?: StyleProp<ViewStyle>;
  modalHeaderStyle?: StyleProp<ViewStyle>;
  modalHeaderTextStyle?: StyleProp<TextStyle>;
  onNavigate?: (data: any) => void;
  productItemProps?: any;
  productQuery: CommerceTypes.ProductQuery;
  refineActionBarProps?: any;
  renderFilter?: (
    handleFilterApply: Function,
    handleFilterReset: Function,
    commerceData: CommerceTypes.ProductIndex
  ) => JSX.Element;
  renderLoadMore?: (loadMore: Function, hasAnotherPage: boolean) => JSX.Element;
  renderLoading?: () => JSX.Element;
  renderNoResult?: (
    commerceData: CommerceTypes.ProductIndex,
    handleFilterReset: Function
  ) => JSX.Element;
  renderProductItem?: (data: CommerceTypes.Product) => JSX.Element;
  renderRefineActionBar?: (
    showFilterModal: Function,
    showSortModal: Function,
    commerceData: CommerceTypes.ProductIndex
  ) => JSX.Element;
  renderSort?: (
    handleSortChange: Function,
    commerceData: CommerceTypes.ProductIndex
  ) => JSX.Element;
  sortHeaderStyle?: string;
  sortListProps?: any;
  FilterListDrilldownProps?: any;
  style?: any;
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
