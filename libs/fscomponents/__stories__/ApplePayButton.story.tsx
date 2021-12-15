// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';
import { Text, View } from 'react-native';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { withDigitalWallet } from '../src/components/DigitalWalletProvider';
import { ApplePayButton } from '../src/components/ApplePayButton';

const ApplePayButtonWrapper = (props: any) => {
  return (
    <View>
      {(props.showApplePayButton || props.showApplePaySetupButton) && (
        <ApplePayButton
          applePayOnPress={props.applePayOnPress}
          applePaySetupPress={props.applePaySetupPress}
          showApplePayButton={props.showApplePayButton}
          showApplePaySetupButton={props.showApplePaySetupButton}
        />
      )}
      {!props.showApplePayButton && !props.showApplePaySetupButton && (
        <Text>Apple Pay is not supported on this device or browser</Text>
      )}
    </View>
  );
};

const ApplePayButtonWithWallet = withDigitalWallet(ApplePayButtonWrapper);

storiesOf('ApplePayButton', module)
  .add('basic usage', () => (
    <ApplePayButtonWithWallet
      applePayMerchantIdentifier='com.bb.test'
      applePayOnPress={action('Pay')}
    />
  ));
