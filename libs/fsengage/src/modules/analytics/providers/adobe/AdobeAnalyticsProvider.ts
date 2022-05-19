// @ts-expect-error
import { ACPAnalytics } from '@adobe/react-native-acpanalytics';
import {
  ACPCore,
  ACPIdentity,
  ACPLifecycle,
  ACPMobileLogLevel,
  ACPSignal,
  // @ts-expect-error
} from '@adobe/react-native-acpcore';
import Decimal from 'decimal.js';

import type * as Events from '../AnalyticsProvider';
import AnalyticsProvider from '../AnalyticsProvider';

type AnalyticsProviderConfiguration = import('../types/AnalyticsProviderConfiguration').default;

export interface AdobeAnalyticsClient {
  configureWithAppId: (appId?: string) => void;
  lifecycleStart: (additionalContextData?: Record<string, unknown>) => void;
  setLogLevel: (mode: string) => void;
  start: () => Promise<boolean>;
  trackState: (state: string, contextData?: Record<string, unknown>) => void;
  trackAction: (action: string, contextData?: Record<string, unknown>) => void;
}

type GenericProduct =
  | Events.ImpressionProduct
  | Events.Product
  | Events.RefundProduct
  | Events.TransactionProduct;
type ProviderMethods = Exclude<keyof AdobeAnalyticsProvider, 'lifecycle'>;
type DisabledEvents = { [key in ProviderMethods]?: boolean };
type EventNormalizers = {
  [key in ProviderMethods]?: (...args: Parameters<AdobeAnalyticsProvider[key]>) => ContextData;
};

interface ContextData extends Record<string, string> {
  hitName: string;
  hitType: 'trackAction' | 'trackState';
}

export interface AdobeAnalyticsConfig {
  appId: string;
  debug?: boolean;
  eventNormalizers?: EventNormalizers;
  disabledEvents?: DisabledEvents;
}

export class AdobeAnalyticsProvider extends AnalyticsProvider {
  public static serializeProducts(products: GenericProduct[]): string {
    const serialized = products.map((product) => AdobeAnalyticsProvider.serializeProduct(product));
    return serialized.join(',');
  }

  public static serializeProduct(product: GenericProduct): string {
    const { category = '', identifier = '', price = '0', quantity = '0' } = product;

    const unitPrice = price instanceof Decimal ? price : new Decimal(price);
    const qty = new Decimal(quantity);
    const totalPrice = unitPrice.times(qty).toString();

    return [category, identifier, quantity, totalPrice].join(';');
  }

  constructor(commonConfiguration: AnalyticsProviderConfiguration, config: AdobeAnalyticsConfig) {
    super(commonConfiguration);
    this.client = ACPCore;
    if (config.debug) {
      this.client.setLogLevel(ACPMobileLogLevel.DEBUG);
    }
    this.client.configureWithAppId(config.appId);
    ACPLifecycle.registerExtension();
    ACPIdentity.registerExtension();
    ACPSignal.registerExtension();
    ACPAnalytics.registerExtension();
    this.client.lifecycleStart();
    this.client.start().catch((error) => {
      console.log('ACPCore start error:', error);
    });
    this.disabledEvents = config.disabledEvents || {};
    this.normalizers = config.eventNormalizers || {};
  }

  protected disabledEvents: DisabledEvents;
  protected normalizers: EventNormalizers;
  protected client: AdobeAnalyticsClient;

  protected genericAction(properties: Events.Generics): void {
    const { eventAction, eventCategory } = properties;
    const actionName = this.generateActionName(eventCategory, eventAction);
    this.client.trackAction(actionName);
  }

  protected genericState(properties: Events.Generics): void {
    const { eventCategory } = properties;
    const actionName = this.generateActionName(eventCategory);
    this.client.trackState(actionName);
  }

  protected generateActionName(eventCategory: string, eventAction = ''): string {
    return !eventAction ? eventCategory : [eventAction, eventCategory].join(' ');
  }

  public async asyncInit(): Promise<void> {
    // Do nothing
  }

