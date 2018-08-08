import React, { Component } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  SearchScreen as SearchSuggestionScreen
} from '@brandingbrand/fscomponents';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import PSButton from '../components/PSButton';
import PSProductCarousel from '../components/PSProductCarousel';
import { debounce, flatten, get } from 'lodash-es';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { dataSource } from '../lib/datasource';
import { handleDeeplink } from '../lib/deeplinkHandler';

import PSScreenWrapper from '../components/PSScreenWrapper';
import PSProductIndex from '../components/PSProductIndex';

import { border, fontSize, palette } from '../styles/variables';
import GlobalStyle from '../styles/Global';
import { navBarHide } from '../styles/Navigation';
import translate, { translationKeys } from '../lib/translations';

const searchIcon = require('../../assets/images/search.png');

const NoSearchResultsStyle = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 20,
    flex: 1
  },
  modalWrap: {
    flex: 1,
    backgroundColor: palette.background
  },
  header: {
    fontWeight: 'bold',
    fontSize: 17
  },
  listItem: {
    paddingTop: 10
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 25,
    paddingBottom: 25,
    borderBottomWidth: border.width,
    borderBottomColor: border.color
  },
  contactUsButton: {
    borderWidth: border.width,
    borderColor: border.color,
    borderRadius: border.radius,
    backgroundColor: palette.background,
    width: '48%',
    height: 40
  },
  contactUsText: {
    fontWeight: 'bold',
    color: palette.onBackground
  },
  shopButton: {
    backgroundColor: palette.primary,
    borderRadius: 3,
    width: '48%',
    height: 40
  },
  shopText: {
    color: palette.onPrimary,
    fontWeight: 'bold'
  },
  carouselView: {
    marginBottom: 10
  },
  carousel: {
    flex: 1
  },
  sectionTitle: {
    marginBottom: 15,
    fontSize: fontSize.large,
    fontWeight: 'bold'
  }
});

export interface SearchState {
  suggestions: any;
  showResult: boolean;
  keyword: string;
}

export interface SearchProps extends ScreenProps {
  query?: { kw: string };
  onCancel?: () => void;
}

class Search extends Component<SearchProps, SearchState> {
  static navigatorStyle: NavigatorStyle = navBarHide;
  state: SearchState = {
    suggestions: null,
    showResult: false,
    keyword: ''
  };

  constructor(props: SearchProps) {
    super(props);

    if (props.query && (props.query.kw)) {
      this.state = {
        suggestions: null,
        showResult: true,
        keyword: props.query.kw
      };
    }
  }

  render(): JSX.Element {
    const { navigator } = this.props;
    const result = this.state.showResult ? [] : this.state.suggestions;

    return (
      <PSScreenWrapper
        scroll={false}
        hideGlobalBanner={true}
        needInSafeArea={true}
        navigator={navigator}
      >
        <SearchSuggestionScreen
          results={result}
          onClose={this.handleCancel}
          onResultPress={this.handleSearchResultPress}
          onInputChange={this.handleInputChange}
          onInputSubmit={this.handleInputSubmit}
          itemTextStyle={GlobalStyle.searchBarSuggestionItemTextStyle}
          renderContentUnderSearchBar={this.renderSearchResult}
          searchBarShouldFocus={true}
          searchBarProps={{
            searchIcon,
            cancelButtonWidth: 65,
            cancelTitleStyle: GlobalStyle.searchBarCancelTitleStyle,
            containerStyle: GlobalStyle.searchBarInner,
            inputTextStyle: GlobalStyle.searchBarInputTextStyle,
            placeholder: 'Search',
            inputProps: {
              value: this.state.keyword === ' ' ? '' : this.state.keyword,
              autoCorrect: false,
              autoCapitalize: 'none',
              clearButtonMode: 'while-editing'
            }
          }}
        />
      </PSScreenWrapper>
    );
  }

  renderSearchResult = () => {
    if (!this.state.showResult) {
      return null;
    }

    return (
      <PSProductIndex
        navigator={this.props.navigator}
        productQuery={this.getQueryFromPropsAndInput()}
        keyword={this.getKeywordFromPropsOrInput()}
        renderNoResult={this.renderNoResult}
      />
    );
  }

