import React, { Component } from 'react';
import { Picker, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PaymentCurrencyAmount, PaymentRequest } from 'react-native-payments';
import ShopifyAPIError from '../util/ShopifyAPIError';
import { GooglePayShippingOptionsModalProps } from '../customTypes';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    flex: 1
  },
  button: {
    backgroundColor: 'cornflowerblue',
    padding: 10
  }
});

export interface GooglePayShippingOptionsModalState {
  shippingHandle?: string;
  total: {
    amount: PaymentCurrencyAmount;
  };
}

export default class GooglePayShippingOptionsModal extends
  Component<GooglePayShippingOptionsModalProps, GooglePayShippingOptionsModalState> {

  static getDerivedStateFromProps(
    nextProps: GooglePayShippingOptionsModalProps,
    prevState?: GooglePayShippingOptionsModalState
  ): Partial<GooglePayShippingOptionsModalState> | null {
    return {
      total: prevState && prevState.total || nextProps.orderDetails.total
    };
  }

  componentDidMount(): void {
    // select the first shipping option by default
    if (this.props.orderDetails.shippingOptions) {
      this.updateHandle(this.props.orderDetails.shippingOptions[0].id).catch();
    }
  }

  render(): JSX.Element {
    const { total } = this.state;
    return (
      <View style={styles.view}>
        <Text>{FSI18n.string(translationKeys.flagship.checkout.shipping.select)}</Text>

        <Picker
          prompt={FSI18n.string(translationKeys.flagship.checkout.shipping.select)}
          selectedValue={this.state.shippingHandle}
          onValueChange={this.updateHandle}
        >
          {this.props.orderDetails.shippingOptions &&
          this.props.orderDetails.shippingOptions.map(option => {
            const { id, label, amount } = option;
            return <Picker.Item
              key={id}
              label={label + ' ' + FSI18n.currency(amount.value, amount.currency)}
              value={id}
            />;
          })}
        </Picker>

        <Text>
          {FSI18n.string(translationKeys.flagship.checkout.summary.total)}
          {': '}
          {FSI18n.currency(total.amount.value, total.amount.currency)}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={this.continue}
        >
          <Text>{FSI18n.string(translationKeys.flagship.checkout.continue)}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  private continue = async () => {
    const {
      datasource,
      checkoutId,
      ShopifySupportedMethods,
      orderDetails,
      test,
      payment,
      onSuccess
    } = this.props;

    // clone orderDetails to mutate it
    const details = JSON.parse(JSON.stringify(orderDetails));
    details.total.amount.value = this.state.total;

    const secondReq = new PaymentRequest(ShopifySupportedMethods, details, {
      requestPayerName: true
    });
    const secondPaymentResponse = await secondReq.show();
    if (secondPaymentResponse) {
      // Fetch PaymentToken
      if (!secondPaymentResponse.details.getPaymentToken) {
        throw new ShopifyAPIError('getPaymentToken does not exist on android order?');
      }

      const pToken = await secondPaymentResponse.details.getPaymentToken();

      const submitResponse = await datasource.api
        .checkoutCompleteWithTokenizedPayment(checkoutId, {
          test,
          type: 'android_pay',
          amount: this.state.total.amount.value,
          billingAddress: payment.billingAddress,
          paymentData: pToken.paymentToken.encryptedMessage,
          identifier: pToken.paymentToken.ephemeralPublicKey,
          idempotencyKey: pToken.paymentToken.tag
        });

      onSuccess(await datasource.orderResolver(submitResponse));
    } else {
      throw new ShopifyAPIError('Unable to complete android payment');
    }
  }

  private updateHandle = async (itemValue: string) => {
    // send to shopify and update totals
    const updatedCheckout = await this.props.datasource.api
      .checkoutShippingLineUpdate(this.props.checkoutId, itemValue);

    if (updatedCheckout && updatedCheckout.shippingLine) {
      this.setState({
        shippingHandle: itemValue,
        total: {
          amount: {
            value: updatedCheckout.paymentDue,
            currency: updatedCheckout.currencyCode
          }
        }
      });
    } else {
      throw new ShopifyAPIError('Unable to update shipping method');
    }
  }
}
