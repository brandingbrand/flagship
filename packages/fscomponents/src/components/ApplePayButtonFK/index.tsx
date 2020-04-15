import React, { Component } from 'react';
import { NativeModules } from 'react-native';
import { ApplePayButton, ApplePayButtonProps } from '../ApplePayButton';
import {
  PaymentDetailsInit,
  PaymentRequest
} from '@brandingbrand/react-native-payments';

const { ReactNativePayments } = NativeModules;

export interface ApplePayButtonFKProps extends ApplePayButtonProps {
  iosMerchantIdentifier: string;
  supportedNetworks: string[];
  countryCode: string;
  currencyCode: string;
  paymentDetails: PaymentDetailsInit;
  applePayReady?: boolean;
  paymentOptions?: PaymentOptions;
  insteadOfPayButton?: JSX.Element;
  onApplePayReady: (canMakePayments: boolean) => void;
}

export interface ApplePayButtonFKState {
  applePayReady: boolean;
}

export class ApplePayButtonFK extends Component<ApplePayButtonFKProps, ApplePayButtonFKState> {

  constructor(props: ApplePayButtonFKProps) {
    super(props);

    this.state = {
      applePayReady: props.applePayReady || false
    };
  }

  onPayButtonReady = () => {
    if (this.props.onApplePayReady && typeof this.props.onApplePayReady === 'function') {
      this.props.onApplePayReady(this.state.applePayReady);
    }
  }

  async componentDidMount(): Promise<void> {
    try {
      const paymentRequest = new PaymentRequest(
        [{
          supportedMethods: ['apple-pay'],
          data: {
            merchantIdentifier: this.props.iosMerchantIdentifier,
            supportedNetworks: this.props.supportedNetworks,
            countryCode: this.props.countryCode,
            currencyCode: this.props.currencyCode
          }
        }],
        this.props.paymentDetails,
        this.props.paymentOptions
      );

      const canMakePayments = await paymentRequest.canMakePayment();

      this.setState({ applePayReady: canMakePayments }, this.onPayButtonReady);
    } catch (exception) {
      this.setState({ applePayReady: false }, this.onPayButtonReady);
    }
  }

  render(): React.ReactNode {
    const { applePayReady } = this.state;

    return ReactNativePayments.canMakePayments && applePayReady ? (
      <ApplePayButton
        buttonStyle={this.props.buttonStyle}
        style={this.props.style}
        applePayOnPress={this.props.applePayOnPress}
      />
    ) : (this.props.insteadOfPayButton || null);
  }

}
