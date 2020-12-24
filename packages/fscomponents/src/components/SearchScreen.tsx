import React, { PureComponent } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { style as S } from '../styles/SearchScreen';
import { SearchBar, SearchBarProps } from './SearchBar';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const searchIcon = require('../../assets/images/search.png');

const SEARCH_MODAL_HISTORY_KEY = 'SEARCH_MODAL_HISTORY_KEY';
const MAX_HISTORY_ITEM_NUM = 5;

export interface HighlightResult {
  str: string;
  isHighlight: boolean;
}

export interface HighlightResultAccumulator {
  result: HighlightResult[];
}

export interface SearchScreenResult {
  title: string;
  [key: string]: any;
}

export interface SerializableSearchScreenProps {
  style?: ViewStyle;
  itemStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
  searchResultsScrollViewStyle?: ViewStyle;
  searchBarContainerStyle?: ViewStyle;
  /**
   * Whether or not the search bar should automatically focus when the component mounts.
   * Defaults to true.
   */
  searchBarShouldFocus?: boolean;
  clearButtonText?: string;
  clearButtonStyle?: TextStyle;
  clearButtonWrap?: ViewStyle;
  recentTitle?: string;
  recentTitleStyle?: TextStyle;
  recentTitleWrap?: ViewStyle;
}

export interface SearchScreenProps extends Omit<
  SerializableSearchScreenProps,
  'style' |
  'itemStyle' |
  'itemTextStyle' |
  'searchResultsScrollViewStyle' |
  'searchBarContainerStyle' |
  'clearButtonStyle' |
  'clearButtonWrap' |
  'recentTitleStyle' |
  'recentTitleWrap'
  > {
  onClose: () => void;
  onResultPress?: (result: SearchScreenResult) => void;
  onInputChange?: (value: string) => void;
  onInputSubmit?: (value: string) => void;
  renderResultItem?: (
    result: SearchScreenResult,
    index: number,
    inputValue: string
  ) => React.ReactNode;
  renderResultsHeader?: () => React.ReactNode;
  renderNoResults?: () => React.ReactNode;
  searchBarProps?: SearchBarProps;
  results?: SearchScreenResult[];
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  renderContentUnderSearchBar?: () => React.ReactNode;
  searchResultsScrollViewStyle?: StyleProp<ViewStyle>;
  searchBarContainerStyle?: StyleProp<ViewStyle>;
  clearButtonStyle?: StyleProp<TextStyle>;
  clearButtonWrap?: StyleProp<ViewStyle>;
  recentTitleStyle?: StyleProp<TextStyle>;
  recentTitleWrap?: StyleProp<ViewStyle>;
}

export interface SearchScreenState {
  history: SearchScreenResult[];
  inputValue: string;
}

export class SearchScreen extends PureComponent<SearchScreenProps, SearchScreenState> {
  searchBar: SearchBar | null = null;

  constructor(props: SearchScreenProps) {
    super(props);

    this.searchBar = null;
    this.state = {
      history: [],
      inputValue: ''
    };
  }

  loadHistoryToState = () => {
    this.getHistory()
      .then(history => {
        this.setState({ history });
      })
      .catch(e => console.warn(e));
  }

  componentDidMount(): void {
    const { searchBarShouldFocus } = this.props;

    // Focus on the search bar by default
    if (searchBarShouldFocus !== false && this.searchBar) {
      this.searchBar.focusInput();
    }

    this.loadHistoryToState();
  }

  getSearchBarRef = (ref: SearchBar | null) => {
    this.searchBar = ref;
  }

  getHistory = async (): Promise<SearchScreenResult[]> => {
    const historyData = await AsyncStorage.getItem(SEARCH_MODAL_HISTORY_KEY) || '[]';
    try {
      const history = JSON.parse(historyData);
      return history.slice(0, MAX_HISTORY_ITEM_NUM);
    } catch (e) {
      await AsyncStorage.setItem(SEARCH_MODAL_HISTORY_KEY, '[]');
      return [];
    }
  }

  addToHistory = async (item: SearchScreenResult) => {
    let history = await this.getHistory();
    const existIndex = history.findIndex(result => result.title === item.title);

    if (existIndex > -1) {
      history = history
        .slice(0, existIndex)
        .concat(history.slice(existIndex + 1));
      history.unshift(item);
    } else {
      history.unshift(item);
      history = history.slice(0, MAX_HISTORY_ITEM_NUM);
    }

    await AsyncStorage.setItem(
      SEARCH_MODAL_HISTORY_KEY,
      JSON.stringify(history)
    );
    this.setState({ history });
    return history;
  }

  handleResultPress = (result: SearchScreenResult) => () => {
    this.addToHistory(result).catch(e => console.warn(e));
    if (this.props.onResultPress) {
      return this.props.onResultPress(result);
    }
  }

