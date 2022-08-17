import React, { PureComponent } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import AsyncStorage from '@react-native-async-storage/async-storage';

import searchIcon from '../../assets/images/search.png';
import { style as S } from '../styles/SearchScreen';

import type { SearchBarProps } from './SearchBar';
import { SearchBar } from './SearchBar';

const SEARCH_MODAL_HISTORY_KEY = 'SEARCH_MODAL_HISTORY_KEY';
const MAX_HISTORY_ITEM_NUM = 5;

const highlightStr = (name: string, query: string): HighlightResult[] => {
  let queryRegx;

  try {
    queryRegx = new RegExp(query, 'ig');
  } catch {
    return [
      {
        str: name,
        isHighlight: false,
      },
    ];
  }

  const matches = name.match(queryRegx);
  if (!matches || !query) {
    return [
      {
        str: name,
        isHighlight: false,
      },
    ];
  }

  const textSplits = name.split(queryRegx).reduce(
    (acc: HighlightResultAccumulator, item, index) => {
      if (item) {
        acc.result.push({
          str: item,
          isHighlight: false,
        });
      }

      const match = matches[index];
      if (match) {
        acc.result.push({
          str: match,
          isHighlight: true,
        });
      }

      return acc;
    },
    { result: [] }
  );

  return textSplits.result;
};

export interface HighlightResult {
  str: string;
  isHighlight: boolean;
}

export interface HighlightResultAccumulator {
  result: HighlightResult[];
}

export interface SearchScreenResult {
  title: string;
  [key: string]: unknown;
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

export interface SearchScreenProps
  extends Omit<
    SerializableSearchScreenProps,
    | 'clearButtonStyle'
    | 'clearButtonWrap'
    | 'itemStyle'
    | 'itemTextStyle'
    | 'recentTitleStyle'
    | 'recentTitleWrap'
    | 'searchBarContainerStyle'
    | 'searchResultsScrollViewStyle'
    | 'style'
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
  constructor(props: SearchScreenProps) {
    super(props);

    this.searchBar = null;
    this.state = {
      history: [],
      inputValue: '',
    };
  }

  private searchBar: SearchBar | null = null;