  public clickGeneric(properties: Events.ClickGeneric): void {
    if (this.disabledEvents.clickGeneric) {
      return;
    }

    if (!this.normalizers.clickGeneric) {
      this.genericAction(properties);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.clickGeneric(properties);
    this.client[hitType](hitName, contextData);
  }

  public contactCall(properties: Events.ContactCall): void {
    if (this.disabledEvents.contactCall) {
      return;
    }

    if (!this.normalizers.contactCall) {
      this.genericAction(properties);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.contactCall(properties);
    this.client[hitType](hitName, contextData);
  }

  public contactEmail(properties: Events.ContactEmail): void {
    if (this.disabledEvents.contactEmail) {
      return;
    }

    if (!this.normalizers.contactEmail) {
      this.genericAction(properties);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.contactEmail(properties);
    this.client[hitType](hitName, contextData);
  }

  public impressionGeneric(properties: Events.ImpressionGeneric): void {
    if (this.disabledEvents.impressionGeneric) {
      return;
    }

    if (!this.normalizers.impressionGeneric) {
      this.genericState(properties);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.impressionGeneric(properties);
    this.client[hitType](hitName, contextData);
  }

  public locationDirections(properties: Events.LocationDirections): void {
    if (this.disabledEvents.locationDirections) {
      return;
    }

    if (!this.normalizers.locationDirections) {
      this.genericAction(properties);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.locationDirections(properties);
    this.client[hitType](hitName, contextData);
  }

  public pageview(properties: Events.Screenview): void {
    if (this.disabledEvents.pageview) {
      return;
    }

    if (!this.normalizers.pageview) {
      this.genericState({ ...properties, eventAction: '' });
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.pageview(properties);
    this.client[hitType](hitName, contextData);
  }

  public screenview(properties: Events.Screenview): void {
    if (this.disabledEvents.screenview) {
      return;
    }

    if (!this.normalizers.screenview) {
      this.genericState({ ...properties, eventAction: '' });
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.screenview(properties);
    this.client[hitType](hitName, contextData);
  }

  public searchGeneric(properties: Events.SearchGeneric): void {
    if (this.disabledEvents.searchGeneric) {
      return;
    }

    if (!this.normalizers.searchGeneric) {
      this.genericAction(properties);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.searchGeneric(properties);
    this.client[hitType](hitName, contextData);
  }

  public addProduct(properties: Events.Product): void {
    if (this.disabledEvents.addProduct) {
      return;
    }

    if (!this.normalizers.addProduct) {
      const actionName = 'addToCart';
      const contextData = {
        '&&events': 'scAdd',
        '&&products': AdobeAnalyticsProvider.serializeProduct(properties),
      };

      this.client.trackAction(actionName, contextData);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.addProduct(properties);
    this.client[hitType](hitName, contextData);
  }

  public checkout(properties: Events.Checkout, action: Events.CheckoutAction): void {
    if (this.disabledEvents.checkout) {
      return;
    }

    if (!this.normalizers.checkout) {
      const { eventCategory } = properties;
      const actionName = this.generateActionName(eventCategory);
      const contextData = {
        '&&events': 'scCheckout',
        '&&products': AdobeAnalyticsProvider.serializeProducts(properties.products),
      };

      this.client.trackState(actionName, contextData);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.checkout(properties, action);
    this.client[hitType](hitName, contextData);
  }

  public checkoutOption(properties: Events.Generics, action: Events.CheckoutAction): void {
    if (this.disabledEvents.checkoutOption) {
      return;
    }

    if (!this.normalizers.checkoutOption) {
      this.genericState(properties);
      return;
    }

    const { hitName, hitType, ...ctxData } = this.normalizers.checkoutOption(properties, action);
    this.client[hitType](hitName, ctxData);
  }

  public clickProduct(properties: Events.Product, action?: Events.ProductAction): void {
    if (this.disabledEvents.clickProduct) {
      return;
    }

    if (!this.normalizers.clickProduct) {
      const { eventAction, eventCategory } = properties;
      const actionName = this.generateActionName(eventCategory, eventAction);
      const contextData = {
        '&&products': AdobeAnalyticsProvider.serializeProduct(properties),
      };

      this.client.trackAction(actionName, contextData);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.clickProduct(properties, action);
    this.client[hitType](hitName, contextData);
  }

  public clickPromotion(properties: Events.Promotion): void {
    if (this.disabledEvents.clickPromotion) {
      return;
    }

    if (!this.normalizers.clickPromotion) {
      this.genericAction(properties);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.clickPromotion(properties);
    this.client[hitType](hitName, contextData);
  }

  public impressionProduct(properties: Events.ImpressionProduct): void {
    if (this.disabledEvents.impressionProduct) {
      return;
    }

    if (!this.normalizers.impressionProduct) {
      this.genericState(properties);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.impressionProduct(properties);
    this.client[hitType](hitName, contextData);
  }

  public impressionPromotion(properties: Events.Promotion): void {
    if (this.disabledEvents.impressionPromotion) {
      return;
    }

    if (!this.normalizers.impressionPromotion) {
      this.genericState(properties);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.impressionPromotion(properties);
    this.client[hitType](hitName, contextData);
  }

  public detailProduct(properties: Events.Product, action?: Events.ProductAction): void {
    if (this.disabledEvents.detailProduct) {
      return;
    }

    if (!this.normalizers.detailProduct) {
      const { eventCategory } = properties;
      const actionName = this.generateActionName(eventCategory);
      const contextData = {
        '&&events': 'prodView',
        '&&products': AdobeAnalyticsProvider.serializeProduct(properties),
      };

      this.client.trackState(actionName, contextData);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.detailProduct(properties, action);
    this.client[hitType](hitName, contextData);
  }

  public purchase(properties: Events.Transaction, action: Events.TransactionAction): void {
    if (this.disabledEvents.purchase) {
      return;
    }

    if (!this.normalizers.purchase) {
      const contextData = {
        '&&events': 'purchase',
        '&&products': AdobeAnalyticsProvider.serializeProducts(properties.products),
        'purchaseId': action.identifier,
      };

      this.client.trackAction('purchase', contextData);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.purchase(properties, action);
    this.client[hitType](hitName, contextData);
  }

  public refundAll(properties: Events.Generics, action: Events.TransactionAction): void {
    if (this.disabledEvents.refundAll) {
      return;
    }

    if (!this.normalizers.refundAll) {
      this.genericAction(properties);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.refundAll(properties, action);
    this.client[hitType](hitName, contextData);
  }

  public refundPartial(
    properties: Events.TransactionRefund,
    action: Events.TransactionAction
  ): void {
    if (this.disabledEvents.refundPartial) {
      return;
    }

    if (!this.normalizers.refundPartial) {
      this.genericAction(properties);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.refundPartial(properties, action);
    this.client[hitType](hitName, contextData);
  }

  public removeProduct(properties: Events.Product): void {
    if (this.disabledEvents.removeProduct) {
      return;
    }

    if (!this.normalizers.removeProduct) {
      const actionName = 'removeFromCart';
      const contextData = {
        '&&events': 'scRemove',
        '&&products': AdobeAnalyticsProvider.serializeProduct(properties),
      };

      this.client.trackAction(actionName, contextData);
      return;
    }

    const { hitName, hitType, ...contextData } = this.normalizers.removeProduct(properties);
    this.client[hitType](hitName, contextData);
  }

  public lifecycle(properties: Events.App): void {
    /** noop - Adobe SDK captures this already */
  }
}
