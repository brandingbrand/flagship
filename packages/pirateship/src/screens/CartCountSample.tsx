import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import { CartCount, CartCountProps, TextPositions } from '@brandingbrand/fscomponents';

type Screen = import ('react-native-navigation').Screen;

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
  static navigatorStyle: NavigatorStyle = navBarTabLanding;

  render(): JSX.Element {

    const { navigator } = this.props;


    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={navigator}
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

  goTo = (screen: Screen) => () => {
    this.props.navigator.push(screen);
  }
}

export default CartCountSample;
