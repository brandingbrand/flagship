/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in UISampleMenu
import React, { Component } from 'react';
import PSScreenWrapper from '../components/PSScreenWrapper';
import Row from '../components/PSRow';
import { NavigatorStyle, SampleMenuRowItem, ScreenProps } from '../lib/commonTypes';
import { navBarSampleScreen } from '../styles/Navigation';
import withAccount, { AccountProps } from '../providers/accountProvider';
type Screen = import ('react-native-navigation').Screen;

const screens: SampleMenuRowItem[] = [
  {
    title: 'Left Drawer Menu',
    screen: 'LeftDrawerMenu',
    passProps: {
      sampleScreen: true
    }
  },
  {
    title: 'Grid',
    screen: 'More',
    passProps: {
      sampleScreen: true
    }
  },
  {
    title: 'Accordion',
    screen: 'AccordionSample',
    passProps: {
      sampleScreen: true
    }
  },
  {
    title: 'ActionBar',
    screen: 'ActionBarSample',
    passProps: {
      sampleScreen: true
    }
  },
  {
    title: 'BreadCrumbs',
    screen: 'BreadCrumbsSample',
    passProps: {
      sampleScreen: true
    }
  }
];

export interface UISampleMenuScreenProps extends ScreenProps, AccountProps {}

class UISampleMenu extends Component<UISampleMenuScreenProps> {
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

export default withAccount(UISampleMenu);