  handleSubmit = (value: string) => {
    this.addToHistory({
      title: value,
      query: value
    }).catch(e => console.warn(e));

    if (this.props.onInputSubmit) {
      return this.props.onInputSubmit(value);
    }
  }

  clearHistory = async () => {
    await AsyncStorage.setItem(SEARCH_MODAL_HISTORY_KEY, '[]');
    this.setState({ history: [] });
  }

  renderHistory = () => {
    return (
      <ScrollView
        style={[S.resultsContainer, this.props.searchResultsScrollViewStyle]}
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
      >
        {(this.state.history && this.state.history.length) ? (
          <>
            <View style={[S.recentSearchContainer, this.props.recentTitleWrap]}>
              <Text style={[S.recentSearch, this.props.recentTitleStyle]}>
                {this.props.recentTitle ||
                  (FSI18n.string(translationKeys.flagship.search.recentSearches) + ':')}
              </Text>

              <TouchableOpacity
                onPress={this.clearHistory}
                accessibilityLabel={
                  FSI18n.string(translationKeys.flagship.search.actions.clear.accessibility)
                }
                style={this.props.clearButtonWrap}
              >
                <Text style={[S.recentSearchClearText, this.props.clearButtonStyle]}>
                  {this.props.clearButtonText ||
                    FSI18n.string(translationKeys.flagship.search.actions.clear.actionBtn)}
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.history.map(this.renderItem)}
          </>
        ) : null}
        {this.props.renderNoResults && this.props.renderNoResults()}
      </ScrollView>
    );
  }

  renderResult = () => {
    if (!this.props.results) {
      return this.renderHistory();
    } else if (!this.props.results.length) {
      return null;
    }

    return (
      <ScrollView
        style={[S.resultsContainer, this.props.searchResultsScrollViewStyle]}
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
      >
        {this.props.renderResultsHeader
          ? this.props.renderResultsHeader()
          : null
        }
        {this.props.results.map(this.renderItem)}
      </ScrollView>
    );
  }

  renderItem = (item: SearchScreenResult, i: number) => {
    if (this.props.renderResultItem) {
      return this.props.renderResultItem(item, i, this.state.inputValue);
    }

    return (
      <TouchableHighlight
        key={i}
        underlayColor='#f8f8f8'
        style={[S.resultItem, this.props.itemStyle]}
        onPress={this.handleResultPress(item)}
        accessibilityLabel={`Search ${item.title}`}
      >
        {this.renderTextWithHighLights(item.title, this.state.inputValue)}
      </TouchableHighlight>
    );
  }

  renderTextWithHighLights = (name: string = '', query: string) => {
    const strArr = highlightStr(name, query);

    return (
      <Text style={[S.suggestionTitle, this.props.itemTextStyle]}>
        {strArr.map((str: HighlightResult, i: number) => {
          return (
            <Text key={i} style={str.isHighlight && S.suggestionHighlight}>
              {str.str}
            </Text>
          );
        })}
      </Text>
    );
  }

  handleChange = (value: string) => {
    this.setState({ inputValue: value });
    if (this.props.onInputChange) {
      return this.props.onInputChange(value);
    }
  }

  renderSearchBar = () => {
    const { searchBarContainerStyle } = this.props;
    return (
      <View style={[S.searchBarContainer, searchBarContainerStyle]}>
        <SearchBar
          ref={this.getSearchBarRef}
          onCancel={this.props.onClose}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          showSearchIcon={true}
          searchIcon={searchIcon}
          cancelButtonAlwaysVisible={true}
          {...this.props.searchBarProps}
        />
      </View>
    );
  }

  renderContentUnderSearchBar = () => {
    if (this.props.renderContentUnderSearchBar) {
      return this.props.renderContentUnderSearchBar();
    } else {
      return null;
    }
  }

  render(): JSX.Element {
    return (
      <SafeAreaView style={[S.modalContainer, this.props.style]}>
        {this.renderSearchBar()}
        {this.renderContentUnderSearchBar()}
        {this.renderResult()}
      </SafeAreaView>
    );
  }
}

function highlightStr(name: string, query: string): HighlightResult[] {
  let queryRegx;

  try {
    queryRegx = new RegExp(query, 'ig');
  } catch (e) {
    return [
      {
        str: name,
        isHighlight: false
      }
    ];
  }

  const matches = name.match(queryRegx);
  if (!matches || !query) {
    return [
      {
        str: name,
        isHighlight: false
      }
    ];
  }

  const textSplits = name.split(queryRegx).reduce(
    (acc: HighlightResultAccumulator, item, index) => {
      if (item) {
        acc.result.push({
          str: item,
          isHighlight: false
        });
      }

      if (matches[index]) {
        acc.result.push({
          str: matches[index],
          isHighlight: true
        });
      }

      return acc;
    },
    { result: [] }
  );

  return textSplits.result;
}
