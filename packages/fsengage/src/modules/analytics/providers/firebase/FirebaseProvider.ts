// tslint:disable-next-line:no-implicit-dependencies
import firebase, { ReactNativeFirebase } from '@react-native-firebase/app';
// tslint:disable-next-line:no-implicit-dependencies
import analytics from '@react-native-firebase/analytics';
import AnalyticsProviderConfiguration from '../types/AnalyticsProviderConfiguration';

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

import Decimal from 'decimal.js';
// tslint:disable-next-line:no-implicit-dependencies
import {noop} from 'lodash-es';

export interface FirebaseAnalyticsProviderConfiguration {
  appId: string;
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId: string;
}

export default class FirebaseAnalyticsProvider extends AnalyticsProvider {
  configuration: FirebaseAnalyticsProviderConfiguration;
  client: ReactNativeFirebase.Module;

  constructor(commonConfiguration: AnalyticsProviderConfiguration,
              configuration: FirebaseAnalyticsProviderConfiguration) {
    super(commonConfiguration);
    this.configuration = configuration;
    this.client = firebase;
  }

  async asyncInit(): Promise<void> {
    this.client.initializeApp(this.configuration);
  }

  addProduct(properties: Product): void {
    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      number: properties.number
    }).catch(noop);
  }

  checkout(properties: Checkout, action: CheckoutAction): void {
    properties.products.forEach(product => {
      analytics().logEvent(properties.eventAction, {
        component: properties.eventCategory,
        identifier: product.identifier,
        name: product.name,
        brand: product.brand,
        category: product.category,
        variant: product.variant,
        price: product.price,
        quantity: product.quantity,
        index: product.index,
        step: action.step,
        ...this._transformCouponsArray(product.coupons)
      }).catch(noop);
    });
  }

  checkoutOption(properties: Generics, action: CheckoutAction): void {
    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      step: action.step,
      option: action.option
    }).catch(noop);
  }

  clickGeneric(properties: ClickGeneric): void {
    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      index: properties.index
    }).catch(noop);
  }

  clickProduct(properties: Product, action?: ProductAction): void {
    analytics().logEvent(properties.eventAction, {
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
    }).catch(noop);
  }

  clickPromotion(properties: Promotion): void {
    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      creative: properties.creative,
      slot: properties.slot
    }).catch(noop);
  }

  contactCall(properties: ContactCall): void {
    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      number: properties.number
    }).catch(noop);
  }

  contactEmail(properties: ContactEmail): void {
    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      to: properties.to
    }).catch(noop);
  }

  detailProduct(properties: Product, action?: ProductAction): void {
    analytics().logEvent(properties.eventAction, {
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
    }).catch(noop);
  }

  impressionGeneric(properties: ImpressionGeneric): void {
    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      index: properties.index
    }).catch(noop);
  }

  impressionProduct(properties: ImpressionProduct): void {
    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      brand: properties.brand,
      category: properties.category,
      list: properties.list,
      variant: properties.variant,
      price: properties.price,
      index: properties.index
    }).catch(noop);
  }

  impressionPromotion(properties: Promotion): void {
    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      name: properties.name,
      creative: properties.creative,
      slot: properties.slot
    }).catch(noop);
  }

  lifecycle(properties: App): void {
    analytics().logEvent(properties.eventAction, {
      appId: this.appId,
      lifecycle: properties.lifecycle
    }).catch(noop);
  }

  locationDirections(properties: LocationDirections): void {
    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      identifier: properties.identifier,
      address: properties.address
    }).catch(noop);
  }

  pageview(properties: Screenview): void {
    // do nothing
  }

  purchase(properties: Transaction, action: TransactionAction): void {
    properties.products.forEach(product => {
      analytics().logEvent(properties.eventAction, {
        component: properties.eventCategory,
        identifier: product.identifier,
        name: product.name,
        brand: product.brand,
        category: product.category,
        variant: product.variant,
        price: product.price,
        quantity: product.quantity,
        index: product.index,
        step: action.step,
        ...this._transformCouponsArray(product.coupons)
      }).catch(noop);
    });

    const total = action.revenue && new Decimal(action.revenue).toNumber();

    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      identifier: action.identifier,
      affiliation: action.affiliation,
      tax: action.tax,
      total: total || 0,
      shippingCost: action.shippingCost,
      ...this._transformCouponsArray(action.coupons)
    }).catch(noop);
  }

  refundAll(properties: Generics, action: TransactionAction): void {
    const total = action.revenue && new Decimal(action.revenue).toNumber();

    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      identifier: action.identifier,
      affiliation: action.affiliation,
      tax: action.tax,
      total: total || 0,
      shippingCost: action.shippingCost,
      ...this._transformCouponsArray(action.coupons)
    }).catch(noop);
  }

  refundPartial(properties: TransactionRefund, action: TransactionAction): void {
    properties.products.forEach(product => {
      analytics().logEvent(properties.eventAction, {
        component: properties.eventCategory,
        identifier: product.identifier,
        transactionIdentifier: action.identifier,
        price: product.price,
        quantity: product.quantity,
        ...this._transformCouponsArray(product.coupons)
      }).catch(noop);
    });
  }

  removeProduct(properties: Product): void {
    analytics().logEvent(properties.eventAction, {
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
    }).catch(noop);
  }

  screenview(properties: Screenview): void {
    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      appId: this.appId,
      appInstallerId: this.appInstallerId,
      appName: this.appName,
      appVersion: this.appVersion
    }).catch(noop);
  }

  searchGeneric(properties: SearchGeneric): void {
    analytics().logEvent(properties.eventAction, {
      component: properties.eventCategory,
      term: properties.term,
      count: properties.count
    }).catch(noop);
  }

  private _transformCouponsArray(coupons: string[] = []): { [key: string]: string } {
    // tslint:disable-next-line:no-inferred-empty-object-type
    return coupons.reduce((coupons: any, coupon) => {
      const couponCount = Object.keys(coupons).length;

      coupons[`coupon${couponCount + 1}`] = coupon;

      return coupons;
    }, {});
  }
}

