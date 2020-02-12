export {
  PaymentDetailsInit,
  PaymentMethodData,
  PaymentRequestEvent,
  PaymentRequestEventMap
} from '@brandingbrand/react-native-payments';

import {
  PaymentRequest as PaymentRequestInterface, PaymentRequestEvent
} from '@brandingbrand/react-native-payments';

export class PaymentRequest implements PaymentRequestInterface {
  id: string = '';
  shippingAddress: null | PaymentAddress = null;
  shippingOption: null | string = null;
  shippingType: 'shipping' | 'delivery' | 'pickup' | null;
  onshippingaddresschange: ((
    this: PaymentRequestInterface,
    ev: PaymentRequestEvent
  ) => any) | null;
  onshippingoptionchange: ((
    this: PaymentRequestInterface,
    ev: PaymentRequestEvent
  ) => any) | null;

  constructor(
    methodData: PaymentMethodData[],
    details?: PaymentDetailsInit,
    options?: any // PaymentOptions is not defined in react-native-payments
  ) {
    throw new Error('Unsupported');
  }

  async canMakePayment(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions | undefined
  ): void;
  removeEventListener(type: any, listener: any, options?: any): void {
    throw new Error('Method not implemented.');
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
    fn: EventListenerOrEventListenerObject
  ): void {
    throw new Error('Unsupported');
  }
}
