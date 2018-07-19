import Leanplum from '@brandingbrand/react-native-leanplum';
import Decimal from 'decimal.js';

import AnalyticsProvider, {
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
  TransactionRefund
} from '../AnalyticsProvider';

import AnalyticsProviderConfiguration from '../types/AnalyticsProviderConfiguration';

export interface LeanplumProviderConfiguration {
  appId: string;
  key: string;
  monetizationEventName?: string;
}

export default class LeanplumProvider extends AnalyticsProvider {
  client: Leanplum;
  monetizationEventName: string;

  constructor(commonConfiguration: AnalyticsProviderConfiguration,
              configuration: LeanplumProviderConfiguration) {
    super(commonConfiguration);

    // Leanplum accepts by default 'Purchase' as event name for revenue metrics. Confirm with
    // the client if they are using the default or a custom one.
    // Reference: https://www.leanplum.com/docs/ios/events#tracking-purchase-or-monetization-events
    this.monetizationEventName = configuration.monetizationEventName || 'Purchase';

    this.client = new Leanplum(configuration.appId, configuration.key);
    this.client.start();

    // TODO: Enable 'trackAllAppScreens'
  }

  // Commerce Functions

  contactCall(properties: ContactCall): void {
    this.client.track(properties.eventAction, undefined, undefined, {
      component: properties.eventCategory,
      number: properties.number
    });
  }

  contactEmail(properties: ContactEmail): void {
    this.client.track(properties.eventAction, undefined, undefined, {
      component: properties.eventCategory,
      to: properties.to
    });
  }

