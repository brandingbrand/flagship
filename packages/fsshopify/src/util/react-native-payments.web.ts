import * as RNPayments from '@brandingbrand/react-native-payments';

export type PaymentDetailsInit = RNPayments.PaymentDetailsInit;
export type PaymentMethodData = RNPayments.PaymentMethodData;
export type PaymentOptions = RNPayments.PaymentOptions;

type PaymentRequestInterface = RNPayments.PaymentRequest;
type PaymentResponse = RNPayments.PaymentResponse;
type PaymentRequestUpdateEvent = RNPayments.PaymentRequestUpdateEvent;

export class PaymentRequest implements PaymentRequestInterface {
  id: string = '';
  shippingAddress: null | PaymentAddress = null;
  shippingOption: null | string = null;

  constructor(
    methodData: PaymentMethodData[],
    details?: PaymentDetailsInit,
    options?: PaymentOptions
  ) {
    throw new Error('Unsupported');
  }

  async show(): Promise<PaymentResponse> {
    throw new Error('Unsupported');
  }

  async abort(): Promise<void> {
    throw new Error('Unsupported');
  }

  async canMakePayments(): Promise<boolean> {
    return false;
  }

  addEventListener(
    eventName: 'shippingaddresschange' | 'shippingoptionchange',
    fn: (e: PaymentRequestUpdateEvent) => void
  ): void {
    throw new Error('Unsupported');
  }
}
