import React, { Component } from 'react';
import { Options } from 'react-native-navigation';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import { Carousel } from '@brandingbrand/fscomponents';
import { Image, View } from 'react-native';

const placeholder = require('../../assets/images/placeholder-100x100.png');

class CartCountSample extends Component<ScreenProps> {
  static options: Options = navBarTabLanding;

  render(): JSX.Element {
    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={this.props.navigator}
        scroll={false}
      >
        <Carousel height={100} showsPagination={true} showsButtons={true}>
          <View style={{flex: 1}}><Image source={placeholder} /></View>
          <View style={{flex: 1}}><Image source={placeholder} /></View>
          <View style={{flex: 1}}><Image source={placeholder} /></View>
        </Carousel>
      </PSScreenWrapper>
    );
  }
}

export default CartCountSample;
