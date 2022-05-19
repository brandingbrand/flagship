import { Leanplum } from '@leanplum/react-native-sdk';
import Decimal from 'decimal.js';

import type {
  App,
  Checkout,
  CheckoutAction,
  ClickGeneric,
  ContactCall,
  ContactEmail,
  Generics,
  ImpressionGeneric,
  ImpressionProduct,
  LocationDirections,
  Product,
  ProductAction,
  Promotion,
  Screenview,
  SearchGeneric,
  Transaction,
  TransactionAction,
  TransactionRefund,
} from '../AnalyticsProvider';
import AnalyticsProvider from '../AnalyticsProvider';
import type AnalyticsProviderConfiguration from '../types/AnalyticsProviderConfiguration';

export interface LeanplumProviderConfiguration {
  appId: string;
  key: string;
  monetizationEventName?: string;
}

export default class LeanplumProvider extends AnalyticsProvider {
  constructor(
    commonConfiguration: AnalyticsProviderConfiguration,
    configuration: LeanplumProviderConfiguration
  ) {
    super(commonConfiguration);

    // Leanplum accepts by default 'Purchase' as event name for revenue metrics. Confirm with
    // the client if they are using the default or a custom one.
    // Reference: https://www.leanplum.com/docs/ios/events#tracking-purchase-or-monetization-events
    this.monetizationEventName = configuration.monetizationEventName || 'Purchase';

    Leanplum.setAppIdForProductionMode(configuration.appId, configuration.key);
    Leanplum.start();
    // TODO: Enable 'trackAllAppScreens'
  }

  private _transformCouponsArray(coupons: string[] = []): Record<string, string> {
    return coupons.reduce((coupons: any, coupon) => {
      const couponCount = Object.keys(coupons).length;

      coupons[`coupon${couponCount + 1}`] = coupon;

      return coupons;
    }, {});
  }

  public monetizationEventName: string;

  public async asyncInit(): Promise<void> {}

  public contactCall(properties: ContactCall): void {
    Leanplum.track(properties.eventAction, {
      component: properties.eventCategory,
      number: properties.number,
    });
  }

  public contactEmail(properties: ContactEmail): void {
    Leanplum.track(properties.eventAction, {
      component: properties.eventCategory,
      to: properties.to,
    });
  }

  public clickGeneric(properties: ClickGeneric): void {
    Leanplum.track(properties.eventAction, {
      component: properties.eventCategory,
      identifier: properties.identifier as string,
      name: properties.name as string,
      index: properties.index as number,
    });
  }

  public impressionGeneric(properties: ImpressionGeneric): void {
    this.clickGeneric(properties);
  }

  public locationDirections(properties: LocationDirections): void {
    Leanplum.track(properties.eventAction, {
      component: properties.eventCategory,
      identifier: properties.identifier as string,
      address: properties.address as string,
    });
  }

  public pageview(properties: Screenview): void {
    // Not supported since we are only targeting native environment.
  }

  public screenview(properties: Screenview): void {
    Leanplum.track('ScreenView', {
      component: properties.eventCategory,
      appId: this.appId,
      appInstallerId: this.appInstallerId as string,
      appName: this.appName,
      appVersion: this.appVersion,
    });
  }

  public searchGeneric(properties: SearchGeneric): void {
    Leanplum.track(properties.eventAction, {
      component: properties.eventCategory,
      term: properties.term,
      count: properties.count as number,
    });
  }

