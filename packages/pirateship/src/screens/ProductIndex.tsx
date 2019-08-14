import React, { Component } from 'react';
import { Options } from 'react-native-navigation';

import { backButton, searchButton } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import { ScreenProps } from '../lib/commonTypes';

import PSScreenWrapper from '../components/PSScreenWrapper';
import PSProductIndex from '../components/PSProductIndex';

export interface ProductIndexProps extends ScreenProps {
  title?: string; // passed by Navigator
}

export default class ProductIndex extends Component<ProductIndexProps> {
  static options: Options = {
    ...navBarDefault,
    topBar: {
      ...navBarDefault.topBar,
      leftButtons: [backButton.button],
      rightButtons: [searchButton.button]
    }
  }

  render(): JSX.Element {

    return (
      <PSScreenWrapper>
        <PSProductIndex {...this.props} />
      </PSScreenWrapper>
    );
  }
}
