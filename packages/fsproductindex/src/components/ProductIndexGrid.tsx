import { CommerceTypes } from '@brandingbrand/fscommerce';
import React, { Component } from 'react';
import { get } from 'lodash-es';
import pluralize from 'pluralize';
import { UnwrappedProductIndexProps as ProductIndexPropType } from './ProductIndex';
import { WithProductIndexProps } from './ProductIndexProvider';

import ProductList from './ProductList';

import {
  FilterList,
  FilterListDrilldown,
  Loading,
  Modal,
  ModalHalfScreen,
  ProductItem,
  RefineActionBar,
  SelectableList,
  SelectableRow
} from '@brandingbrand/fscomponents';

import { style as S } from '../styles/ProductIndex';
import { ListRenderItemInfo, Text, TouchableOpacity, View } from 'react-native';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.productIndex;

export interface PropTyps extends ProductIndexPropType {
  onPress: (data: CommerceTypes.Product) => () => void;
}

const defaultErrorMessage =
  'We were unable to load the information at this time. Please try again.';
const SORT_ITEM_KEY = '__pirate_sort';

export interface StateType {
  sortModalVisble: boolean;
  filterModalVisble: boolean;
  isLoading: boolean;
  isMoreLoading: boolean;
  hasAnotherPage: boolean;
  hasFetchError: boolean;
}

export default class ProductIndexGrid extends Component<
  PropTyps & WithProductIndexProps,
  StateType
