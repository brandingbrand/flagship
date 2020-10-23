import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import { PayPalCheckoutButton } from '../PayPalCheckoutButton';
import { withDigitalWallet } from '../DigitalWalletProvider';
const emptyOnPress: () => void = () => {
  return;
};
const PayPalButtonWrapper = (props: any) => {
  return (
    <PayPalCheckoutButton
      shape={'pill'}
      theme={'gold'}
      tagLine={'PayPal Tagline'}
      title={''}
      onPress={emptyOnPress}
    />
  );
};

const PayPalButtonWithWallet = withDigitalWallet(PayPalButtonWrapper);

storiesOf('PayPalButton', module)
  .add('basic usage', () => (
    <PayPalButtonWithWallet
      payPalMerchantIdentifier='com.bb.test'
      payPalOnPress={action('Pay')}
    />
  ));
