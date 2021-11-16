/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in development
import React, { Component } from 'react';
import PSScreenWrapper from '../components/PSScreenWrapper';
import Row from '../components/PSRow';
import { ScreenProps } from '../lib/commonTypes';
import { navBarDefault } from '../styles/Navigation';
import withAccount, { AccountProps } from '../providers/accountProvider';
import { LayoutComponent, Options } from 'react-native-navigation';

const screens: LayoutComponent[] = [
  { options: { topBar: { title: { text: 'Product Index' }}}, name: 'ProductIndex' },
  { options: { topBar: { title: { text: 'Product Detail' }}}, name: 'ProductDetail' },
  { options: { topBar: { title: { text: 'Accordion' }}}, name: 'AccordionSample' },
  { options: { topBar: { title: { text: 'Action Bar' }}}, name: 'ActionBarSample' },
  { options: { topBar: { title: { text: 'BreadCrumbs' }}}, name: 'BreadCrumbsSample' },
  { options: { topBar: { title: { text: 'Image With Overlay' }}}, name: 'ImageWithOverlaySample' },
  { options: { topBar: { title: { text: 'Cart Count' }}}, name: 'CartCountSample'},
  { options: { topBar: { title: { text: 'PS Half Modal' }}}, name: 'EmailSignUp' },
  { options: { topBar: { title: { text: 'Webview' }}}, name: 'WebviewSample' },
  { options: { topBar: { title: { text: 'Carousel' }}}, name: 'CarouselSample' }
];

export interface DevelopmentScreenState {
  deviceToken: string;
}

export interface DevelopmentScreenProps extends ScreenProps, AccountProps {}

class Development extends Component<DevelopmentScreenProps, DevelopmentScreenState> {
  static options: Options = navBarDefault;

  state: DevelopmentScreenState = {
    deviceToken: 'NOT INITIALIZED'
  };

  render(): JSX.Element {
    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={this.props.navigator}
      >
        <Row
          title='Sign Out without clearing saved credentials'
          onPress={this.softSignOut}
        />
        {screens.map((screen, i) => {
          const title: string = screen.options && screen.options.topBar &&
            screen.options.topBar.title && screen.options.topBar.title.text || '';
          return (
            <Row
              key={i}
              title={title || `Screen ${i}`}
              onPress={this.goTo(screen)}
            />
          );
        })}
      </PSScreenWrapper>
    );
  }

  goTo = (screen: LayoutComponent) => () => {
    this.props.navigator.push({
      component: screen
    }).catch(e => console.warn(`${screen} PUSH error: `, e));
  }

  softSignOut = () => {
    const noop = () => undefined;
    this.props.signOut(false).then(noop).catch(noop);
  }
}

export default withAccount(Development);
