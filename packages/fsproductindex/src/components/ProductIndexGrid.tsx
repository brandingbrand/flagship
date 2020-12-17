import { CommerceTypes } from '@brandingbrand/fscommerce';
import React, { Component } from 'react';
import { get } from 'lodash-es';
import pluralize from 'pluralize';
import { UnwrappedProductIndexProps as ProductIndexPropType } from './ProductIndex';
import { WithProductIndexProps } from './ProductIndexProvider';

import ProductList from './ProductList';

import {
  FilterItem,
  FilterItemValue,
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
import {
  Image,
  ListRenderItemInfo,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const images = {
  close: require('../../assets/images/iconClose.png')
};

const styles = StyleSheet.create({
  cancelButton: {
    position: 'absolute',
    top: 16,
    right: 21.5
  }
});

const componentTranslationKeys = translationKeys.flagship.productIndex;

export interface PropTyps extends ProductIndexPropType {
  onPress: (data: CommerceTypes.Product) => () => void;
  containerStyle?: StyleProp<ViewStyle>;
  headerWithCancelButton?: boolean;
}

const defaultErrorMessage =
  'We were unable to load the information at this time. Please try again.';
const SORT_ITEM_KEY = '__pirate_sort';

export interface StateType {
  sortModalVisible: boolean;
  filterModalVisible: boolean;
  isLoading: boolean;
  isMoreLoading: boolean;
  hasFetchError: boolean;
}

export default class ProductIndexGrid extends Component<
  PropTyps & WithProductIndexProps,
  StateType
> {
  constructor(props: PropTyps & WithProductIndexProps) {
    super(props);

    const { commerceData, onLoadComplete } = props;
    let maxPageLoaded = 1;
    let maxCount = 1;
    if (commerceData) {
      maxCount = this.maxCount(commerceData);
      if (commerceData.page) {
        maxPageLoaded = commerceData.page;
        if (commerceData.limit && commerceData.products) {
          maxCount = (commerceData.limit * (commerceData.page - 1)) + commerceData.products.length;
        }
      }
      if (onLoadComplete) {
        onLoadComplete(this.loadMore, maxPageLoaded < this.maxPage(commerceData),
          maxCount, maxCount);
      }
    }

    this.state = {
      sortModalVisible: false,
      filterModalVisible: false,
      isLoading: false,
      isMoreLoading: false,
      hasFetchError: false
    };

  }

  maxCount = (commerceData?: CommerceTypes.ProductIndex): number => {
    if (commerceData && commerceData.limit && commerceData.total && commerceData.page) {
      const maxPage = this.maxPage(commerceData);
      if (commerceData.page < maxPage) {
        return commerceData.page * commerceData.limit;
      } else {
        return commerceData.total;
      }
    } else {
      return 0;
    }
  }

  maxPage = (commerceData?: CommerceTypes.ProductIndex) => {
    if (commerceData && commerceData.total && commerceData.limit) {
      return Math.ceil(commerceData.total / commerceData.limit);
    }
    return 1;
  }

  renderItem = ({ item }: ListRenderItemInfo<CommerceTypes.Product>): JSX.Element => {
    const { productItemProps, onPress, renderProductItem } = this.props;
    if (renderProductItem) {
      return renderProductItem(item);
    }

    return (
      <ProductItem
        style={S.productItem}
        id={item.id}
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

  renderActionBar = () => {
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
        commerceData,
        this.handleFilterApply,
        this.handleFilterReset
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

  renderHeader = () => {
    const { commerceData } = this.props;

    if (!commerceData) {
      return null;
    }

    let loadPrev: JSX.Element | null = null;
    if (this.props.renderLoadPrev) {
      if (this.state.isMoreLoading) {
        loadPrev = this.props.renderLoading ? (
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
      } else {
        loadPrev = this.props.renderLoadPrev(
          this.loadPrev,
          (commerceData.minPage || commerceData.page || 1) > 1
        );
      }
    }

    return (
      <View>
        {loadPrev}
        {this.renderActionBar()}
      </View>
    );
  }

  showFilterModal = () => {
    this.setState({ filterModalVisible: true });
  }

  closeFilterModal = () => {
    this.setState({ filterModalVisible: false });
  }

  showSortModal = () => {
    this.setState({ sortModalVisible: true });
  }

  closeSortModal = () => {
    this.setState({ sortModalVisible: false });
  }

  handleFilterApply = (selectedItems: any, info?: { isButtonPress: boolean }) => {
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
      this.props.handleFilterApply(selectedItems, info);
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

  handleSortChange = (selectedItems?: Record<string, string[]>) => (
    sortItem: CommerceTypes.SortingOption
  ) => {
    let refinementsQuery: CommerceTypes.ProductQuery = {};

    if (selectedItems && Object.keys(selectedItems).length > 0) {
      refinementsQuery = {refinements: selectedItems};
    }

    this.closeSortModal();
    if (this.props.handleSortChange) {
      this.props.handleSortChange(sortItem.id);
    } else if (sortItem.id === 'default') {
      this.reloadByQuery({
        sortBy: undefined,
        ...refinementsQuery
      });
    } else {
      this.reloadByQuery({
        sortBy: sortItem.id,
        ...refinementsQuery
      });
    }
  }

  reloadByQuery = (query: CommerceTypes.ProductQuery) => {
    this.setState({ isLoading: true, hasFetchError: false });
    this.fetchByExtraQuery(query)
      .then((data: CommerceTypes.ProductIndex) => {
        this.handleNewData(data);
        this.setState({
          isLoading: false
        });
      })
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
        this.setState({
          isLoading: false
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          hasFetchError: true
        });
      });
  }

  handleNewData = (data: CommerceTypes.ProductIndex) => {
    const newState: any = {};
    const maxPageLoaded = data.page || 1;
    const maxCount = this.maxCount(data);

    if (this.props.onLoadComplete) {
      this.props.onLoadComplete(this.loadMore, maxPageLoaded < this.maxPage(data),
        maxCount, maxCount);
    }
    this.setState(newState);

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

  renderCancelButton = (onPress: () => void) => {
    return (
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Image source={images.close} />
      </TouchableOpacity>
    );
  }

  renderCancelText = (onPress: () => void) => {
    return (
      <TouchableOpacity
        style={[S.modalHeaderClose, this.props.modalCancelStyle]}
        onPress={onPress}
      >
        <Text style={S.modalHeaderCloseText}>
          {FSI18n.string(componentTranslationKeys.cancel)}
        </Text>
      </TouchableOpacity>
    );
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
        {
          this.props.headerWithCancelButton
            ? this.renderCancelButton(onPress)
            : this.renderCancelText(onPress)
        }
        <Text style={[S.modalHeaderText, this.props.modalHeaderTextStyle]}>
          {title}
        </Text>
      </View>
    );
  }

  // tslint:disable-next-line:cyclomatic-complexity
  renderSortModal = () => {
    if (this.props.hideActionBar) {
      return null;
    }

    const { commerceData, defaultSortOption } = this.props;
    let content = null;

    const sortOptions = commerceData?.sortingOptions ? [...commerceData.sortingOptions] : [];

    if (defaultSortOption) {
      sortOptions.unshift({
        id: 'default',
        title: defaultSortOption
      });
    }

    const selectedOption = commerceData?.selectedSortingOption ?
      commerceData?.selectedSortingOption : 'default';

    const selectedItems: Record<string, string[]> | undefined = this.props.mergeSortToFilter &&
      commerceData?.selectedSortingOption
      ? this.mergeSelectedRefinementsAndSort(
        commerceData.selectedRefinements,
        commerceData.selectedSortingOption
      )
      : commerceData?.selectedRefinements;

    if (commerceData) {
      if (this.props.renderSort) {
        content = this.props.renderSort(this.handleSortChange(selectedItems), commerceData);
      } else if (sortOptions) {
        content = (
          <SafeAreaView style={S.modalContainer}>
            {this.renderModalHeader({
              title: this.props.sortHeaderStyle || 'Sort By',
              onPress: this.closeSortModal
            })}
            <SelectableList
              items={sortOptions}
              onChange={this.handleSortChange(selectedItems)}
              selectedId={selectedOption}
              {...this.props.sortListProps}
            />
          </SafeAreaView>
        );
      }
    }

    return this.renderModal({
      content,
      visible: this.state.sortModalVisible,
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

  mergeRefinementsAndSort = (
    refinementsData?: CommerceTypes.Refinement[],
    sortingData?: CommerceTypes.SortingOption[]
  ) => {
    const refinements = refinementsData ? [...refinementsData] : [];
    refinements.unshift({
      id: SORT_ITEM_KEY,
      title: 'Sort By',
      values: sortingData ? sortingData.map((item: CommerceTypes.SortingOption) => ({
        id: item.id,
        value: item.id,
        title: item.title
      })) : []
    });

    return refinements;
  }

  mergeSelectedRefinementsAndSort = (
    selectedRefinements: Record<string, string[]> | undefined,
    selectedSortId: string
  ): Record<string, string[]> => {
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
        <SafeAreaView style={S.modalContainer}>
          <FilterListDrilldown
            items={items}
            onApply={this.handleFilterApply}
            onReset={this.handleFilterReset}
            onClose={this.props.showDrilldownClose ? this.closeFilterModal : undefined}
            selectedItems={selectedItems}
            renderFilterItem={this.renderItemForCombinedFilterAndSort}
            renderFilterItemValue={this.renderItemValueForCombinedFilterAndSort}
            applyOnSelect={this.props.filterInBackground}
            singleFilterIds={
              this.props.mergeSortToFilter ? [SORT_ITEM_KEY] : undefined
            }
            {...this.props.FilterListDrilldownProps}
          />
        </SafeAreaView>
      );
    } else {
      content = (
        <View style={S.modalContainer}>
          {this.renderModalHeader({
            title: this.props.filterHeaderTitle || 'Filter By',
            onPress: this.closeFilterModal
          })}

          <FilterList
            items={commerceData.refinements || []}
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
      visible: this.state.filterModalVisible,
      closeModal: this.closeFilterModal
    });
  }

  renderItemForCombinedFilterAndSort = (
    item: FilterItem,
    index: number,
    selectedValues: string[],
    handlePress: () => void,
    renderFilterItem: (
      info: Omit<ListRenderItemInfo<FilterItem>, 'separators'>,
      skipCustomRender: boolean
    ) => JSX.Element
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
    item: FilterItem,
    index: number,
    value: FilterItemValue,
    handleSelect: () => void,
    selected: boolean,
    renderFilterItemValue: (
      item: FilterItem,
      skipCustomRender?: boolean
    ) => (info: Omit<ListRenderItemInfo<FilterItemValue>, 'separators'>) => JSX.Element
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
          onPress={this.handleSortSelectedInRefine(value, selected)}
          {...selectableRowProps}
        />
      );
    } else {
      return renderFilterItemValue(item, true)({item: value, index});
    }
  }

  handleSortSelectedInRefine = (value: any, selected: any) => () => {
    this.closeFilterModal();
    // TODO: Test is needed.
    this.handleSortChange(selected)(value);
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

  loadPage = (page: number) => {
    const {
      commerceData,
      commerceProviderLoadMore
    } = this.props;

    if (!commerceData) {
      // Cannot load more
      return;
    }

    this.setState({
      isMoreLoading: true
    });

    const newQuery = this.newProductQuery({ page });
    if (commerceProviderLoadMore) {
      commerceProviderLoadMore(newQuery)
        .then((data: CommerceTypes.ProductIndex) => {
          this.handleNewData(data);
          this.setState({
            isMoreLoading: false
          });
        })
        .catch(() => {
          this.setState({
            isMoreLoading: false
          });
        });
    }
  }

  loadPrev = () => {
    const { commerceData } = this.props;
    if (commerceData) {
      this.loadPage((commerceData.minPage || commerceData.page || 1) - 1);
    }
  }

  loadMore = () => {
    const { commerceData } = this.props;
    if (commerceData) {
      this.loadPage((commerceData.page || 1) + 1);
    }
  }

  renderFooter = () => {
    const { commerceData } = this.props;
    const hasAnotherPage: boolean = commerceData !== undefined && commerceData.page !== undefined &&
      commerceData.page < this.maxPage(commerceData);
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
        hasAnotherPage
      );
    }

    if (!hasAnotherPage) {
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

  // tslint:disable-next-line: cyclomatic-complexity
  render(): React.ReactNode {
    const {
      commerceData,
      listStyle,
      columns,
      gridProps,
      loadingStyle,
      errorText,
      errorTextStyle,
      containerStyle
    } = this.props;

    if (this.state.isLoading && !this.props.filterInBackground) {
      if (this.props.renderGhost) {
        return this.props.renderGhost();
      }
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
      <View style={[S.container, containerStyle]}>
        <ProductList
          style={[S.list, listStyle]}
          columns={columns}
          items={commerceData.products}
          renderItem={this.renderItem}
          renderHeader={this.renderHeader}
          renderFooter={this.renderFooter}
          gridProps={gridProps}
        />
        {this.state.sortModalVisible && this.renderSortModal()}
        {this.state.filterModalVisible && this.renderFilterModal()}
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
