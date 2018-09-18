import React, { Component } from 'react';

import { backButton, searchButton } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';

import PSScreenWrapper from '../components/PSScreenWrapper';
import PSProductIndex from '../components/PSProductIndex';

export interface ProductIndexProps extends ScreenProps {
  categoryId: string; // passed by Navigator
  title?: string; // passed by Navigator
}

export default class ProductIndex extends Component<ProductIndexProps> {
  static navigatorStyle: NavigatorStyle = navBarDefault;
  static leftButtons: NavButton[] = [backButton];
  static rightButtons: NavButton[] = [searchButton];

  render(): JSX.Element {
    const { navigator } = this.props;

    return (
      <PSScreenWrapper
        navigator={navigator}
      >
        <PSProductIndex {...this.props} />
      </PSScreenWrapper>
    );
  }
}
