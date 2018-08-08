/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in development
import React, { Component } from 'react';

import PSScreenWrapper from '../components/PSScreenWrapper';
import Row from '../components/PSRow';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarDefault } from '../styles/Navigation';
import withAccount, { AccountProps } from '../providers/accountProvider';
type Screen = import ('react-native-navigation').Screen;

const screens: Screen[] = [
  { title: 'Product Index', screen: 'ProductIndex' },
  { title: 'Product Detail', screen: 'ProductDetail' }
];

export interface DevelopmentScreenState {
  deviceToken: string;
}

export interface DevelopmentScreenProps extends ScreenProps, AccountProps {}

class Development extends Component<DevelopmentScreenProps, DevelopmentScreenState> {
  static navigatorStyle: NavigatorStyle = navBarDefault;

  state: DevelopmentScreenState = {
    deviceToken: 'NOT INITIALIZED'
  };

  render(): JSX.Element {
    const { navigator } = this.props;
    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={navigator}
      >
        {screens.map((screen, i) => (
          <Row
            key={i}
            title={screen.title || `Screen ${i}`}
            onPress={this.goTo(screen)}
          />
        ))}
        <Row
          title='Sign Out without clearing saved credentials'
          onPress={this.softSignOut}
        />
      </PSScreenWrapper>
    );
  }

  goTo = (screen: Screen) => () => {
    this.props.navigator.push(screen);
  }

  softSignOut = () => {
    const noop = () => undefined;
    this.props.signOut(false).then(noop).catch(noop);
  }
}

export default withAccount(Development);
