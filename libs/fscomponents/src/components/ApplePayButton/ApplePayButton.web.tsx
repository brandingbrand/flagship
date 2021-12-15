import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ApplePayButtonBase } from './ApplePayButtonBase';
import { ApplePayButtonProps } from './ApplePayButtonProps';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslation = translationKeys.flagship.applePayButton.text;

const css = `
  @supports (-webkit-appearance: -apple-pay-button) {
    .apple-pay-button {
        display: inline-block;
        -webkit-appearance: -apple-pay-button;
    }
    .apple-pay-button-black {
        -apple-pay-button-style: black;
    }
    .apple-pay-button-white {
        -apple-pay-button-style: white;
    }
    .apple-pay-button-white-with-line {
        -apple-pay-button-style: white-outline;
    }
    .apple-pay-set-up-button {
        display: inline-block;
        -webkit-appearance: -apple-pay-button;
        -apple-pay-button-type: set-up;
    }
    .apple-pay-set-up-button-black {
        -apple-pay-button-style: black;
    }
    .apple-pay-set-up-button-white {
        -apple-pay-button-style: white;
    }
    .apple-pay-set-up-button-white-with-line {
        -apple-pay-button-style: white-outline;
    }
  }
  @supports not (-webkit-appearance: -apple-pay-button) {
      .apple-pay-button {
          display: inline-block;
          background-size: 100% 60%;
          background-repeat: no-repeat;
          background-position: 50% 50%;
          border-radius: 5px;
          padding: 0px;
          box-sizing: border-box;
          min-width: 200px;
          min-height: 32px;
          max-height: 64px;
      }
      .apple-pay-button-black {
          background-image: -webkit-named-image(apple-pay-logo-white);
          background-color: black;
      }
      .apple-pay-button-white {
          background-image: -webkit-named-image(apple-pay-logo-black);
          background-color: white;
      }
      .apple-pay-button-white-with-line {
          background-image: -webkit-named-image(apple-pay-logo-black);
          background-color: white;
          border: .5px solid black;
      }
  }
`;

export class ApplePayButton extends ApplePayButtonBase {
  buttonStyle: string;

  constructor(props: ApplePayButtonProps) {
    super(props);

    this.buttonStyle = props.buttonStyle || 'black';
  }

  renderSetupButton(): JSX.Element {
    const className = 'apple-pay-set-up-button-' + this.buttonStyle;

    return (
      <TouchableOpacity onPress={this.props.applePaySetupPress}>
        <div className={`apple-pay-set-up-button ${className}`} />
      </TouchableOpacity>
    );
  }

  renderPayButton(): JSX.Element {
    const className = 'apple-pay-button-' + this.buttonStyle;

    return (
      <TouchableOpacity
        onPress={this.props.applePayOnPress}
        accessibilityRole={'button'}
        accessibilityLabel={FSI18n.string(componentTranslation)}
      >
        <div className={`apple-pay-button ${className}`} />
      </TouchableOpacity>
    );
  }

  render(): React.ReactNode {
    if (!this.props.showApplePaySetupButton && !this.props.showApplePayButton) {
      return null;
    }

    return (
      <View style={this.props.style}>
        <style>{css}</style>
        {this.props.showApplePaySetupButton && this.renderSetupButton()}
        {this.props.showApplePayButton && this.renderPayButton()}
      </View>
    );
  }
}
