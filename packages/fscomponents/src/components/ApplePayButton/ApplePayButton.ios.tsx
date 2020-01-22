import React from 'react';

import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import { ApplePayButtonBase } from './ApplePayButtonBase';

// TODO - Replace image with call to Apple's PKPaymentButton
const PLACEHOLDER_APPLE_PAY_IMAGE = require('../../../assets/images/applePayWhite.png');

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export class ApplePayButton extends ApplePayButtonBase {
  componentDidMount(): void {
    this.setState({
      showPayButton: true
    });
  }

  render(): JSX.Element {
    return (
      <View style={this.props.style}>
        <TouchableOpacity
          onPress={this.props.applePayOnPress}
          style={[styles.touchable]}
          accessibilityLabel={'Pay with Apple Pay'}
        >
          <Image source={PLACEHOLDER_APPLE_PAY_IMAGE} />
        </TouchableOpacity>
      </View>
    );
  }
}