  public addProduct(properties: Product): void {
    Leanplum.track(properties.eventAction, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      brand: properties.brand as string,
      category: properties.category as string,
      variant: properties.variant as string,
      price: properties.price as string,
      quantity: properties.quantity as number,
      index: properties.index as number,
      ...this._transformCouponsArray(properties.coupons),
    });
  }

  public checkout(properties: Checkout, action: CheckoutAction): void {
    // Instead of attaching all products to one payload, I am sending them in separate ones to
    // support unlimited number of products. Leanplum only accepts 200 keys, which with the current
    // number of properties been tracked will mean just around 20 products.
    // Reference: https://www.leanplum.com/docs/ios/events#tracking-an-event
    for (const product of properties.products) {
      Leanplum.track(properties.eventAction, {
        component: properties.eventCategory,
        identifier: product.identifier,
        name: product.name,
        brand: product.brand as string,
        category: product.category as string,
        variant: product.variant as string,
        price: product.price as string,
        quantity: product.quantity as number,
        index: product.index as number,
        step: action.step as number, // Checkout step.
        ...this._transformCouponsArray(product.coupons),
      });
    }

    // Leanplum does not accept nested structures. So a separate event it is been sent for tracking
    // the checkout option, which do not need to be attached to every single product on the
    // checkout.
    Leanplum.track('checkoutOption', {
      component: properties.eventCategory,
      step: action.step as number,
      option: action.option as string,
    });
  }

  public checkoutOption(properties: Generics, action: CheckoutAction): void {
    Leanplum.track(properties.eventAction, {
      component: properties.eventCategory,
      step: action.step as number,
      option: action.option as string,
    });
  }

  public clickProduct(properties: Product, action?: ProductAction): void {
    Leanplum.track(properties.eventAction, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      brand: properties.brand as string,
      category: properties.category as string,
      list: action?.list as string,
      variant: properties.variant as string,
      price: properties.price as string,
      quantity: properties.quantity as number,
      index: properties.index as number,
      ...this._transformCouponsArray(properties.coupons),
    });
  }

  public clickPromotion(properties: Promotion): void {
    Leanplum.track(properties.eventAction, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      creative: properties.creative as string,
      slot: properties.slot as string,
    });
  }

  public impressionProduct(properties: ImpressionProduct): void {
    Leanplum.track(properties.eventAction, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      brand: properties.brand as string,
      category: properties.category as string,
      list: properties.list,
      variant: properties.variant as string,
      price: properties.price as string,
      index: properties.index as number,
    });
  }

  public impressionPromotion(properties: Promotion): void {
    // TODO: Fix this implementation so its not identical to clickPromotion
    this.clickPromotion(properties);
  }

  public detailProduct(properties: Product, action?: ProductAction): void {
    // TODO: Fix this implementation so its not identical to clickProduct
    this.clickProduct(properties);
  }

  public purchase(properties: Transaction, action: TransactionAction): void {
    // Instead of attaching all products to one payload, I am sending them in separate ones to
    // support unlimited number of products. Leanplum only accepts 200 keys, which with the current
    // number of properties been tracked will mean just around 20 products.
    // Reference: https://www.leanplum.com/docs/ios/events#tracking-an-event
    for (const product of properties.products) {
      Leanplum.track('purchaseDetail', {
        component: properties.eventCategory,
        identifier: product.identifier,
        transactionIdentifier: action.identifier, // Same as 'identifier' on 'purchase' event.
        name: product.name,
        brand: product.brand as string,
        category: product.category as string,
        variant: product.variant as string,
        price: product.price as string,
        quantity: product.quantity as number,
        index: product.index as number,
        ...this._transformCouponsArray(product.coupons),
      });
    }

    const total = action.revenue && new Decimal(action.revenue).toNumber();

    Leanplum.track(this.monetizationEventName, {
      component: properties.eventCategory,
      identifier: action.identifier, // Same as 'transactionIdentifier' on 'purchaseDetail' event.
      affiliation: action.affiliation as string,
      tax: action.tax as string,
      shippingCost: action.shippingCost as string,
      total: total || 0,
      ...this._transformCouponsArray(action.coupons),
    });
  }

  public refundAll(properties: Generics, action: TransactionAction): void {
    const total = action.revenue && new Decimal(action.revenue).toNumber();

    Leanplum.track(properties.eventAction, {
      component: properties.eventCategory,
      identifier: action.identifier,
      affiliation: action.affiliation as string,
      tax: action.tax as string,
      shippingCost: action.shippingCost as string,
      total: total || 0,
      ...this._transformCouponsArray(action.coupons),
    });
  }

  public refundPartial(properties: TransactionRefund, action: TransactionAction): void {
    // Instead of attaching all products to one payload, I am sending them in separate ones to
    // support unlimited number of products. Leanplum only accepts 200 keys, which with the current
    // number of properties been tracked will mean just around 20 products.
    // Reference: https://www.leanplum.com/docs/ios/events#tracking-an-event
    for (const product of properties.products) {
      Leanplum.track('refundPartialDetail', {
        component: properties.eventCategory,
        identifier: product.identifier,
        transactionIdentifier: action.identifier, // Same as 'identifier' on 'refundPartial' event.
        price: product.price as string,
        quantity: product.quantity,
      });
    }

    const total = action.revenue && new Decimal(action.revenue).toNumber();

    Leanplum.track(properties.eventAction, {
      component: properties.eventCategory,
      identifier: action.identifier, // Same as 'transactionIdentifier' on 'refundPartialDetail'.
      affiliation: action.affiliation as string,
      tax: action.tax as string,
      shippingCost: action.shippingCost as string,
      total: total || 0,
    });
  }

  public removeProduct(properties: Product): void {
    // TODO: Fix this implementation so its not identical to addProduct
    this.addProduct(properties);
  }

  public lifecycle(properties: App): void {
    Leanplum.track(properties.eventAction, {
      appId: this.appId,
      lifecycle: properties.lifecycle,
    });
  }
}
