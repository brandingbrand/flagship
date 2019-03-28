/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in development
import React, { Component } from 'react';
import PSScreenWrapper from '../components/PSScreenWrapper';
import Row from '../components/PSRow';
import { NavigatorStyle, SampleMenuRowItem, ScreenProps } from '../lib/commonTypes';
import { navBarSampleScreen } from '../styles/Navigation';
import withAccount, { AccountProps } from '../providers/accountProvider';
type Screen = import ('react-native-navigation').Screen;

const screens: SampleMenuRowItem[] = [
  {
    title: 'Sign In',
    screen: 'SignIn',
    passProps: {
      sampleScreen: true
    }
  },
  {
    title: 'Sign Up',
    screen: 'SignUp',
    passProps: {
      sampleScreen: true
    }
  },
  {
    title: 'Lost Password',
    screen: 'ForgotPassword',
    passProps: {
      sampleScreen: true
    }
  }
];


export interface AccountSampleMenuProps extends ScreenProps, AccountProps {}

class AccountSampleMenu extends Component<AccountSampleMenuProps> {
  static navigatorStyle: NavigatorStyle = navBarSampleScreen;

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
      </PSScreenWrapper>
    );
  }

  goTo = (screen: Screen) => () => {
    this.props.navigator.push(screen);
  }

}

export default withAccount(AccountSampleMenu);
