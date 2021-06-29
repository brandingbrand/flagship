import React, { Component } from 'react';
import { Options } from 'react-native-navigation';

import { backButton, searchButton } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import { NavButton, ScreenProps } from '../lib/commonTypes';

import PSScreenWrapper from '../components/PSScreenWrapper';
import PSProductIndex from '../components/PSProductIndex';

export interface ProductIndexProps extends ScreenProps {
  title?: string; // passed by Navigator
}

export default class ProductIndex extends Component<ProductIndexProps> {
  static options: Options = navBarDefault;
  static leftButtons: NavButton[] = [backButton];
  static rightButtons: NavButton[] = [searchButton];
  render(): JSX.Element {

    return (
      <PSScreenWrapper
        navigator={this.props.navigator}
      >
        <PSProductIndex {...this.props} />
      </PSScreenWrapper>
    );
  }
}