  private readonly loadHistoryToState = () => {
    this.getHistory()
      .then((history) => {
        this.setState({ history });
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  private readonly getSearchBarRef = (ref: SearchBar | null) => {
    this.searchBar = ref;
  };

  private readonly getHistory = async (): Promise<SearchScreenResult[]> => {
    const historyData = (await AsyncStorage.getItem(SEARCH_MODAL_HISTORY_KEY)) || '[]';
    try {
      const history = JSON.parse(historyData);
      return history.slice(0, MAX_HISTORY_ITEM_NUM);
    } catch {
      await AsyncStorage.setItem(SEARCH_MODAL_HISTORY_KEY, '[]');
      return [];
    }
  };

  private readonly addToHistory = async (item: SearchScreenResult) => {
    let history = await this.getHistory();
    const existIndex = history.findIndex((result) => result.title === item.title);

    if (existIndex > -1) {
      history = history.slice(0, existIndex).concat(history.slice(existIndex + 1));
      history.unshift(item);
    } else {
      history.unshift(item);
      history = history.slice(0, MAX_HISTORY_ITEM_NUM);
    }

    await AsyncStorage.setItem(SEARCH_MODAL_HISTORY_KEY, JSON.stringify(history));
    this.setState({ history });
    return history;
  };

  private readonly handleResultPress = (result: SearchScreenResult) => () => {
    this.addToHistory(result).catch((error) => {
      console.warn(error);
    });
    if (this.props.onResultPress) {
      this.props.onResultPress(result);
    }
  };

  private readonly handleSubmit = (value: string) => {
    this.addToHistory({
      title: value,
      query: value,
    }).catch((error) => {
      console.warn(error);
    });

    if (this.props.onInputSubmit) {
      this.props.onInputSubmit(value);
    }
  };

  private readonly clearHistory = async () => {
    await AsyncStorage.setItem(SEARCH_MODAL_HISTORY_KEY, '[]');
    this.setState({ history: [] });
  };

  private readonly renderHistory = () => (
    <ScrollView
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="always"
      style={[S.resultsContainer, this.props.searchResultsScrollViewStyle]}
    >
      {this.state.history && this.state.history.length > 0 ? (
        <React.Fragment>
          <View style={[S.recentSearchContainer, this.props.recentTitleWrap]}>
            <Text style={[S.recentSearch, this.props.recentTitleStyle]}>
              {this.props.recentTitle ||
                `${FSI18n.string(translationKeys.flagship.search.recentSearches)}:`}
            </Text>

            <TouchableOpacity
              accessibilityLabel={FSI18n.string(
                translationKeys.flagship.search.actions.clear.accessibility
              )}
              onPress={this.clearHistory}
              style={this.props.clearButtonWrap}
            >
              <Text style={[S.recentSearchClearText, this.props.clearButtonStyle]}>
                {this.props.clearButtonText ||
                  FSI18n.string(translationKeys.flagship.search.actions.clear.actionBtn)}
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.history.map(this.renderItem)}
        </React.Fragment>
      ) : null}
      {this.props.renderNoResults ? this.props.renderNoResults() : null}
    </ScrollView>
  );

  private readonly renderResult = () => {
    if (!this.props.results) {
      return this.renderHistory();
    } else if (this.props.results.length === 0) {
      return null;
    }

    return (
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        style={[S.resultsContainer, this.props.searchResultsScrollViewStyle]}
      >
        {this.props.renderResultsHeader ? this.props.renderResultsHeader() : null}
        {this.props.results.map(this.renderItem)}
      </ScrollView>
    );
  };

  private readonly renderItem = (item: SearchScreenResult, i: number) => {
    if (this.props.renderResultItem) {
      return this.props.renderResultItem(item, i, this.state.inputValue);
    }

    return (
      <TouchableHighlight
        accessibilityLabel={`Search ${item.title}`}
        key={i}
        onPress={this.handleResultPress(item)}
        style={[S.resultItem, this.props.itemStyle]}
        underlayColor="#f8f8f8"
      >
        {this.renderTextWithHighLights(item.title, this.state.inputValue)}
      </TouchableHighlight>
    );
  };

  private readonly renderTextWithHighLights = (name = '', query: string) => {
    const strArr = highlightStr(name, query);

    return (
      <Text style={[S.suggestionTitle, this.props.itemTextStyle]}>
        {strArr.map((str: HighlightResult, i: number) => (
          <Text key={i} style={str.isHighlight ? S.suggestionHighlight : null}>
            {str.str}
          </Text>
        ))}
      </Text>
    );
  };

  private readonly handleChange = (value: string) => {
    this.setState({ inputValue: value });
    if (this.props.onInputChange) {
      this.props.onInputChange(value);
    }
  };

  private readonly renderSearchBar = () => {
    const { searchBarContainerStyle } = this.props;
    return (
      <View style={[S.searchBarContainer, searchBarContainerStyle]}>
        <SearchBar
          cancelButtonAlwaysVisible
          onCancel={this.props.onClose}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          ref={this.getSearchBarRef}
          searchIcon={searchIcon}
          showSearchIcon
          {...this.props.searchBarProps}
        />
      </View>
    );
  };

  private readonly renderContentUnderSearchBar = () => {
    if (this.props.renderContentUnderSearchBar) {
      return this.props.renderContentUnderSearchBar();
    }
    return null;
  };

  public componentDidMount(): void {
    const { searchBarShouldFocus } = this.props;

    // Focus on the search bar by default
    if (searchBarShouldFocus !== false && this.searchBar) {
      this.searchBar.focusInput();
    }

    this.loadHistoryToState();
  }

  public render(): JSX.Element {
    return (
      <SafeAreaView style={[S.modalContainer, this.props.style]}>
        {this.renderSearchBar()}
        {this.renderContentUnderSearchBar()}
        {this.renderResult()}
      </SafeAreaView>
    );
  }
}