> {
  page: number = 1;

  constructor(props: PropTyps & WithProductIndexProps) {
    super(props);

    const { commerceData, onLoadComplete } = props;

    const hasAnotherPage = this.hasAnotherPage(commerceData);

    this.state = {
      sortModalVisble: false,
      filterModalVisble: false,
      isLoading: false,
      isMoreLoading: false,
      hasFetchError: false,
      hasAnotherPage
    };

    if (commerceData && onLoadComplete) {
      const count = commerceData.products && commerceData.products.length;

      onLoadComplete(this.loadMore, hasAnotherPage, count, count);
    }
  }

  hasAnotherPage = (data?: CommerceTypes.ProductIndex) => {
    if (!data || !data.page || !data.total) {
      return false;
    }

    // fall back to count instead of limit in instances where limit wasn't specified in query
    return data.page * (data.limit || data.products.length) < data.total;
  }

  renderItem = ({ item }: ListRenderItemInfo<CommerceTypes.Product>): JSX.Element => {
    const { productItemProps, onPress, renderProductItem } = this.props;
    if (renderProductItem) {
      return renderProductItem(item);
    }

    return (
      <ProductItem
        style={S.productItem}
        title={item.title}
        brand={item.brand}
        image={item.images && item.images.find(img => !!img.uri)}
        imageStyle={S.productImage}
        price={item.price}
        originalPrice={item.originalPrice}
        variantText={getVariantText(item)}
        promos={item.promotions}
        reviewValue={get(item, 'review.summary.averageRating')}
        reviewCount={get(item, 'review.summary.reviewCount')}
        onPress={onPress(item)}
        {...productItemProps}
      />
    );
  }

  renderHeader = () => {
    const {
      commerceData,
      hideActionBar,
      mergeSortToFilter,
      refineActionBarProps,
      renderRefineActionBar
    } = this.props;

    if (hideActionBar || !commerceData) {
      return null;
    }

    if (renderRefineActionBar) {
      return renderRefineActionBar(
        this.showFilterModal,
        this.showSortModal,
        commerceData
      );
    }

    return (
      <RefineActionBar
        style={S.actionBar}
        onSortPress={this.showSortModal}
        onFilterPress={this.showFilterModal}
        sortButtonStyle={mergeSortToFilter ? { display: 'none' } : null}
        {...refineActionBarProps}
      />
    );
  }

  showFilterModal = () => {
    this.setState({ filterModalVisble: true });
  }

  closeFilterModal = () => {
    this.setState({ filterModalVisble: false });
  }

  showSortModal = () => {
    this.setState({ sortModalVisble: true });
  }

  closeSortModal = () => {
    this.setState({ sortModalVisble: false });
  }

  handleFilterApply = (selectedItems: any, info: any) => {
    if (!this.props.filterInBackground) {
      this.closeFilterModal();
    } else {
      if (info && info.isButtonPress) {
        this.closeFilterModal();
        return;
      }
    }
    let sortQuery = {};
    let refinementsQuery = {};

    if (selectedItems[SORT_ITEM_KEY]) {
      sortQuery = { sortBy: selectedItems[SORT_ITEM_KEY][0] };
      delete selectedItems[SORT_ITEM_KEY];
    }

    if (Object.keys(selectedItems).length > 0) {
      refinementsQuery = { refinements: selectedItems };
    }

    if (this.props.handleFilterApply) {
      this.props.handleFilterApply(selectedItems);
    } else {
      this.reloadByQuery({
        ...refinementsQuery,
        ...sortQuery
      });
    }
  }

  handleFilterReset = () => {
    if (!this.props.filterInBackground) {
      this.closeFilterModal();
    }
    if (this.props.handleFilterReset) {
      this.props.handleFilterReset();
    } else {
      this.reloadWithReset();
    }
  }

  handleSortChange = (sortItem: CommerceTypes.SortingOption) => {
    this.closeSortModal();
    if (this.props.handleSortChange) {
      this.props.handleSortChange(sortItem.id);
    } else {
      this.reloadByQuery({
        sortBy: sortItem.id
      });
    }
  }

  reloadByQuery = (query: CommerceTypes.ProductQuery) => {
    this.setState({ isLoading: true, hasFetchError: false });
    this.fetchByExtraQuery(query)
      .then(this.handleNewData)
      .catch(() => {
        this.setState({
          isLoading: false,
          hasFetchError: true
        });
      });
  }

  reloadWithReset = () => {
    this.setState({ isLoading: true, hasFetchError: false });

    const productQuery: CommerceTypes.ProductQuery = { ...this.props.productQuery };
    delete productQuery.refinements;
    delete productQuery.sortBy;

    let fetchProducts = null;
    if (this.props.fetchProducts) {
      fetchProducts = this.props.fetchProducts(productQuery);
    } else if (this.props.commerceDataSource && this.props.commerceDataSource.fetchProductIndex) {
      fetchProducts = this.props.commerceDataSource.fetchProductIndex(productQuery);
    } else {
      throw new Error('FSProductIndex: [props.fetchProducts] '
        + 'or [props.commerceDataSource.fetchProductIndex] is required');
    }

    fetchProducts
      .then(data => {
        if (this.props.filterInBackground) {
          this.closeFilterModal();
        }
        this.handleNewData(data);
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          hasFetchError: true
        });
      });
  }

  handleNewData = (data: any) => {
    this.page = 1;
    const hasAnotherPage = this.hasAnotherPage(data);
    if (this.props.onLoadComplete) {
      const count = data.products && data.products.length;
      this.props.onLoadComplete(this.loadMore, hasAnotherPage, count, count);
    }
    this.setState({
      isLoading: false,
      hasAnotherPage
    });

    if (this.props.commerceLoadData) {
      this.props.commerceLoadData(data);
    }
  }

  /**
   * refetch commerce data and preserve existing sort/filter
   */
  fetchByExtraQuery = async (
    query: CommerceTypes.ProductQuery
  ): Promise<CommerceTypes.ProductIndex> => {
    const {
      commerceDataSource
    } = this.props;

    const newQuery = this.newProductQuery(query);

    if (this.props.fetchProducts) {
      return this.props.fetchProducts(newQuery);
    } else if (commerceDataSource) {
      return commerceDataSource.fetchProductIndex(newQuery);
    } else {
      throw new Error('FSProductIndex: [props.fetchProducts] '
        + 'or [props.commerceDataSource.fetchProductIndex] is required');
    }
  }

  newProductQuery = (query: CommerceTypes.ProductQuery) => {
    const {
      commerceDataSource,
      productQuery,
      commerceData
    } = this.props;

    const newQuery: CommerceTypes.ProductQuery = {
      ...productQuery
    };

    if (commerceData) {
      if (commerceData.selectedSortingOption) {
        newQuery.sortBy = commerceData.selectedSortingOption;
      }

      if (commerceData.selectedRefinements &&
        Object.keys(commerceData.selectedRefinements).length >
        ((commerceDataSource && commerceDataSource.minRefinements) || 0)
      ) {
        newQuery.refinements = commerceData.selectedRefinements;
      }

      Object.assign(newQuery, query);
    }


    return newQuery;
  }

  renderModalHeader = ({ title, onPress }: any) => {
    const drilldownStyle =
      this.props.filterType === 'drilldown'
        ? { height: 50, paddingTop: 0 }
        : null;

    return (
      <View
        style={[S.modalHeader, drilldownStyle, this.props.modalHeaderStyle]}
      >
        <TouchableOpacity
          style={[S.modalHeaderClose, this.props.modalCancelStyle]}
          onPress={onPress}
        >
          <Text style={S.modalHeaderCloseText}>
            {FSI18n.string(componentTranslationKeys.cancel)}
          </Text>
        </TouchableOpacity>
        <Text style={[S.modalHeaderText, this.props.modalHeaderTextStyle]}>
          {title}
        </Text>
      </View>
    );
  }

  renderSortModal = () => {
    if (this.props.hideActionBar) {
      return null;
    }

    const { commerceData } = this.props;
    let content = null;

    if (commerceData) {
      if (this.props.renderSort) {
        content = this.props.renderSort(this.handleSortChange, commerceData);
      } else {
        content = (
          <View style={S.modalContainer}>
            {this.renderModalHeader({
              title: this.props.sortHeaderStyle || 'Sort By',
              onPress: this.closeSortModal
            })}
            <SelectableList
              items={commerceData.sortingOptions}
              onChange={this.handleSortChange}
              selectedId={commerceData.selectedSortingOption}
              {...this.props.sortListProps}
            />
          </View>
        );
      }
    }

    return this.renderModal({
      content,
      visible: this.state.sortModalVisble,
      closeModal: this.closeSortModal
    });
  }

  renderModal = ({ content, visible, closeModal }: any) => {
    const SelectedModal: any =
      this.props.modalType === 'half-screen' ? ModalHalfScreen : Modal;
    return (
      <SelectedModal
        animationType={this.props.modalAnimationType || 'slide'}
        visible={visible}
        onRequestClose={closeModal}
      >
        {content}
        {this.state.isLoading &&
          this.props.filterInBackground &&
          (this.props.renderModalLoading ? (
            this.props.renderModalLoading()
          ) : (
            <View style={S.modelLoadingContainer}>
              <Loading />
            </View>
          ))}
      </SelectedModal>
    );
  }

  mergeRefinementsAndSort = (refinementsData: any, sortingData: any) => {
    const refinements = [...refinementsData];
    refinements.unshift({
      id: SORT_ITEM_KEY,
      title: 'Sort By',
      values: sortingData.map((item: any) => ({
        id: item.id,
        value: item.id,
        title: item.title
      }))
    });

    return refinements;
  }

  mergeSelectedRefinementsAndSort = (
    selectedRefinements: any,
    selectedSortId: string
  ) => {
    return {
      ...selectedRefinements,
      [SORT_ITEM_KEY]: [selectedSortId]
    };
  }

  // tslint:disable-next-line:cyclomatic-complexity
  renderFilterModal = () => {
    if (this.props.hideActionBar) {
      return null;
    }

    const { commerceData } = this.props;

    if (!(commerceData && commerceData.refinements)) {
      return null;
    }

    let content = null;

    if (this.props.renderFilter) {
      content = this.props.renderFilter(
        this.handleFilterApply,
        this.handleFilterReset,
        commerceData
      );
    } else if (this.props.filterType === 'drilldown') {
      const items = this.props.mergeSortToFilter
        ? this.mergeRefinementsAndSort(
            commerceData.refinements,
            commerceData.sortingOptions
          )
        : commerceData.refinements;

      const selectedItems = this.props.mergeSortToFilter && commerceData.selectedSortingOption
        ? this.mergeSelectedRefinementsAndSort(
            commerceData.selectedRefinements,
            commerceData.selectedSortingOption
          )
        : commerceData.selectedRefinements;

      content = (
        <View style={S.modalContainer}>
          <FilterListDrilldown
            items={items}
            onApply={this.handleFilterApply}
            onReset={this.handleFilterReset}
            selectedItems={selectedItems}
            renderFilterItem={this.renderItemForCombinedFilterAndSort}
            renderFilterItemValue={this.renderItemValueForCombinedFilterAndSort}
            applyOnSelect={this.props.filterInBackground}
            singleFilterIds={
              this.props.mergeSortToFilter ? [SORT_ITEM_KEY] : null
            }
            {...this.props.FilterListDrilldownProps}
          />
        </View>
      );
    } else {
      content = (
        <View style={S.modalContainer}>
          {this.renderModalHeader({
            title: this.props.filterHeaderTitle || 'Filter By',
            onPress: this.closeFilterModal
          })}

          <FilterList
            items={commerceData.refinements}
            onApply={this.handleFilterApply}
            onReset={this.handleFilterReset}
            selectedItems={commerceData.selectedRefinements}
            {...this.props.filterListProps}
          />
        </View>
      );
    }

    return this.renderModal({
      content,
      visible: this.state.filterModalVisble,
      closeModal: this.closeFilterModal
    });
  }

  renderItemForCombinedFilterAndSort = (
    item: any,
    index: any,
    selectedValues: any,
    handlePress: any,
    renderFilterItem: any
  ) => {
    if (item.id === SORT_ITEM_KEY) {
      return (
        <View>
          {renderFilterItem({item, index}, true)}
          <View style={{ padding: 15, backgroundColor: '#eee' }}>
            <Text>
              {FSI18n.string(componentTranslationKeys.filterBy)}
            </Text>
          </View>
        </View>
      );
    } else {
      return renderFilterItem({item, index}, true);
    }
  }

  renderItemValueForCombinedFilterAndSort = (
    item: any,
    index: any,
    value: any,
    handleSelect: any,
    selected: any,
    renderFilterItemValue: any
  ) => {
    if (item.id === SORT_ITEM_KEY) {
      const selectableRowProps =
        this.props.FilterListDrilldownProps &&
        this.props.FilterListDrilldownProps.selectableRowProps;
      return (
        <SelectableRow
          key={index}
          title={value.title}
          selected={selected}
          onPress={this.handleSortSelectedInRefine(value)}
          {...selectableRowProps}
        />
      );
    } else {
      return renderFilterItemValue(item, true)({item: value, index});
    }
  }

  handleSortSelectedInRefine = (value: any) => () => {
    this.closeFilterModal();
    this.handleSortChange(value);
  }

  renderNoResult = () => {
    const { commerceDataSource, commerceData } = this.props;

    if (!commerceData) {
      return null;
    }

    if (this.props.renderNoResult) {
      return this.props.renderNoResult(
        commerceData,
        this.handleFilterReset
      );
    }

    const shouldShowReset =
      commerceData.selectedRefinements &&
      Object.keys(commerceData.selectedRefinements).length >
        ((commerceDataSource && commerceDataSource.minRefinements) || 0);

    return (
      <View style={S.noResultContainer}>
        <Text style={S.noResultText}>
          {FSI18n.string(componentTranslationKeys.noResults)}
        </Text>
        {shouldShowReset && (
          <TouchableOpacity
            style={S.resetButton}
            onPress={this.handleFilterReset}
          >
            <Text>
              {FSI18n.string(componentTranslationKeys.resetFilters)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  loadMore = () => {
    const {
      commerceData,
      commerceProviderLoadMore
    } = this.props;

    if (!commerceData || !commerceData.page) {
      // Cannot load more
      return;
    }

    this.setState({
      isMoreLoading: true
    });

    const newQuery = this.newProductQuery({ page: commerceData.page + 1 });
    if (commerceProviderLoadMore) {
      commerceProviderLoadMore(newQuery)
        .then(data => {
          const hasAnotherPage = this.hasAnotherPage(data);
          let totalCount: number = 0;

          // TODO: Pageable properties should not be optional on Product Index type
          if (data.limit && data.page) {
            totalCount = (data.limit * (data.page - 1)) + data.products.length;
          }

          if (this.props.onLoadComplete) {
            this.props.onLoadComplete(
              this.loadMore,
              hasAnotherPage,
              totalCount,
              data.products.length
            );
          }
          this.setState({
            isMoreLoading: false,
            hasAnotherPage
          });
        })
        .catch(() => {
          this.setState({
            isMoreLoading: false
          });
        });
    }
  }

  renderFooter = () => {
    if (this.state.isMoreLoading) {
      return this.props.renderLoading ? (
        this.props.renderLoading()
      ) : (
        <Loading
          style={[
            S.loading,
            S.loadingLoadMore,
            this.props.loadMoreLoadingStyle
          ]}
        />
      );
    }

    if (this.props.renderLoadMore) {
      return this.props.renderLoadMore(
        this.loadMore,
        this.state.hasAnotherPage
      );
    }

    if (!this.state.hasAnotherPage) {
      return null;
    }

    return (
      <View style={S.footer}>
        <TouchableOpacity
          style={[S.loadMoreButton, this.props.loadMoreButtonStyle]}
          onPress={this.loadMore}
        >
          <Text style={this.props.loadMoreButtonTextStyle}>
            {FSI18n.string(componentTranslationKeys.loadMore)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render(): React.ReactNode {
    const {
      commerceData,
      listStyle,
      columns,
      gridProps,
      loadingStyle,
      errorText,
      errorTextStyle
    } = this.props;

    if (this.state.isLoading && !this.props.filterInBackground) {
      return <Loading style={[S.loading, loadingStyle]} />;
    }

    if (this.state.hasFetchError) {
      return (
        <Text style={[S.error, errorTextStyle]}>
          {errorText || defaultErrorMessage}
        </Text>
      );
    }

    if (!commerceData || !commerceData.products || !commerceData.products.length) {
      return this.renderNoResult();
    }

    return (
      <View style={S.container}>
        <ProductList
          style={[S.list, listStyle]}
          columns={columns}
          items={commerceData.products}
          renderItem={this.renderItem}
          renderHeader={this.renderHeader}
          renderFooter={this.renderFooter}
          gridProps={gridProps}
        />
        {this.state.sortModalVisble && this.renderSortModal()}
        {this.state.filterModalVisble && this.renderFilterModal()}
      </View>
    );
  }
}

function getVariantText(item: CommerceTypes.Product): string {
  return (item.options || [])
    .map(option => {
      if (option.values && option.values.length > 1) {
        return pluralize(option.name, option.values.length, true);
      } else {
        return '';
      }
    })
    .join(' ');
}
