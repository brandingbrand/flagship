import React, { PureComponent } from 'react';
import {
  AsyncStorage,
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { style as S } from '../styles/SearchScreen';
import { SearchBar, SearchBarProps } from './SearchBar';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const searchIcon = require('../../assets/images/search.png');

const SEARCH_MODAL_HISTORY_KEY = 'SEARCH_MODAL_HISTORY_KEY';
const MAX_HISTORY_ITEM_NUM = 5;

export interface SearchScreenResult {
  title: string;
  query: string;
  [key: string]: any;
}

export interface SearchScreenProps {
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
  searchBarProps?: SearchBarProps;
  results?: SearchScreenResult[];
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  renderContentUnderSearchBar?: () => React.ReactNode;
  searchResultsScrollViewStyle?: StyleProp<ViewStyle>;
  searchBarContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Whether or not the search bar should automatically focus when the component mounts.
   * Defaults to true.
   */
  searchBarShouldFocus?: boolean;
}

export interface SearchScreenState {
  history: SearchScreenResult[];
  inputValue: string;
}

export class SearchScreen extends PureComponent<SearchScreenProps, SearchScreenState> {
  searchBar: any;

  constructor(props: SearchScreenProps) {
    super(props);

    this.state = {
      history: [],
      inputValue: ''
    };

    this.loadHistoryToState();
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
    if (searchBarShouldFocus === undefined || searchBarShouldFocus) {
      this.searchBar.focusInput();
    }
  }

  getSearchBarRef = (ref: any) => {
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
    if (!this.state.history || !this.state.history.length) {
      return null;
    }

    return (
      <ScrollView
        style={[S.resultsContainer, this.props.searchResultsScrollViewStyle]}
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
      >
        <View style={S.recentSearchContainer}>
          <Text style={S.recentSearch}>
            {FSI18n.string(translationKeys.flagship.search.recentSearches)}:
          </Text>

          <TouchableOpacity
            onPress={this.clearHistory}
            accessibilityLabel={
              FSI18n.string(translationKeys.flagship.search.actions.clear.accessibility)
            }
          >
            <Text style={S.recentSearchClearText}>
              {FSI18n.string(translationKeys.flagship.search.actions.clear.actionBtn)}
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.history.map(this.renderItem)}
      </ScrollView>
    );
  }

  renderResult = () => {
    if (!this.props.results || !this.props.results.length) {
      if (this.props.results === null) {
        return this.renderHistory();
      } else {
        return null;
      }
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
        {this.renderTextWithHighLighs(item.title, this.state.inputValue)}
      </TouchableHighlight>
    );
  }

  renderTextWithHighLighs = (name: string = '', query: string) => {
    const strArr = highlightStr(name, query);

    return (
      <Text style={[S.suggestionTitle, this.props.itemTextStyle]}>
        {strArr.map((str: any, i: number) => {
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
      <View style={S.modalContainer}>
        {this.renderSearchBar()}
        {this.renderContentUnderSearchBar()}
        {this.renderResult()}
      </View>
    );
  }
}

function highlightStr(name: string, query: string): any {
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

  // TODO: Fix reduce usage here requiring @ts-ignore
  const textSplits = name.split(queryRegx).reduce(
    (acc, item) => {
      if (item) {
        // @ts-ignore
        acc.result.push({
          str: item,
          isHighlight: false
        });
      }

      if (matches[acc.matchIndex]) {
        // @ts-ignore
        acc.result.push({
          str: matches[acc.matchIndex],
          isHighlight: true
        });
      }

      acc.matchIndex += 1;
      return acc;
    },
    { result: [], matchIndex: 0 }
  );

  return textSplits.result;
}
