import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarSampleScreen } from '../styles/Navigation';
import { CartCount, CartCountProps, TextPositions } from '@brandingbrand/fscomponents';
import { backButton } from '../lib/navStyles';

type Screen = import ('react-native-navigation').Screen;

const cartIcon = require('../../assets/images/cart-tab-icon.png');

export interface CartCountSampleScreenProps extends ScreenProps, CartCountProps {
  sampleScreen?: boolean;
}

const styles = StyleSheet.create({
  row: {
    padding: 15,
    alignItems: 'center'
  }
});

class CartCountSample extends Component<CartCountSampleScreenProps> {
  static navigatorStyle: NavigatorStyle = navBarSampleScreen;
  static leftButtons: NavButton[] = [backButton];

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

  goTo = (screen: Screen) => () => {
    this.props.navigator.push(screen);
  }
}

export default CartCountSample;
