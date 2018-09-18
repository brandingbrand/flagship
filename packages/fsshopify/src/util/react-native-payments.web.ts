export type PaymentDetailsInit = import ('react-native-payments').PaymentDetailsInit;
export type PaymentMethodData = import ('react-native-payments').PaymentMethodData;
export type PaymentOptions = import ('react-native-payments').PaymentOptions;

type PaymentRequestInterface = import ('react-native-payments').PaymentRequest;
type PaymentResponse = import ('react-native-payments').PaymentResponse;
type PaymentRequestUpdateEvent = import ('react-native-payments').PaymentRequestUpdateEvent;

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
