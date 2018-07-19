import AnalyticsProviderConfiguration from './types/AnalyticsProviderConfiguration';

// Common Interface

export interface Generics {
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

export interface Screenview {
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
  price?: string;
  index?: number;
}

export interface Product extends Generics {
  identifier: string;
  name: string;
  brand?: string;
  category?: string;
  variant?: string;
  price?: string;
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

export interface RefundProduct {
  identifier: string;
  quantity: number;
  price?: string;
  coupons?: string[];
}

export interface TransactionProduct {
  identifier: string;
  name: string;
  brand?: string;
  category?: string;
  variant?: string;
  price?: string;
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

export interface ProductAction {
  list?: string;
}

export interface CheckoutAction {
  step?: number;
  option?: string;
}

export interface TransactionAction {
  identifier: string;
  affiliation?: string;
  revenue?: string;
  tax?: string;
  shippingCost?: string;
  coupons?: string[];
}

// App Lifercyle Interfaces

export interface App {
  eventAction: string;
  lifecycle: string;
}

// Class

export default abstract class AnalyticsProvider {
  protected userAgent: string;
  protected osType: string;
  protected osVersion: string;
  protected appName: string;
  protected appId: string;
  protected appVersion: string;
  protected appInstallerId?: string;

  constructor(configuration: AnalyticsProviderConfiguration) {
    this.userAgent = String(configuration.userAgent);
    this.osType = String(configuration.osType);
    this.osVersion = String(configuration.osVersion);
    this.appName = String(configuration.appName);
    this.appId = String(configuration.appId);
    this.appVersion = String(configuration.appVersion);
    this.appInstallerId = String(configuration.appInstallerId);
  }

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
