import React, { Component } from 'react';

import type { ListRenderItemInfo, StyleProp, ViewStyle } from 'react-native';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { CommerceTypes } from '@brandingbrand/fscommerce';
import type { FilterItem, FilterItemValue } from '@brandingbrand/fscomponents';
import {
  FilterList,
  FilterListDrilldown,
  Loading,
  Modal,
  ModalHalfScreen,
  ProductItem,
  RefineActionBar,
  SelectableList,
  SelectableRow,
} from '@brandingbrand/fscomponents';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { get } from 'lodash-es';
import pluralize from 'pluralize';

import close from '../../assets/images/iconClose.png';
import { style as S } from '../styles/ProductIndex';

import type { UnwrappedProductIndexProps as ProductIndexPropType } from './ProductIndex';
import type { WithProductIndexProps } from './ProductIndexProvider';
import { ProductList } from './ProductList';

const images = {
  close,
};

const styles = StyleSheet.create({
  cancelButton: {
    position: 'absolute',
    right: 21.5,
    top: 16,
  },
});

const getVariantText = (item: CommerceTypes.Product): string =>
  (item.options || [])
    .map((option) => {
      if (option.values && option.values.length > 1) {
        return pluralize(option.name, option.values.length, true);
      }
      return '';
    })
    .join(' ');

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
          maxCount = commerceData.limit * (commerceData.page - 1) + commerceData.products.length;
        }
      }
      if (onLoadComplete) {
        onLoadComplete(
          this.loadMore,
          maxPageLoaded < this.maxPage(commerceData),
          maxCount,
          maxCount
        );
      }
    }

    this.state = {
      sortModalVisible: false,
      filterModalVisible: false,
      isLoading: false,
      isMoreLoading: false,
      hasFetchError: false,
    };
  }

  private readonly maxCount = (commerceData?: CommerceTypes.ProductIndex): number => {
    if (commerceData && commerceData.limit && commerceData.total && commerceData.page) {
      const maxPage = this.maxPage(commerceData);
      if (commerceData.page < maxPage) {
        return commerceData.page * commerceData.limit;
      }
      return commerceData.total;
    }
    return 0;
  };

  private readonly maxPage = (commerceData?: CommerceTypes.ProductIndex) => {
    if (commerceData && commerceData.total && commerceData.limit) {
      return Math.ceil(commerceData.total / commerceData.limit);
    }
    return 1;
  };

  private readonly renderItem = ({
    item,
  }: ListRenderItemInfo<CommerceTypes.Product>): JSX.Element => {
    const { onPress, productItemProps, renderProductItem } = this.props;
    if (renderProductItem) {
      return renderProductItem(item);
    }

    return (
      <ProductItem
        brand={item.brand}
        id={item.id}
        imageStyle={S.productImage}
        images={item.images}
        onPress={onPress(item)}
        originalPrice={item.originalPrice}
        price={item.price}
        promos={item.promotions}
        reviewCount={get(item, 'review.summary.reviewCount')}
        reviewValue={get(item, 'review.summary.averageRating')}
        style={S.productItem}
        title={item.title}
        variantText={getVariantText(item)}
        {...productItemProps}
      />
    );
  };

  private readonly renderActionBar = () => {
    const {
      commerceData,
      hideActionBar,
      mergeSortToFilter,
      refineActionBarProps,
      renderRefineActionBar,
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
        onFilterPress={this.showFilterModal}
        onSortPress={this.showSortModal}
        sortButtonStyle={mergeSortToFilter ? { display: 'none' } : null}
        style={S.actionBar}
        {...refineActionBarProps}
      />
    );
  };

  private readonly renderHeader = () => {
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
          <Loading style={[S.loading, S.loadingLoadMore, this.props.loadMoreLoadingStyle]} />
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
  };

  private readonly showFilterModal = () => {
    this.setState({ filterModalVisible: true });
  };

  private readonly closeFilterModal = () => {
    this.setState({ filterModalVisible: false });
  };

  private readonly showSortModal = () => {
    this.setState({ sortModalVisible: true });
  };

  private readonly closeSortModal = () => {
    this.setState({ sortModalVisible: false });
  };

  private readonly handleFilterApply = (selectedItems: any, info?: { isButtonPress: boolean }) => {
    if (!this.props.filterInBackground) {
      this.closeFilterModal();
    } else if (info && info.isButtonPress) {
      this.closeFilterModal();
      return;
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
        ...sortQuery,
      });
    }
  };

  private readonly handleFilterReset = () => {
    if (!this.props.filterInBackground) {
      this.closeFilterModal();
    }
    if (this.props.handleFilterReset) {
      this.props.handleFilterReset();
    } else {
      this.reloadWithReset();
    }
  };

  private readonly handleSortChange =
    (selectedItems?: Record<string, string[]>) => (sortItem: CommerceTypes.SortingOption) => {
      let refinementsQuery: CommerceTypes.ProductQuery = {};

      if (selectedItems && Object.keys(selectedItems).length > 0) {
        refinementsQuery = { refinements: selectedItems };
      }

      this.closeSortModal();
      if (this.props.handleSortChange) {
        this.props.handleSortChange(sortItem.id);
      } else if (sortItem.id === 'default') {
        this.reloadByQuery({
          sortBy: undefined,
          ...refinementsQuery,
        });
      } else {
        this.reloadByQuery({
          sortBy: sortItem.id,
          ...refinementsQuery,
        });
      }
    };

  private readonly reloadByQuery = (query: CommerceTypes.ProductQuery) => {
    this.setState({ isLoading: true, hasFetchError: false });
    this.fetchByExtraQuery(query)
      .then((data: CommerceTypes.ProductIndex) => {
        this.handleNewData(data);
        this.setState({
          isLoading: false,
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          hasFetchError: true,
        });
      });
  };

  private readonly reloadWithReset = () => {
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
      throw new Error(
        'FSProductIndex: [props.fetchProducts] ' +
          'or [props.commerceDataSource.fetchProductIndex] is required'
      );
    }

    fetchProducts
      .then((data) => {
        if (this.props.filterInBackground) {
          this.closeFilterModal();
        }
        this.handleNewData(data);
        this.setState({
          isLoading: false,
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          hasFetchError: true,
        });
      });
  };

  private readonly handleNewData = (data: CommerceTypes.ProductIndex) => {
    const newState = {} as StateType;
    const maxPageLoaded = data.page || 1;
    const maxCount = this.maxCount(data);

    if (this.props.onLoadComplete) {
      this.props.onLoadComplete(
        this.loadMore,
        maxPageLoaded < this.maxPage(data),
        maxCount,
        maxCount
      );
    }
    this.setState(newState);

    if (this.props.commerceLoadData) {
      this.props.commerceLoadData(data);
    }
  };

  /**
   * refetch commerce data and preserve existing sort/filter
   *
   * @param query
   */
  private readonly fetchByExtraQuery = async (
    query: CommerceTypes.ProductQuery
  ): Promise<CommerceTypes.ProductIndex> => {
    const { commerceDataSource } = this.props;

    const newQuery = this.newProductQuery(query);

    if (this.props.fetchProducts) {
      return this.props.fetchProducts(newQuery);
    } else if (commerceDataSource) {
      return commerceDataSource.fetchProductIndex(newQuery);
    }
    throw new Error(
      'FSProductIndex: [props.fetchProducts] ' +
        'or [props.commerceDataSource.fetchProductIndex] is required'
    );
  };

  private readonly newProductQuery = (query: CommerceTypes.ProductQuery) => {
    const { commerceData, commerceDataSource, productQuery } = this.props;

    const newQuery: CommerceTypes.ProductQuery = {
      ...productQuery,
    };

    if (commerceData) {
      if (commerceData.selectedSortingOption) {
        newQuery.sortBy = commerceData.selectedSortingOption;
      }

      if (
        commerceData.selectedRefinements &&
        Object.keys(commerceData.selectedRefinements).length >
          ((commerceDataSource && commerceDataSource.minRefinements) || 0)
      ) {
        newQuery.refinements = commerceData.selectedRefinements;
      }

      Object.assign(newQuery, query);
    }

    return newQuery;
  };

  private readonly renderCancelButton = (onPress: () => void) => (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.cancelButton}>
      <Image source={images.close} />
    </TouchableOpacity>
  );

  private readonly renderCancelText = (onPress: () => void) => (
    <TouchableOpacity onPress={onPress} style={[S.modalHeaderClose, this.props.modalCancelStyle]}>
      <Text style={S.modalHeaderCloseText}>{FSI18n.string(componentTranslationKeys.cancel)}</Text>
    </TouchableOpacity>
  );

  private readonly renderModalHeader = ({ onPress, title }: any) => {
    const drilldownStyle =
      this.props.filterType === 'drilldown' ? { height: 50, paddingTop: 0 } : null;

    return (
      <View style={[S.modalHeader, drilldownStyle, this.props.modalHeaderStyle]}>
        {this.props.headerWithCancelButton
          ? this.renderCancelButton(onPress)
          : this.renderCancelText(onPress)}
        <Text style={[S.modalHeaderText, this.props.modalHeaderTextStyle]}>{title}</Text>
      </View>
    );
  };

  private readonly renderSortModal = () => {
    if (this.props.hideActionBar) {
      return null;
    }

    const { commerceData, defaultSortOption } = this.props;
    let content = null;

    const sortOptions = commerceData?.sortingOptions ? [...commerceData.sortingOptions] : [];

    if (defaultSortOption) {
      sortOptions.unshift({
        id: 'default',
        title: defaultSortOption,
      });
    }

    const selectedOption = commerceData?.selectedSortingOption
      ? commerceData.selectedSortingOption
      : 'default';

    const selectedItems: Record<string, string[]> | undefined =
      this.props.mergeSortToFilter && commerceData?.selectedSortingOption
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
              onPress: this.closeSortModal,
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
      closeModal: this.closeSortModal,
    });
  };

  private readonly renderModal = ({ closeModal, content, visible }: any) => {
    const SelectedModal = this.props.modalType === 'half-screen' ? ModalHalfScreen : Modal;
    return (
      <SelectedModal
        animationType={this.props.modalAnimationType || 'slide'}
        onRequestClose={closeModal}
        visible={visible}
      >
        {content}
        {this.state.isLoading && this.props.filterInBackground ? (
          this.props.renderModalLoading ? (
            this.props.renderModalLoading()
          ) : (
            <View style={S.modelLoadingContainer}>
              <Loading />
            </View>
          )
        ) : null}
      </SelectedModal>
    );
  };

  private readonly mergeRefinementsAndSort = (
    refinementsData?: CommerceTypes.Refinement[],
    sortingData?: CommerceTypes.SortingOption[]
  ) => {
    const refinements = refinementsData ? [...refinementsData] : [];
    refinements.unshift({
      id: SORT_ITEM_KEY,
      title: 'Sort By',
      values: sortingData
        ? sortingData.map((item: CommerceTypes.SortingOption) => ({
            id: item.id,
            value: item.id,
            title: item.title,
          }))
        : [],
    });

    return refinements;
  };

  private readonly mergeSelectedRefinementsAndSort = (
    selectedRefinements: Record<string, string[]> | undefined,
    selectedSortId: string
  ): Record<string, string[]> => ({
    ...selectedRefinements,
    [SORT_ITEM_KEY]: [selectedSortId],
  });

  private readonly renderFilterModal = () => {
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
      const items = (
        this.props.mergeSortToFilter
          ? this.mergeRefinementsAndSort(commerceData.refinements, commerceData.sortingOptions)
          : commerceData.refinements
      ) as FilterItem[];

      const selectedItems =
        this.props.mergeSortToFilter && commerceData.selectedSortingOption
          ? this.mergeSelectedRefinementsAndSort(
              commerceData.selectedRefinements,
              commerceData.selectedSortingOption
            )
          : commerceData.selectedRefinements;

      content = (
        <SafeAreaView style={S.modalContainer}>
          <FilterListDrilldown
            applyOnSelect={this.props.filterInBackground}
            items={items}
            onApply={this.handleFilterApply}
            onClose={this.props.showDrilldownClose ? this.closeFilterModal : undefined}
            onReset={this.handleFilterReset}
            renderFilterItem={this.renderItemForCombinedFilterAndSort}
            renderFilterItemValue={this.renderItemValueForCombinedFilterAndSort}
            selectedItems={selectedItems}
            singleFilterIds={this.props.mergeSortToFilter ? [SORT_ITEM_KEY] : undefined}
            {...this.props.FilterListDrilldownProps}
          />
        </SafeAreaView>
      );
    } else {
      content = (
        <View style={S.modalContainer}>
          {this.renderModalHeader({
            title: this.props.filterHeaderTitle || 'Filter By',
            onPress: this.closeFilterModal,
          })}

          <FilterList
            items={(commerceData.refinements as FilterItem[]) || []}
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
      closeModal: this.closeFilterModal,
    });
  };

  private readonly renderItemForCombinedFilterAndSort = (
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
          {renderFilterItem({ item, index }, true)}
          <View style={{ padding: 15, backgroundColor: '#eee' }}>
            <Text>{FSI18n.string(componentTranslationKeys.filterBy)}</Text>
          </View>
        </View>
      );
    }
    return renderFilterItem({ item, index }, true);
  };

  private readonly renderItemValueForCombinedFilterAndSort = (
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
          onPress={this.handleSortSelectedInRefine(value, selected)}
          selected={selected}
          title={value.title}
          {...selectableRowProps}
        />
      );
    }
    return renderFilterItemValue(item, true)({ item: value, index });
  };

  private readonly handleSortSelectedInRefine = (value: any, selected: any) => () => {
    this.closeFilterModal();
    // TODO: Test is needed.
    this.handleSortChange(selected)(value);
  };

  private readonly renderNoResult = () => {
    const { commerceData, commerceDataSource } = this.props;

    if (!commerceData) {
      return null;
    }

    if (this.props.renderNoResult) {
      return this.props.renderNoResult(commerceData, this.handleFilterReset);
    }

    const shouldShowReset =
      commerceData.selectedRefinements &&
      Object.keys(commerceData.selectedRefinements).length >
        ((commerceDataSource && commerceDataSource.minRefinements) || 0);

    return (
      <View style={S.noResultContainer}>
        <Text style={S.noResultText}>{FSI18n.string(componentTranslationKeys.noResults)}</Text>
        {shouldShowReset ? (
          <TouchableOpacity onPress={this.handleFilterReset} style={S.resetButton}>
            <Text>{FSI18n.string(componentTranslationKeys.resetFilters)}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  private readonly loadPage = (page: number) => {
    const { commerceData, commerceProviderLoadMore } = this.props;

    if (!commerceData) {
      // Cannot load more
      return;
    }

    this.setState({
      isMoreLoading: true,
    });

    const currentPage = commerceData.page || -1;
    const newQuery = this.newProductQuery({
      page,
      prevCursor: page < currentPage ? commerceData.prevCursor : undefined,
      nextCursor: page > currentPage ? commerceData.nextCursor : undefined,
    });
    if (commerceProviderLoadMore) {
      commerceProviderLoadMore(newQuery)
        .then((data: CommerceTypes.ProductIndex) => {
          this.handleNewData(data);
          this.setState({
            isMoreLoading: false,
          });
        })
        .catch(() => {
          this.setState({
            isMoreLoading: false,
          });
        });
    }
  };

  private readonly loadPrev = () => {
    const { commerceData } = this.props;
    if (commerceData) {
      this.loadPage((commerceData.minPage || commerceData.page || 1) - 1);
    }
  };

  private readonly loadMore = () => {
    const { commerceData } = this.props;
    if (commerceData) {
      this.loadPage((commerceData.page || 1) + 1);
    }
  };

  private readonly renderFooter = () => {
    const { commerceData } = this.props;

    // TODO: Completely move this logic into the normalizers to populate the "hasNextPage"
    let hasAnotherPage = false;
    hasAnotherPage =
      commerceData?.hasNextPage !== undefined
        ? commerceData.hasNextPage
        : commerceData?.page !== undefined && commerceData.page < this.maxPage(commerceData);

    if (this.state.isMoreLoading) {
      return this.props.renderLoading ? (
        this.props.renderLoading()
      ) : (
        <Loading style={[S.loading, S.loadingLoadMore, this.props.loadMoreLoadingStyle]} />
      );
    }

    if (this.props.renderLoadMore) {
      return this.props.renderLoadMore(this.loadMore, hasAnotherPage);
    }

    if (!hasAnotherPage) {
      return null;
    }

    return (
      <View style={S.footer}>
        <TouchableOpacity
          onPress={this.loadMore}
          style={[S.loadMoreButton, this.props.loadMoreButtonStyle]}
        >
          <Text style={this.props.loadMoreButtonTextStyle}>
            {FSI18n.string(componentTranslationKeys.loadMore)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  public render(): React.ReactNode {
    const {
      columns,
      commerceData,
      containerStyle,
      errorText,
      errorTextStyle,
      gridProps,
      listStyle,
      loadingStyle,
    } = this.props;

    if (this.state.isLoading && !this.props.filterInBackground) {
      if (this.props.renderGhost) {
        return this.props.renderGhost();
      }
      return <Loading style={[S.loading, loadingStyle]} />;
    }

    if (this.state.hasFetchError) {
      return <Text style={[S.error, errorTextStyle]}>{errorText || defaultErrorMessage}</Text>;
    }

    if (!commerceData || !commerceData.products || commerceData.products.length === 0) {
      return this.renderNoResult();
    }

    return (
      <View style={[S.container, containerStyle]}>
        <ProductList
          columns={columns}
          gridProps={gridProps}
          items={commerceData.products}
          renderFooter={this.renderFooter}
          renderHeader={this.renderHeader}
          renderItem={this.renderItem}
          style={[S.list, listStyle]}
        />
        {this.state.sortModalVisible ? this.renderSortModal() : null}
        {this.state.filterModalVisible ? this.renderFilterModal() : null}
      </View>
    );
  }
}
