import AnalyticsProviderConfiguration from './types/AnalyticsProviderConfiguration';
import Decimal from 'decimal.js';
type BaseEvent = import ('../Analytics').BaseEvent;

// Common Interface

export interface Generics extends BaseEvent {
  eventAction: string;
  eventCategory: string;
}

// Commerce Interfaces

export interface ClickGeneric extends Generics {
  identifier?: string;
  name?: string;
  index?: number;
}

export interface ContactCall extends Generics {
  number: string;
}

export interface ContactEmail extends Generics {
  to: string;
}

export interface ImpressionGeneric extends Generics {
  identifier?: string;
  name?: string;
  index?: number;
}

export interface LocationDirections extends Generics {
  identifier?: string;
  address?: string;
}

export interface SearchGeneric extends Generics {
  term: string;
  count?: number;
}

export interface Screenview extends BaseEvent {
  eventCategory: string;
  url: string;
}

// Enhanced Commerce Interfaces

export interface Checkout extends Generics {
  products: TransactionProduct[];
}

export interface ImpressionProduct extends Generics {
  identifier: string;
  name: string;
  brand?: string;
  category?: string;
  list: string;
  variant?: string;
  price?: string | Decimal;
  index?: number;
}

export interface Product extends Generics {
  identifier: string;
  name: string;
  brand?: string;
  category?: string;
  variant?: string;
  price?: string | Decimal;
  quantity?: number;
  coupons?: string[];
  index?: number;
}

export interface Promotion extends Generics {
  identifier: string;
  name: string;
  creative?: string;
  slot?: string;
}

export interface RefundProduct extends BaseEvent {
  identifier: string;
  quantity: number;
  price?: string | Decimal;
  coupons?: string[];
}

export interface TransactionProduct extends BaseEvent {
  identifier: string;
  name: string;
  brand?: string;
  category?: string;
  variant?: string;
  price?: string | Decimal;
  quantity?: number;
  coupons?: string[];
  index?: number;
}

export interface Transaction extends Generics {
  products: TransactionProduct[];
}

export interface TransactionRefund extends Generics {
  products: RefundProduct[];
}

// Enhanced Commerce Action Interfaces

export interface ProductAction extends BaseEvent {
  list?: string;
}

export interface CheckoutAction extends BaseEvent {
  step?: number;
  option?: string;
}

export interface TransactionAction extends BaseEvent {
  identifier: string;
  affiliation?: string;
  revenue?: string;
  tax?: string;
  shippingCost?: string;
  coupons?: string[];
}

// App Lifercyle Interfaces

export interface App extends BaseEvent {
  eventAction: string;
  lifecycle: string;
}

async function resolvePromise<T>(value?: T | Promise<T>): Promise<T | undefined> {
  if (value === undefined) {
    return undefined;
  }
  // @ts-ignore Check is needed to determine if it is a promise or not
  if ((value as Promise<T>).then) {
    // tslint:disable-next-line: no-return-await
    return await (value as Promise<T>);
  }
  return value;
}

const resolvePromises = async (
  configuration: AnalyticsProviderConfiguration
): Promise<AnalyticsProviderConfiguration> => {
  const newConfig: any = {};
  for (const key in configuration) {
    if (configuration.hasOwnProperty(key)) {
      newConfig[key] = await resolvePromise(configuration[
        key as keyof AnalyticsProviderConfiguration
      ]);
    }
  }
  return newConfig;
};

// Class

export default abstract class AnalyticsProvider {
  protected userAgent: string = '';
  protected osType: string = '';
  protected osVersion: string = '';
  protected appName: string = '';
  protected appId: string = '';
  protected appVersion: string = '';
  protected appInstallerId?: string;

  constructor(initialConfig: AnalyticsProviderConfiguration) {
    resolvePromises(initialConfig).then((configuration: AnalyticsProviderConfiguration) => {
      this.userAgent = String(configuration.userAgent);
      this.osType = String(configuration.osType);
      this.osVersion = String(configuration.osVersion);
      this.appName = String(configuration.appName);
      this.appId = String(configuration.appId);
      this.appVersion = String(configuration.appVersion);
      this.appInstallerId = configuration.appInstallerId && String(configuration.appInstallerId);
      this.asyncInit().catch(e => {
        console.warn('error initializing analytics provider', e);
      });
    }).catch(e => {
      console.warn('error initializing analytics promises', e);
    });
  }

  abstract async asyncInit(): Promise<void>;

  // Commerce Functions

  abstract clickGeneric(properties: ClickGeneric): void;

  abstract contactCall(properties: ContactCall): void;

  abstract contactEmail(properties: ContactEmail): void;

  abstract impressionGeneric(properties: ImpressionGeneric): void;

  abstract locationDirections(properties: LocationDirections): void;

  abstract pageview(properties: Screenview): void;

  abstract screenview(properties: Screenview): void;

  abstract searchGeneric(properties: SearchGeneric): void;

  // Enhanced Commerce Functions

  abstract addProduct(properties: Product): void;

  abstract checkout(properties: Checkout, action: CheckoutAction): void;

  abstract checkoutOption(properties: Generics, action: CheckoutAction): void;

  abstract clickProduct(properties: Product, action?: ProductAction): void;

  abstract clickPromotion(properties: Promotion): void;

  abstract impressionProduct(properties: ImpressionProduct): void;

  abstract impressionPromotion(properties: Promotion): void;

  abstract detailProduct(properties: Product, action?: ProductAction): void;

  abstract purchase(properties: Transaction, action: TransactionAction): void;

  abstract refundAll(properties: Generics, action: TransactionAction): void;

  abstract refundPartial(properties: TransactionRefund, action: TransactionAction): void;

  abstract removeProduct(properties: Product): void;

  // App Lifecycle Function

  abstract lifecycle(properties: App): void;
}
