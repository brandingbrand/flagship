import React, { Component } from 'react';
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
import { Modal } from './Modal';
import { style as S } from '../styles/SearchScreen';
import { SearchBar, SearchBarProps } from './SearchBar';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const searchIcon = require('../../assets/images/search.png');

const SEARCH_MODAL_HISTORY_KEY = 'SEARCH_MODAL_HISTORY_KEY';
const MAX_HISTORY_ITEM_NUM = 5;

export interface SearchModalResult {
  title: string;
  query: string;
  [key: string]: any;
}

export interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onResultPress?: (result: SearchModalResult) => void;
  onInputChange?: (value: string) => void;
  onInputSubmit?: (value: string) => void;
  renderResultItem?: (
    result: SearchModalResult,
    index: number,
    inputValue: string
  ) => React.ReactNode;
  searchBarProps?: SearchBarProps;
  results?: SearchModalResult[];
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
}

export interface SearchModalState {
  history: SearchModalResult[];
  inputValue: string;
}

export class SearchModal extends Component<SearchModalProps, SearchModalState> {
  searchBar: any;

  constructor(props: SearchModalProps) {
    super(props);

    this.state = {
      history: [],
      inputValue: ''
    };
  }

  componentDidMount(): void {
    this.loadHistoryToState();
  }

  componentDidUpdate(prevProps: SearchModalProps): void {
    if (!prevProps.visible && this.props.visible) {
      setTimeout(() => {
        this.searchBar.focusInput();
      }, 100);

      this.loadHistoryToState();
    }
  }

  loadHistoryToState = () => {
    this.getHistory()
      .then(history => {
        this.setState({ history, inputValue: '' });
      })
      .catch(e => console.warn(e));
  }

  getSearchBarRef = (ref: any) => {
    this.searchBar = ref;
  }

  getHistory = async (): Promise<SearchModalResult[]> => {
    const historyData = await AsyncStorage.getItem(SEARCH_MODAL_HISTORY_KEY) || '[]';
    try {
      const history = JSON.parse(historyData);
      return history.slice(0, MAX_HISTORY_ITEM_NUM);
    } catch (e) {
      await AsyncStorage.setItem(SEARCH_MODAL_HISTORY_KEY, '[]');
      return [];
    }
  }

  addToHistory = async (item: SearchModalResult) => {
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

  handleResultPress = (result: SearchModalResult) => () => {
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
        style={S.resultsContainer}
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
        style={S.resultsContainer}
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
      >
        {this.props.results.map(this.renderItem)}
      </ScrollView>
    );
  }

  renderItem = (item: SearchModalResult, i: number) => {
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
    return (
      <View style={S.searchBarContainer}>
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

  render(): JSX.Element {
    return (
      <Modal
        visible={this.props.visible}
        animationType='fade'
        onRequestClose={this.props.onClose}
      >
        <View style={S.modalContainer}>
          {this.renderSearchBar()}
          {this.renderResult()}
        </View>
      </Modal>
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
