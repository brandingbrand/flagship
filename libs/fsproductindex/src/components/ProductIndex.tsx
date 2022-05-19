import React, { Component } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { View } from 'react-native';

import type { CommerceDataSource, CommerceTypes } from '@brandingbrand/fscommerce';
import type {
  FilterListDrilldownProps,
  FilterListProps,
  GridProps,
  ProductItemProps,
  RefineActionBarProps,
  SelectableListProps,
} from '@brandingbrand/fscomponents';
import { Loading } from '@brandingbrand/fscomponents';

import { isEqual, omit } from 'lodash-es';

import { style as S } from '../styles/ProductIndex';

import ProductIndexGrid from './ProductIndexGrid';
import type { WithProductIndexProps, WithProductIndexProviderProps } from './ProductIndexProvider';
import { default as withProductIndexData } from './ProductIndexProvider';

export interface UnwrappedProductIndexProps {
  columns?: number;
  modalCancelButton?: boolean;
  fetchProducts?: (
    productQuery?: CommerceTypes.ProductQuery
  ) => Promise<CommerceTypes.ProductIndex>;
  format?: 'grid' | 'list';
  errorText?: string;
  errorTextStyle?: StyleProp<TextStyle>;
  filterHeaderTitle?: string;
  filterListProps?: Partial<FilterListProps>;
  showDrilldownClose?: boolean;
  gridProps?: Partial<GridProps<unknown>>;
  handleFilterApply?: (data: unknown, info?: { isButtonPress: boolean }) => void;
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
    handleFilterApply: (data: unknown, info?: { isButtonPress: boolean }) => void,
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
    applyFilters?: (selectedItems: unknown, info?: { isButtonPress: boolean }) => void,
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
  modalAnimationType?: 'fade' | 'none' | 'slide';
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
  private readonly onPress = (data: CommerceTypes.Product) => () => {
    if (this.props.onNavigate) {
      this.props.onNavigate(data);
    }
  };

  private readonly getCommerceData = (
    commerceData: CommerceTypes.ProductIndex,
    selectedRefinementBlacklist?: string[]
  ) => {
    const filteredCommerceData =
      selectedRefinementBlacklist && commerceData.selectedRefinements
        ? {
            ...commerceData,
            selectedRefinements:
              commerceData.selectedRefinements &&
              omit(commerceData.selectedRefinements, selectedRefinementBlacklist),
            refinements:
              commerceData.refinements &&
              (this.props.refinementBlacklist
                ? commerceData.refinements.filter(
                    (refinement) => this.props.refinementBlacklist?.indexOf(refinement.id) === -1
                  )
                : commerceData.refinements),
          }
        : commerceData;

    if (filteredCommerceData.total !== undefined && this.props.setTitleTotalItem !== undefined) {
      this.props.setTitleTotalItem(filteredCommerceData.total);
    }

    return filteredCommerceData;
  };

  public componentDidUpdate(prevProps: UnwrappedProductIndexProps & WithProductIndexProps): void {
    if (this.props.commerceLoadData && !isEqual(prevProps.productQuery, this.props.productQuery)) {
      this.props.commerceLoadData();
    }
  }

  public render(): JSX.Element {
    const { commerceData, format, loadingStyle, modalCancelButton, style } = this.props;
    const productIndexProps = {
      ...this.props,
      onPress: this.onPress,
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
}

export default withProductIndexData<UnwrappedProductIndexProps>(
  async (dataSource: CommerceDataSource, props: UnwrappedProductIndexProps) =>
    dataSource.fetchProductIndex(props.productQuery)
)(ProductIndex);
