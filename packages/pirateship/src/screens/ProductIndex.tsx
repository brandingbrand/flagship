import React, { Component } from 'react';

import { backButton, searchButton } from '../lib/navStyles';

import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
// import { navBarDefault, navBarSampleScreen } from '../styles/Navigation';
import { navBarDefault } from '../styles/Navigation';

import PSScreenWrapper from '../components/PSScreenWrapper';
import PSProductIndex from '../components/PSProductIndex';

export interface ProductIndexProps extends ScreenProps {
  categoryId: string; // passed by Navigator
  title?: string; // passed by Navigator
  sampleScreen?: boolean;
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
