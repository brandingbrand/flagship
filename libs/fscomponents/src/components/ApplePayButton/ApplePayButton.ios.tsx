import React from 'react';

import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ApplePayButtonBase } from './ApplePayButtonBase';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

// TODO - Replace image with call to Apple's PKPaymentButton
import PLACEHOLDER_APPLE_PAY_IMAGE from '../../../assets/images/applePayWhite.png';

const componentTranslation = translationKeys.flagship.applePayButton.text;

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export class ApplePayButton extends ApplePayButtonBase {
  componentDidMount(): void {
    this.setState({
      showPayButton: true,
    });
  }

  render(): JSX.Element {
    return (
      <View style={this.props.style}>
        <TouchableOpacity
          onPress={this.props.applePayOnPress}
          style={[styles.touchable]}
          accessibilityRole={'button'}
          accessibilityLabel={FSI18n.string(componentTranslation)}
        >
          <Image source={PLACEHOLDER_APPLE_PAY_IMAGE} />
        </TouchableOpacity>
      </View>
    );
  }
}
