/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in development
import React, { Component } from 'react';
import PSScreenWrapper from '../components/PSScreenWrapper';
import Row from '../components/PSRow';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarSampleScreen } from '../styles/Navigation';
import withAccount, { AccountProps } from '../providers/accountProvider';
type Screen = import ('react-native-navigation').Screen;

const screens: Screen[] = [
  {
    title: 'ImageWithOverlay',
    screen: 'ImageWithOverlaySample'
  }
];

export interface ImagesSampleMenuProps extends ScreenProps, AccountProps {}

class ImagesSampleMenu extends Component<ImagesSampleMenuProps> {
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

export default withAccount(ImagesSampleMenu);
