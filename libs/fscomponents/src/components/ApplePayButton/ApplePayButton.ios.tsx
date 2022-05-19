import React from 'react';

import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

// TODO - Replace image with call to Apple's PKPaymentButton
import PLACEHOLDER_APPLE_PAY_IMAGE from '../../../assets/images/applePayWhite.png';

import { ApplePayButtonBase } from './ApplePayButtonBase';

const componentTranslation = translationKeys.flagship.applePayButton.text;

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export class ApplePayButton extends ApplePayButtonBase {
  public componentDidMount(): void {
    this.setState({
      showPayButton: true,
    });
  }

  public render(): JSX.Element {
    return (
      <View style={this.props.style}>
        <TouchableOpacity
          accessibilityLabel={FSI18n.string(componentTranslation)}
          accessibilityRole="button"
          onPress={this.props.applePayOnPress}
          style={styles.touchable}
        >
          <Image source={PLACEHOLDER_APPLE_PAY_IMAGE} />
        </TouchableOpacity>
      </View>
    );
  }
}
