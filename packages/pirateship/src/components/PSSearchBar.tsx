import React, { Component } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SearchBar } from '@brandingbrand/fscomponents';
import GlobalStyle from '../styles/Global';
import translate, { translationKeys } from '../lib/translations';

const searchIcon = require('../../assets/images/search.png');

export interface PSSearchBarProps {
  style?: StyleProp<ViewStyle>;
  onFocus?: () => void;
  onSubmit?: () => void;
  onChange?: () => void;
}

export default class PSSearchBar extends Component<PSSearchBarProps> {
  render(): JSX.Element {
    return (
      <SearchBar
        style={this.props.style}
        containerStyle={GlobalStyle.searchBarInner}
        inputTextStyle={GlobalStyle.searchBarInputTextStyle}
        onSubmit={this.props.onSubmit}
        onChange={this.props.onChange}
        searchIcon={searchIcon}
        onFocus={this.props.onFocus}
        placeholder={translate.string(translationKeys.search.placeholder)}
      />
    );
  }
}
