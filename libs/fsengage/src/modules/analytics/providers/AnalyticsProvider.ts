import type Decimal from 'decimal.js';

import type { BaseEvent, Campaign } from '../Analytics';

import type AnalyticsProviderConfiguration from './types/AnalyticsProviderConfiguration';

export interface Generics extends BaseEvent {
  eventAction: string;
  eventCategory: string;
}

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
  price?: Decimal | string;
  index?: number;
}

export interface Product extends Generics {
  identifier: string;
  name: string;
  brand?: string;
  category?: string;
  variant?: string;
  price?: Decimal | string;
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
  price?: Decimal | string;
  coupons?: string[];
}

export interface TransactionProduct extends BaseEvent {
  identifier: string;
  name: string;
  brand?: string;
  category?: string;
  variant?: string;
  price?: Decimal | string;
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

export interface App extends BaseEvent {
  eventAction: string;
  lifecycle: string;
}

const resolvePromise = async <T>(value?: Promise<T> | T): Promise<T | undefined> => {
  if (value === undefined) {
    return undefined;
  }
  if ((value as Promise<T>).then) {
    return value as Promise<T>;
  }
  return value;
};

const resolvePromises = async (
  configuration: AnalyticsProviderConfiguration
): Promise<AnalyticsProviderConfiguration> => {
  const newConfig: any = {};
  for (const key in configuration) {
    if (configuration.hasOwnProperty(key)) {
      newConfig[key] = await resolvePromise(
        configuration[key as keyof AnalyticsProviderConfiguration]
      );
    }
  }
  return newConfig;
};

export default abstract class AnalyticsProvider {
  constructor(initialConfig: AnalyticsProviderConfiguration) {
    resolvePromises(initialConfig)
      .then((configuration: AnalyticsProviderConfiguration) => {
        this.userAgent = String(configuration.userAgent);
        this.osType = String(configuration.osType);
        this.osVersion = String(configuration.osVersion);
        this.appName = String(configuration.appName);
        this.appId = String(configuration.appId);
        this.appVersion = String(configuration.appVersion);
        this.appInstallerId = configuration.appInstallerId && String(configuration.appInstallerId);
        this.asyncInit().catch((error) => {
          console.warn('error initializing analytics provider', error);
        });
      })
      .catch((error) => {
        console.warn('error initializing analytics promises', error);
      });
  }

  protected userAgent = '';
  protected osType = '';
  protected osVersion = '';
  protected appName = '';
  protected appId = '';
  protected appVersion = '';
  protected appInstallerId?: string;

  public abstract asyncInit(): Promise<void>;

  public abstract clickGeneric(properties: ClickGeneric): void;

  public abstract contactCall(properties: ContactCall): void;

  public abstract contactEmail(properties: ContactEmail): void;

  public abstract impressionGeneric(properties: ImpressionGeneric): void;

  public abstract locationDirections(properties: LocationDirections): void;

  public abstract pageview(properties: Screenview): void;

  public abstract screenview(properties: Screenview): void;

  public abstract searchGeneric(properties: SearchGeneric): void;

  public abstract addProduct(properties: Product): void;

  public abstract checkout(properties: Checkout, action: CheckoutAction): void;

  public abstract checkoutOption(properties: Generics, action: CheckoutAction): void;

  public abstract clickProduct(properties: Product, action?: ProductAction): void;

  public abstract clickPromotion(properties: Promotion): void;

  public abstract impressionProduct(properties: ImpressionProduct): void;

  public abstract impressionPromotion(properties: Promotion): void;

  public abstract detailProduct(properties: Product, action?: ProductAction): void;

  public abstract purchase(properties: Transaction, action: TransactionAction): void;

  public abstract refundAll(properties: Generics, action: TransactionAction): void;

  public abstract refundPartial(properties: TransactionRefund, action: TransactionAction): void;

  public abstract removeProduct(properties: Product): void;

  public abstract lifecycle(properties: App): void;

  public setTrafficSource(properties: Campaign): void {}
}