  clickGeneric(properties: ClickGeneric): void {
    this.client.track(properties.eventAction, undefined, undefined, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      index: properties.index
    });
  }

  impressionGeneric(properties: ImpressionGeneric): void {
    // TODO: Fix this implementation so its not identical to click
    return this.clickGeneric(properties);
  }

  locationDirections(properties: LocationDirections): void {
    this.client.track(properties.eventAction, undefined, undefined, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      address: properties.address
    });
  }

  pageview(properties: Screenview): void {
    // Not supported since we are only targeting native environment.
  }

  screenview(properties: Screenview): void {
    this.client.track('ScreenView', undefined, undefined, {
      component: properties.eventCategory,
      appId: this.appId,
      appInstallerId: this.appInstallerId,
      appName: this.appName,
      appVersion: this.appVersion
    });
  }

  searchGeneric(properties: SearchGeneric): void {
    this.client.track(properties.eventAction, undefined, undefined, {
      component: properties.eventCategory,
      term: properties.term,
      count: properties.count
    });
  }

  // Enhanced Commerce Functions

  addProduct(properties: Product): void {
    this.client.track(properties.eventAction, undefined, undefined, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      brand: properties.brand,
      category: properties.category,
      variant: properties.variant,
      price: properties.price,
      quantity: properties.quantity,
      index: properties.index,
      ...this._transformCouponsArray(properties.coupons)
    });
  }

  checkout(properties: Checkout, action: CheckoutAction): void {
    // Instead of attaching all products to one payload, I am sending them in separate ones to
    // support unlimited number of products. Leanplum only accepts 200 keys, which with the current
    // number of properties been tracked will mean just around 20 products.
    // Reference: https://www.leanplum.com/docs/ios/events#tracking-an-event
    properties.products.forEach(product => {
      this.client.track(properties.eventAction, undefined, undefined, {
        component: properties.eventCategory,
        identifier: product.identifier,
        name: product.name,
        brand: product.brand,
        category: product.category,
        variant: product.variant,
        price: product.price,
        quantity: product.quantity,
        index: product.index,
        step: action.step, // Checkout step.
        ...this._transformCouponsArray(product.coupons)
      });
    });

    // Leanplum does not accept nested structures. So a separate event it is been sent for tracking
    // the checkout option, which do not need to be attached to every single product on the
    // checkout.
    this.client.track('checkoutOption', undefined, undefined, {
      component: properties.eventCategory,
      step: action.step,
      option: action.option
    });
  }

  checkoutOption(properties: Generics, action: CheckoutAction): void {
    this.client.track(properties.eventAction, undefined, undefined, {
      component: properties.eventCategory,
      step: action.step,
      option: action.option
    });
  }

  clickProduct(properties: Product, action?: ProductAction): void {
    this.client.track(properties.eventAction, undefined, undefined, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      brand: properties.brand,
      category: properties.category,
      list: action && action.list,
      variant: properties.variant,
      price: properties.price,
      quantity: properties.quantity,
      index: properties.index,
      ...this._transformCouponsArray(properties.coupons)
    });
  }

  clickPromotion(properties: Promotion): void {
    this.client.track(properties.eventAction, undefined, undefined, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      creative: properties.creative,
      slot: properties.slot
    });
  }

  impressionProduct(properties: ImpressionProduct): void {
    this.client.track(properties.eventAction, undefined, undefined, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      brand: properties.brand,
      category: properties.category,
      list: properties.list,
      variant: properties.variant,
      price: properties.price,
      index: properties.index
    });
  }

  impressionPromotion(properties: Promotion): void {
    // TODO: Fix this implementation so its not identical to clickPromotion
    return this.clickPromotion(properties);
  }

  detailProduct(properties: Product, action?: ProductAction): void {
    // TODO: Fix this implementation so its not identical to clickProduct
    return this.clickProduct(properties);
  }

  purchase(properties: Transaction, action: TransactionAction): void {
    // Instead of attaching all products to one payload, I am sending them in separate ones to
    // support unlimited number of products. Leanplum only accepts 200 keys, which with the current
    // number of properties been tracked will mean just around 20 products.
    // Reference: https://www.leanplum.com/docs/ios/events#tracking-an-event
    properties.products.forEach(product => {
      this.client.track('purchaseDetail', undefined, undefined, {
        component: properties.eventCategory,
        identifier: product.identifier,
        transactionIdentifier: action.identifier, // Same as 'identifier' on 'purchase' event.
        name: product.name,
        brand: product.brand,
        category: product.category,
        variant: product.variant,
        price: product.price,
        quantity: product.quantity,
        index: product.index,
        ...this._transformCouponsArray(product.coupons)
      });
    });

    const total = action.revenue && new Decimal(action.revenue).toNumber();

    this.client.track(this.monetizationEventName, total || 0, undefined, {
      component: properties.eventCategory,
      identifier: action.identifier, // Same as 'transactionIdentifier' on 'purchaseDetail' event.
      affiliation: action.affiliation,
      tax: action.tax,
      shippingCost: action.shippingCost,
      ...this._transformCouponsArray(action.coupons)
    });
  }

  refundAll(properties: Generics, action: TransactionAction): void {
    const total = action.revenue && new Decimal(action.revenue).toNumber();

    this.client.track(properties.eventAction, total || 0, undefined, {
      component: properties.eventCategory,
      identifier: action.identifier,
      affiliation: action.affiliation,
      tax: action.tax,
      shippingCost: action.shippingCost,
      ...this._transformCouponsArray(action.coupons)
    });
  }

  refundPartial(properties: TransactionRefund, action: TransactionAction): void {
    // Instead of attaching all products to one payload, I am sending them in separate ones to
    // support unlimited number of products. Leanplum only accepts 200 keys, which with the current
    // number of properties been tracked will mean just around 20 products.
    // Reference: https://www.leanplum.com/docs/ios/events#tracking-an-event
    properties.products.forEach(product => {
      this.client.track('refundPartialDetail', undefined, undefined, {
        component: properties.eventCategory,
        identifier: product.identifier,
        transactionIdentifier: action.identifier, // Same as 'identifier' on 'refundPartial' event.
        price: product.price,
        quantity: product.quantity,
        ...this._transformCouponsArray(product.coupons)
      });
    });

    const total = action.revenue && new Decimal(action.revenue).toNumber();

    this.client.track(properties.eventAction, total || 0, undefined, {
      component: properties.eventCategory,
      identifier: action.identifier, // Same as 'transactionIdentifier' on 'refundPartialDetail'.
      affiliation: action.affiliation,
      tax: action.tax,
      shippingCost: action.shippingCost,
      ...this._transformCouponsArray(action.coupons)
    });
  }

  removeProduct(properties: Product): void {
    // TODO: Fix this implementation so its not identical to addProduct
    return this.addProduct(properties);
  }

  // App Lifecycle Functions

  lifecycle(properties: App): void {
    this.client.track(properties.eventAction, undefined, undefined, {
      appId: this.appId,
      lifecycle: properties.lifecycle
    });
  }

  // Helper Functions

  private _transformCouponsArray(coupons: string[] = []): { [key: string]: string } {
    // tslint:disable-next-line:no-inferred-empty-object-type
    return coupons.reduce((coupons: any, coupon) => {
      const couponCount = Object.keys(coupons).length;

      coupons[`coupon${couponCount + 1}`] = coupon;

      return coupons;
    }, {});
  }
}
