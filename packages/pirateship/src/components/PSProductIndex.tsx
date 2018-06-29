import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import React, { Component } from 'react';
import { get } from 'lodash-es';
import { Navigator } from 'react-native-navigation';

import { CommerceTypes } from '@brandingbrand/fscommerce';
import {
  ProductIndex as PirateProductIndex,
  ProductIndexSearch as PirateProductIndexSearch
} from '@brandingbrand/fsproductindex';

import { dataSource } from '../lib/datasource';
import { backButton, searchButton } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import { NavButton, NavigatorStyle } from '../lib/commonTypes';

import PSProductItem from '../components/PSProductItem';
import PSFilterActionBar from '../components/PSFilterActionBar';

import { FilterItem } from '@brandingbrand/fscomponents';
import { border, color, fontSize, grays, palette } from '../styles/variables';
import translate, { translationKeys } from '../lib/translations';

const window = Dimensions.get('window');

const PIPStyle = StyleSheet.create({
  flex1: {
    flex: 1
  },
  container: {
    backgroundColor: '#fff',
    paddingRight: 0,
    marginHorizontal: 15
  },
  productItem: {
    paddingTop: 15,
    paddingBottom: Platform.OS === 'android' ? 15 : 0,
    borderBottomColor: border.color,
    borderBottomWidth: 1
  },
  itemTotalText: {
    color: palette.primary
  },
  resetButtonText: {
    color: palette.secondary,
    fontWeight: 'bold'
  },
  applyButtonText: {
    color: palette.secondary,
    fontWeight: 'bold'
  },
  filterBy: {
    padding: 15,
    paddingVertical: 10,
    backgroundColor: grays.two
  },
  filterByText: {
    fontSize: fontSize.small,
    fontWeight: 'bold'
  },
  arrow: {
    width: 14,
    height: 14,
    borderColor: '#555',
    borderBottomWidth: 1,
    borderLeftWidth: 1
  },
  arrowBack: {
    transform: [{ rotate: '45deg' }]
  },
  arrowNext: {
    transform: [{ rotate: '-135deg' }]
  },
  arrowContainer: {
    position: 'absolute',
    left: 15,
    top: 18
  },
  firstLevelItemContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  refineTitle: {
    fontWeight: 'bold',
    fontSize: 15
  },
  refineTitleSelected: {
    fontWeight: '800',
    color: palette.secondary
  },
  selectedValueStyle: {
    color: '#999',
    fontSize: 13,
    marginTop: 3,
    maxWidth: 300
  },
  secondLevelHeader: {
    height: 50,
    paddingHorizontal: 10,
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  secondLevelTitle: {
    fontWeight: 'bold'
  },
  secondLevelRow: {
    height: 50,
    paddingLeft: 10,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  secondLevelText: {
    fontSize: 16
  },
  tabView: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: border.color
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 12
  },
  tabText: {
    fontSize: 13,
    color: color.gray
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: palette.secondary
  },
  selectedTabText: {
    color: palette.secondary,
    fontWeight: '500'
  },
  hidden: {
    position: 'absolute',
    top: window.height,
    bottom: -window.height
  },
  markerIconStyle: {
    borderColor: palette.secondary
  }
});

export interface ProductIndexProps {
  navigator: Navigator;
  categoryId?: string;
  keyword?: string;
  renderNoResult?: any;
  productQuery?: CommerceTypes.ProductQuery;
}

export interface ProductIndexState {
  isLoading: boolean;
}

const renderProductIndex = (indexProps: any) => {
  return <PirateProductIndex {...indexProps} />;
};

const renderSearch = (indexProps: any, keyword: string, renderNoResult: any) => {
  return (
    <PirateProductIndexSearch {...indexProps} keyword={keyword} renderNoResult={renderNoResult} />
  );
};

class PSProductIndex extends Component<ProductIndexProps, ProductIndexState> {
  static navigatorStyle: NavigatorStyle = navBarDefault;
  static leftButtons: NavButton[] = [backButton];
  static rightButtons: NavButton[] = [searchButton];
  selectedRefinements: any = null;
  selectedSortingOption?: string;
  categoryId: string = ''; // used for selecting sub category from refine
  fullCategoryId: string = '';

  constructor(props: ProductIndexProps) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  onDataLoaded = (data: any) => {
    this.selectedRefinements = data.selectedRefinements;
    this.selectedSortingOption = data.selectedSortingOption;
    this.fullCategoryId = data.fullCategoryId;

    if (data.title) {
      this.props.navigator.setTitle({ title: data.title });
    }
  }

  onPress = (item: CommerceTypes.Product) => () => {
    const { navigator } = this.props;
    navigator.push({
      screen: 'ProductDetail',
      passProps: {
        productId: item.id
      }
    });
  }

  onGroupPress = (item: CommerceTypes.Product) => () => {
    const { navigator } = this.props;
    navigator.push({
      screen: 'ProductIndex',
      title: item.title || '',
      passProps: {
        categoryId: item.id
      }
    });
  }

  renderProductItem = () => {
    return (item: CommerceTypes.Product): JSX.Element => {
      const image = (item.images || []).find(img => !!img.uri);

      return (
        <PSProductItem
          navigator={this.props.navigator}
          format={'horizontalList'}
          image={image}
          reviewValue={get(item, 'review.statistics.averageRating')}
          reviewCount={get(item, 'review.statistics.reviewCount')}
          onPress={this.onPress(item)}
          style={PIPStyle.productItem}
          {...item}
        />
      );
    };
  }

  renderRefineActionBar = (showFilterModal: any, showSortModal: any, commerceData: any) => {
    return (
      <PSFilterActionBar
        showFilterModal={showFilterModal}
        showSortModal={showSortModal}
        commerceData={commerceData}
        keyword={this.props.keyword}
      />
    );
  }

  render(): JSX.Element | null {
    if (this.state.isLoading) {
      return null;
    }

    const { keyword, renderNoResult } = this.props;

    const formatProps: any = {
      format: 'list'
    };

    const indexProps: any = {
      ...formatProps,
      listStyle: PIPStyle.container,
      renderRefineActionBar: this.renderRefineActionBar,
      commerceDataSource: dataSource,
      productQuery: this.getProductQuery(),
      renderProductItem: this.renderProductItem(),
      modalType: 'half-screen',
      filterType: 'drilldown',
      mergeSortToFilter: true,
      disableReviews: true,
      handleFilterReset: this.handleFilterReset,
      FilterListDrilldownProps: {
        resetButtonTextStyle: PIPStyle.resetButtonText,
        applyButtonTextStyle: PIPStyle.applyButtonText,
        applyText: 'Apply',
        renderFilterItem: this.renderFilterItemCustom,
        renderSecondLevel: this.renderSecondLevelCustom,
        itemTextSelectedStyle: PIPStyle.refineTitleSelected,
        ignoreActiveStyleIds: ['__pirate_sort'],
        selectableRowProps: {
          markerIconStyle: PIPStyle.markerIconStyle
        }
      },
      onDataLoaded: this.onDataLoaded
    };

    return (
      <View style={PIPStyle.flex1}>
        {keyword
          ? renderSearch(indexProps, keyword, renderNoResult)
          : renderProductIndex(indexProps)}
      </View>
    );
  }

  handleFilterReset = () => {
    this.selectedRefinements = null;

    // reload to trigger fetch
    this.setState({ isLoading: true }, () => {
      this.setState({ isLoading: false });
    });
  }

  renderSecondLevelCustom = (
    item: FilterItem,
    goBack: () => void,
    renderSecondLevel: Function
  ): JSX.Element => {
    if (item.id === 'Category') {
      return (
        <View>
          <TouchableOpacity style={PIPStyle.secondLevelHeader} onPress={goBack}>
            <View style={PIPStyle.arrowContainer}>
              <View style={[PIPStyle.arrow, PIPStyle.arrowBack]} />
            </View>
            <Text style={PIPStyle.secondLevelTitle}>{item.title}</Text>
          </TouchableOpacity>

          <ScrollView>
            {item.values.filter(v => v.categoryId && v.title).map((v, i) => (
              <TouchableOpacity
                key={v.categoryId}
                style={PIPStyle.secondLevelRow}
                onPress={this.handleSubcategoryPress(v)}
              >
                <Text style={PIPStyle.secondLevelText}>{v.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    } else {
      return renderSecondLevel(item, true);
    }
  }

  renderFilterItemCustom = (
    item: any,
    index: number,
    selectedValues: any,
    handlePress: () => void,
    renderFilterItem: Function
  ) => {
    if (item.id === '__pirate_sort') {
      if (item.values && item.values.length) {
        return (
          <View>
            {renderFilterItem({item, index}, true)}
            <View style={PIPStyle.filterBy}>
              <Text style={PIPStyle.filterByText}>
                {translate.string(translationKeys.flagship.productIndex.filterBy)}
              </Text>
            </View>
          </View>
        );
      }
    } else {
      return renderFilterItem({item, index}, true);
    }
  }

  private getProductQuery = () => {
    if (this.props.productQuery) {
      return {
        ...this.props.productQuery
      };
    }

    const { categoryId, keyword } = this.props;

    // don't apply refinement if there is only one, and it's !Base
    const refinements =
      this.selectedRefinements &&
      Object.keys(this.selectedRefinements).length === 1 &&
      this.selectedRefinements['!Base']
        ? {}
        : this.selectedRefinements;

    return {
      Ntt: keyword,
      categoryId: this.categoryId || categoryId,

      limit: 30,
      refinements,
      sortBy: this.selectedSortingOption
    };
  }

  private handleSubcategoryPress = (refineItemValue: any) => () => {
    this.categoryId = refineItemValue.categoryId;

    if (refineItemValue.value) {
      const selectedRefinements = this.selectedRefinements || {};
      this.selectedRefinements = {
        ...selectedRefinements,
        Category: [refineItemValue.value]
      };
    }

    // reload to trigger fetch
    this.setState({ isLoading: true }, () => {
      this.setState({ isLoading: false });
    });
  }
}

export default PSProductIndex;
