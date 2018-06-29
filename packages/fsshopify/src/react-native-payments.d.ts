/* tslint:disable:max-classes-per-file */
declare module 'react-native-payments' {
  export class PaymentRequest {
    constructor(
      methodData: PaymentMethodData[] = [],
      details?: PaymentDetailsInit = [],
      options?: PaymentOptions = {}
    );

    get id(): string;
    get shippingAddress(): null | PaymentAddress;
    get shippingOption(): null | string;

    show(): Promise<PaymentResponse>;
    abort(): Promise<void>;
    canMakePayments(): Promise<boolean>;
    addEventListener(
      eventName: 'shippingaddresschange' | 'shippingoptionchange',
      fn: (e: PaymentRequestUpdateEvent) => void
    ): void;
  }

  export class PaymentRequestUpdateEvent {
    name: string;
    target: PaymentRequest;

    updateWith(PaymentDetailsModifierOrPromise: PaymentDetailsUpdate): void;
  }

  export class PaymentResponse {
    get requestId(): string;
    get methodName(): string;
    get details(): PaymentDetailsInit;
    get shippingAddress(): null | PaymentAddress;
    get shippingOption(): null | string;
    get payerName(): null | string;
    get payerPhone(): null | string;
    get payerEmail(): null | string;

    complete(paymentStatus: PaymentComplete): void;
  }

  export interface PaymentMethodData {
    supportedMethods: string[];
    data: Objec;
  }

  export interface PaymentDetailsBase {
    displayItems: PaymentItem[];
    shippingOptions?: PaymentShippingOption[];
    modifiers?: PaymentDetailsModifier[];
  }

  export interface PaymentDetailsInit extends PaymentDetailsBase {
    id?: string;
    total: PaymentItem;
    getPaymentToken?: Function;
  }

  export interface PaymentOptions {
    requestPayerName?: boolean;
    requestPayerEmail?: boolean;
    requestPayerPhone?: boolean;
    requestShipping?: boolean;
    shippingType?: PaymentShippingType;
  }

  export interface PaymentAddress {
    recipient: null | string;
    organization: null | string;
    addressLine: string[];
    city: string;
    region: string;
    country: string;
    postalCode: string;
    phone: null | string;
    languageCode: null | string;
    sortingCode: null | string;
    dependentLocality: null | string;
  }

  export type PaymentComplete = 'fail' | 'success' | 'unknown';

  export type PaymentShippingType = 'shipping' | 'delivery' | 'pickup';

  export interface PaymentItem {
    label: string;
    amount: PaymentCurrencyAmount;
    pending?: boolean;
  }

  export interface PaymentShippingOption {
    id: string;
    label: string;
    amount: PaymentCurrencyAmount;
    selected: boolean;
  }

  export interface PaymentDetailsModifier {
    supportinterfaceedMethods: string[];
    total: PaymentItem;
    additionalDisplayItems: PaymentItem[];
    data: Object;
  }

  export interface PaymentCurrencyAmount {
    currency: string;
    value: string;
  }

  export interface PaymentDetailsUpdate extends PaymentDetailsBase {
    error?: string;
    total: PaymentItem;
  }
}
