/**
 * High order component that will wrap a specified component with logic to
 * handle one or more digital wallets such as Apple Pay.
 *
 * Optional properties:
 * applePayMerchantIdentifier: string - Identifier to enable ApplePay
 * applePayOnPress: () => void - Function to be invoked when Apple Pay button is pressed
 *
 * Properties passed to the wrapped component:
 * showApplePayButton: boolean - Whether to show the Apple Pay button
 * showApplePaySetupButton: boolean - Whether to show the Apple Pay setup button
 * applePaySetupPress: () => void - Function to be invoked when AP setup button is pressed
 */

import React, { ComponentClass, StatelessComponent } from 'react';

import { default as ApplePay } from '../lib/wallets/ApplePay';
import { Alert } from './Alert';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

// State for the DigitalWalletProvider component
export interface WithDigitalWalletState {
  showApplePayButton: boolean;
  showApplePaySetupButton: boolean;
}

// Props passed into DigitalWalletProvider component
export interface ExternalProps {
  applePayMerchantIdentifier: string;
  applePayOnPress?: () => void;
}

// Props to be passed from DigitalWalletProvider to the wrapped component
export interface InjectedProps {
  showApplePayButton?: boolean;
  showApplePaySetupButton?: boolean;
  applePaySetupPress?: () => void;
}

export function withDigitalWallet<P extends {}>(
  Component: (ComponentClass<P & InjectedProps> | StatelessComponent<P & InjectedProps>)
): ComponentClass<P & ExternalProps> {
  type ResultProps = P & ExternalProps;

  return class DigitalWalletProvider extends React.Component<ResultProps, WithDigitalWalletState> {
    applePay: ApplePay;
    promises: Promise<any>[] = [];

    constructor(props: ResultProps) {
      super(props);

      // Fill the promises array with a list of promises to be invoked when the
      // component is mounted
      this.applePay = new ApplePay(props.applePayMerchantIdentifier);
      this.promises.push(this.initApplePay());

      // Handle more payment providers here...
    }

    // Function to be invoked when the Apple Pay setup button is pressed. If successful,
    // will update state to specify that the AP pay button should be displayed.
    handleApplePaySetup = async () => {
      return this.applePay.setupApplePay()
        .then(success => {
          if (success) {
            this.setState({
              showApplePayButton: true,
              showApplePaySetupButton: false
            });
          } else {
            Alert.alert(FSI18n.string(translationKeys.flagship.cart.digitalWallet.appleError));
          }
        })
        .catch(e => {
          console.error(e);
          Alert.alert('Apple Pay was unable to complete your request.');
        });
    }

    async initApplePay(): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        // Check if user has Apple Pay on their device
        if (this.applePay.isEnabled()) {
          // Check if user has a card already set up
          this.applePay.hasActiveCard()
            .then(hasActiveCard => {
              if (hasActiveCard) {
                this.setState({
                  showApplePayButton: true,
                  showApplePaySetupButton: false
                });

                return resolve();
              } else if (this.applePay.canCallSetup()) {
                // User's device supports invoking the AP setup interface
                this.setState({
                  showApplePayButton: false,
                  showApplePaySetupButton: true
                });

                return resolve();
              }
            })
            .catch(e => {
              return reject(e);
            });
        }
      });
    }

    componentDidMount(): void {
      Promise.all(this.promises)
        .catch(e => {
          console.error(e);
        });
    }

    render(): JSX.Element {
      return (
        <Component
          {...this.props}
          {...this.state}
          applePaySetupPress={this.handleApplePaySetup}
        />
      );
    }
  };
}
