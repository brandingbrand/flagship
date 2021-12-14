import React, { Component } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { isEqual, omit } from 'lodash-es';
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
  modalCancelButton?: boolean;
  fetchProducts?: (
    productQuery?: CommerceTypes.ProductQuery
  ) => Promise<CommerceTypes.ProductIndex>;
  format?: 'list' | 'grid';
  errorText?: string;
  errorTextStyle?: StyleProp<TextStyle>;
  filterHeaderTitle?: string;
  filterListProps?: Partial<FilterListProps>;
  showDrilldownClose?: boolean;
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
  renderGhost?: () => JSX.Element;
  setTitleTotalItem?: (count: number) => void;
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
    commerceData: CommerceTypes.ProductIndex,
    applyFilters?: (selectedItems: any, info?: { isButtonPress: boolean }) => void,
    resetFilters?: () => void
  ) => JSX.Element;
  renderSort?: (
    handleSortChange: (sortItem: CommerceTypes.SortingOption) => void,
    commerceData: CommerceTypes.ProductIndex,
    closeSortModal?: () => void
  ) => JSX.Element;
  sortHeaderStyle?: string;
  sortListProps?: Partial<SelectableListProps>;
  FilterListDrilldownProps?: Partial<FilterListDrilldownProps>;
  style?: StyleProp<ViewStyle>;
  modalAnimationType?: 'none' | 'slide' | 'fade';
  modalType?: 'full-screen' | 'half-screen';
  filterType?: 'accordion' | 'drilldown';
  refinementBlacklist?: string[];
  selectedRefinementBlacklist?: string[];
  mergeSortToFilter?: boolean;
  filterInBackground?: boolean;
  renderModalLoading?: () => JSX.Element;
  defaultSortOption?: string;
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
    const { format, loadingStyle, style, commerceData, modalCancelButton } = this.props;
    const productIndexProps = {
      ...this.props,
      onPress: this.onPress
    };

    if (!commerceData) {
      if (this.props.renderGhost) {
        return this.props.renderGhost();
      }
      return <Loading style={[S.loading, loadingStyle]} />;
    }
    let content = null;

    // Allow setting separate lists for selected refinements
    // or just use the same list for selected and unselected
    const selectedRefinementBlacklist: string[] | undefined =
      this.props.selectedRefinementBlacklist || this.props.refinementBlacklist;

    const filteredCommerceData = this.getCommerceData(commerceData, selectedRefinementBlacklist);

    switch (format) {
      case 'list':
        content = (
          <ProductIndexGrid
            columns={1}
            {...productIndexProps}
            commerceData={filteredCommerceData}
            headerWithCancelButton={modalCancelButton}
          />
        );
        break;
      case 'grid':
      default:
        content = (
          <ProductIndexGrid
            {...productIndexProps}
            commerceData={filteredCommerceData}
            headerWithCancelButton={modalCancelButton}
          />
        );
    }

    return <View style={[S.container, style]}>{content}</View>;
  }

  private getCommerceData = (
    commerceData: CommerceTypes.ProductIndex,
    selectedRefinementBlacklist?: string[]
  ) => {
    const filteredCommerceData = selectedRefinementBlacklist &&
    commerceData.selectedRefinements ? {
      ...commerceData,
      selectedRefinements: commerceData.selectedRefinements &&
        omit(commerceData.selectedRefinements, selectedRefinementBlacklist),
      refinements: commerceData.refinements && (this.props.refinementBlacklist ?
        commerceData.refinements.filter(refinement => {
          return this.props.refinementBlacklist?.indexOf(refinement.id) === -1;
        }) : commerceData.refinements)
    } : commerceData;

    if (!!filteredCommerceData.total && !!this.props.setTitleTotalItem) {
      this.props.setTitleTotalItem(filteredCommerceData.total);
    }

    return filteredCommerceData;
  }
}

export default withProductIndexData<UnwrappedProductIndexProps>(
  async (dataSource: CommerceDataSource, props: UnwrappedProductIndexProps) => {
    return dataSource.fetchProductIndex(props.productQuery);
  }
)(ProductIndex);