  renderNoResult = () => {
    const keyword = this.getKeywordFromPropsOrInput();

    return (
      <ScrollView style={NoSearchResultsStyle.container}>
        <Text style={NoSearchResultsStyle.header}>
          {translate.string(translationKeys.search.noResults.text, { keyword })}
        </Text>
        {translationKeys.search.noResults.suggestions.map(suggestion => (
          <Text style={NoSearchResultsStyle.listItem}>
            &bull; {translate.string(suggestion)}
          </Text>
        ))}
        <View style={NoSearchResultsStyle.buttonContainer}>
          <PSButton
            title={translate.string(translationKeys.search.noResults.actions.contact.actionBtn)}
            onPress={this.contactUs}
            style={NoSearchResultsStyle.contactUsButton}
            titleStyle={NoSearchResultsStyle.contactUsText}
          />
          <PSButton
            title={
              translate.string(translationKeys.search.noResults.actions.shopByCategory.actionBtn)
            }
            onPress={this.shopByCategory}
            style={NoSearchResultsStyle.shopButton}
            titleStyle={NoSearchResultsStyle.shopText}
          />
        </View>
        {this.renderPromoProductCarousel({ section: 0 })}
        {this.renderPromoProductCarousel({ section: 1 })}
      </ScrollView>
    );
  }

  renderPromoProductCarousel = ({ section }: { section: number }) => {
    const productGroup = get(
      this.props,
      'promoProduct.productGroups.' + section
    );
    if (!productGroup) {
      return null;
    }

    return (
      <View style={NoSearchResultsStyle.carouselView}>
        <Text style={NoSearchResultsStyle.sectionTitle}>{productGroup.title}</Text>
        <PSProductCarousel
          style={NoSearchResultsStyle.carousel}
          items={productGroup.products.map((prod: any) => ({
            ...prod,
            image: { uri: prod.image },
            onPress: this.handlePromotedProductPress(prod.href)
          }))}
        />
      </View>
    );
  }

  handlePromotedProductPress = (href: string) => () => {
    handleDeeplink(href, this.props.navigator);
  }

  contactUs = () => {
    handleDeeplink('http://www.example.com', this.props.navigator);
  }

  shopByCategory = () => {
    this.props.navigator.push({
      screen: 'Category',
      title: translate.string(translationKeys.screens.allCategories.title),
      passProps: {
        categoryId: ''
      }
    });
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

  handleCancel = () => {
    if (this.props.onCancel) {
      requestAnimationFrame(this.props.onCancel);
    }
  }

  handleSearchResultPress = (item: any) => {
    Keyboard.dismiss();
    if (item.query) {
      return this.handleInputSubmit(item.query);
    } else {
      return this.props.navigator.push({
        screen: 'ProductIndex',
        title: item.title,
        passProps: {
          categoryId: item.categoryId
        }
      });
    }
  }

  // tslint:disable-next-line
  fetchSuggestions: any = debounce(
    (value: string) => {
      dataSource
        .searchSuggestion(value)
        .then((data: any) => {
          this.setState({
            suggestions: this.getAllSuggestions(data)
          });
        })
        .catch(e => console.warn(e));
    },
    300
  );

  handleInputChange = (value: string) => {
    if (value) {
      this.fetchSuggestions(value);
      this.setState({
        keyword: value,
        showResult: false
      });
    } else {
      this.setState({
        keyword: value,
        suggestions: null,
        // show result if from search by vehicle, otherwise just show search history
        showResult: this.props.query && this.props.query.kw ? true : false
      });
    }
  }

  handleInputSubmit = (keyword: string) => {
    keyword = keyword || this.state.keyword;
    if (!keyword) {
      return;
    }
    this.setState(
      {
        keyword,
        showResult: false
      },
      () => {
        this.setState({
          showResult: true
        });
      }
    );
  }

  getQueryFromPropsAndInput = () => {
    const query = {
      keyword: get(this.props, 'query.kw', '')
    };

    if (this.state.keyword) {
      query.keyword = this.state.keyword;
    }

    return query;
  }

  getKeywordFromPropsOrInput = () => {
    // this.props.query is from search by vehicle on home page
    if (this.props.query && this.props.query.kw) {
      return this.props.query.kw;
    } else {
      return this.state.keyword;
    }
  }

  getAllSuggestions = (data: any) => {
    const groups = [
      { name: 'brandSuggestions', dataKey: 'brands' },
      { name: 'categorySuggestions', dataKey: 'categories' },
      { name: 'brandPartSuggestions', dataKey: 'brandPartTypes' }
    ];

    const suggestions = groups
      .map((key: any) => data[key.name] && data[key.name][key.dataKey])
      .filter(Boolean);

    return flatten(suggestions);
  }
}

export default Search;
