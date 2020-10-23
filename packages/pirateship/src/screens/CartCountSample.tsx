import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { LayoutComponent, Options } from 'react-native-navigation';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import { CartCount, CartCountProps, TextPositions } from '@brandingbrand/fscomponents';

const cartIcon = require('../../assets/images/cart-tab-icon.png');

// const positions = ['topLeft', 'topRight', 'center', 'bottomLeft', 'bottomRight'];

export interface CartCountSampleScreenProps extends ScreenProps, CartCountProps {}

const styles = StyleSheet.create({
  row: {
    padding: 15,
    alignItems: 'center'
  }
});

class CartCountSample extends Component<CartCountSampleScreenProps> {
  static options: Options = navBarTabLanding;

  render(): JSX.Element {

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={this.props.navigator}
      >
        <View style={styles.row}>
          <CartCount
            textPosition={'topRight' as TextPositions}
            count={8}
            cartImage={cartIcon}
          />
        </View>
        <View style={styles.row}>
          <CartCount
            textPosition={'topLeft' as TextPositions}
            count={2}
            cartImage={cartIcon}
          />
        </View>
        <View style={styles.row}>
          <CartCount
            textPosition={'bottomRight' as TextPositions}
            count={5}
            cartImage={cartIcon}
          />
        </View>
      </PSScreenWrapper>
    );
  }

  goTo = (screen: LayoutComponent) => () => {
    this.props.navigator.push({
      component: screen
    }).catch(e => console.warn('PUSH error: ', e));
  }
}

export default CartCountSample;
