import React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { withDigitalWallet } from '../src/components/DigitalWalletProvider';
import { PayPalCheckoutButton } from '../src/components/PayPalCheckoutButton';

const emptyOnPress: () => void = () => {};
const PayPalButtonWrapper = (props: unknown) => (
  <PayPalCheckoutButton
    onPress={emptyOnPress}
    shape="pill"
    tagLine="PayPal Tagline"
    theme="gold"
    title=""
  />
);

const PayPalButtonWithWallet = withDigitalWallet(PayPalButtonWrapper);

storiesOf('PayPalButton', module).add('basic usage', () => (
  <PayPalButtonWithWallet
    applePayMerchantIdentifier="com.bb.test"
    applePayOnPress={action('Pay')}
  />
));
