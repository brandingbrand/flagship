import React, { Component } from 'react';
import { Options } from 'react-native-navigation';
import { WebView } from 'react-native-webview';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';

class CartCountSample extends Component<ScreenProps> {
  static options: Options = navBarTabLanding;

  render(): JSX.Element {

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={this.props.navigator}
        scroll={false}
      >
        <WebView style={{flex: 1}} source={{ uri: 'https://www.brandingbrand.com' }} />
      </PSScreenWrapper>
    );
  }
}

export default CartCountSample;
