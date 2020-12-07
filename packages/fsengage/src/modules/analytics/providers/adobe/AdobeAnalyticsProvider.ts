import AnalyticsProvider, * as Events from '../AnalyticsProvider';
import Decimal from 'decimal.js';
import {
  ACPCore,
  ACPIdentity,
  ACPLifecycle,
  ACPMobileLogLevel,
  ACPSignal
} from '@adobe/react-native-acpcore';
import { ACPAnalytics } from '@adobe/react-native-acpanalytics';

type AnalyticsProviderConfiguration = import ('../types/AnalyticsProviderConfiguration').default;
type Dictionary<T = any> = import ('@brandingbrand/fsfoundation').Dictionary<T>;
type Arguments<F> = import ('@brandingbrand/fsfoundation').Arguments<F>;

export interface AdobeAnalyticsClient {
  configureWithAppId: (appId?: string) => void;
  lifecycleStart: (additionalContextData?: Dictionary) => void;
  setLogLevel: (mode: string) => void;
  start: () => Promise<boolean>;
  trackState: (state: string, contextData?: Dictionary) => void;
  trackAction: (action: string, contextData?: Dictionary) => void;
}

type GenericProduct = Events.ImpressionProduct |
  Events.Product |
  Events.RefundProduct |
  Events.TransactionProduct;
type ProviderMethods = Exclude<keyof AdobeAnalyticsProvider, 'lifecycle'>;
type DisabledEvents = { [key in ProviderMethods]?: boolean };
type EventNormalizers = {
  [key in ProviderMethods]?: (...args: Arguments<AdobeAnalyticsProvider[key]>) => ContextData;
};

interface ContextData extends Dictionary<string> {
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
    const serialized = products.map(product => AdobeAnalyticsProvider.serializeProduct(product));
    return serialized.join(',');
  }

  public static serializeProduct(product: GenericProduct): string {
    const { category = '', identifier = '', quantity = '0', price = '0' } = product;

    const unitPrice = price instanceof Decimal ? price : new Decimal(price);
    const qty = new Decimal(quantity);
    const totalPrice = unitPrice.times(qty).toString();

    return [category, identifier, quantity, totalPrice].join(';');
  }

  protected disabledEvents: DisabledEvents;
  protected normalizers: EventNormalizers;
  protected client: AdobeAnalyticsClient;
  constructor(
    commonConfiguration: AnalyticsProviderConfiguration,
    config: AdobeAnalyticsConfig
  ) {
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
    this.client.start().catch(err => console.log('ACPCore start error: ', err));
    this.disabledEvents = config.disabledEvents || {};
    this.normalizers = config.eventNormalizers || {};
  }

  async asyncInit(): Promise<void> {
    // Do nothing
  }

  clickGeneric(properties: Events.ClickGeneric): void {
    if (this.disabledEvents.clickGeneric) {
      return;
    }

    if (!this.normalizers.clickGeneric) {
      return this.genericAction(properties);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.clickGeneric(properties);
    this.client[hitType](hitName, contextData);
  }

  contactCall(properties: Events.ContactCall): void {
    if (this.disabledEvents.contactCall) {
      return;
    }

    if (!this.normalizers.contactCall) {
      return this.genericAction(properties);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.contactCall(properties);
    this.client[hitType](hitName, contextData);
  }

  contactEmail(properties: Events.ContactEmail): void {
    if (this.disabledEvents.contactEmail) {
      return;
    }

    if (!this.normalizers.contactEmail) {
      return this.genericAction(properties);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.contactEmail(properties);
    this.client[hitType](hitName, contextData);
  }

  impressionGeneric(properties: Events.ImpressionGeneric): void {
    if (this.disabledEvents.impressionGeneric) {
      return;
    }

    if (!this.normalizers.impressionGeneric) {
      return this.genericState(properties);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.impressionGeneric(properties);
    this.client[hitType](hitName, contextData);
  }

  locationDirections(properties: Events.LocationDirections): void {
    if (this.disabledEvents.locationDirections) {
      return;
    }

    if (!this.normalizers.locationDirections) {
      return this.genericAction(properties);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.locationDirections(properties);
    this.client[hitType](hitName, contextData);
  }

  pageview(properties: Events.Screenview): void {
    if (this.disabledEvents.pageview) {
      return;
    }

    if (!this.normalizers.pageview) {
      return this.genericState({ ...properties, eventAction: ''});
    }

    const { hitName, hitType, ...contextData } = this.normalizers.pageview(properties);
    this.client[hitType](hitName, contextData);
  }

  screenview(properties: Events.Screenview): void {
    if (this.disabledEvents.screenview) {
      return;
    }

    if (!this.normalizers.screenview) {
      return this.genericState({ ...properties, eventAction: ''});
    }

    const { hitName, hitType, ...contextData } = this.normalizers.screenview(properties);
    this.client[hitType](hitName, contextData);
  }

  searchGeneric(properties: Events.SearchGeneric): void {
    if (this.disabledEvents.searchGeneric) {
      return;
    }

    if (!this.normalizers.searchGeneric) {
      return this.genericAction(properties);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.searchGeneric(properties);
    this.client[hitType](hitName, contextData);
  }

  addProduct(properties: Events.Product): void {
    if (this.disabledEvents.addProduct) {
      return;
    }

    if (!this.normalizers.addProduct) {
      const actionName = 'addToCart';
      const contextData = {
        '&&events': 'scAdd',
        '&&products': AdobeAnalyticsProvider.serializeProduct(properties)
      };

      return this.client.trackAction(actionName, contextData);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.addProduct(properties);
    this.client[hitType](hitName, contextData);
  }

  checkout(properties: Events.Checkout, action: Events.CheckoutAction): void {
    if (this.disabledEvents.checkout) {
      return;
    }

    if (!this.normalizers.checkout) {
      const { eventCategory } = properties;
      const actionName = this.generateActionName(eventCategory);
      const contextData = {
        '&&events': 'scCheckout',
        '&&products': AdobeAnalyticsProvider.serializeProducts(properties.products)
      };

      return this.client.trackState(actionName, contextData);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.checkout(properties, action);
    this.client[hitType](hitName, contextData);
  }

  checkoutOption(properties: Events.Generics, action: Events.CheckoutAction): void {
    if (this.disabledEvents.checkoutOption) {
      return;
    }

    if (!this.normalizers.checkoutOption) {
      return this.genericState(properties);
    }

    const { hitName, hitType, ...ctxData } = this.normalizers.checkoutOption(properties, action);
    this.client[hitType](hitName, ctxData);
  }

  clickProduct(properties: Events.Product, action?: Events.ProductAction): void {
    if (this.disabledEvents.clickProduct) {
      return;
    }

    if (!this.normalizers.clickProduct) {
      const { eventCategory, eventAction } = properties;
      const actionName = this.generateActionName(eventCategory, eventAction);
      const contextData = {
        '&&products': AdobeAnalyticsProvider.serializeProduct(properties)
      };

      return this.client.trackAction(actionName, contextData);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.clickProduct(properties, action);
    this.client[hitType](hitName, contextData);
  }

  clickPromotion(properties: Events.Promotion): void {
    if (this.disabledEvents.clickPromotion) {
      return;
    }

    if (!this.normalizers.clickPromotion) {
      return this.genericAction(properties);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.clickPromotion(properties);
    this.client[hitType](hitName, contextData);
  }

  impressionProduct(properties: Events.ImpressionProduct): void {
    if (this.disabledEvents.impressionProduct) {
      return;
    }

    if (!this.normalizers.impressionProduct) {
      return this.genericState(properties);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.impressionProduct(properties);
    this.client[hitType](hitName, contextData);
  }

  impressionPromotion(properties: Events.Promotion): void {
    if (this.disabledEvents.impressionPromotion) {
      return;
    }

    if (!this.normalizers.impressionPromotion) {
      return this.genericState(properties);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.impressionPromotion(properties);
    this.client[hitType](hitName, contextData);
  }

  detailProduct(properties: Events.Product, action?: Events.ProductAction): void {
    if (this.disabledEvents.detailProduct) {
      return;
    }

    if (!this.normalizers.detailProduct) {
      const { eventCategory } = properties;
      const actionName = this.generateActionName(eventCategory);
      const contextData = {
        '&&events': 'prodView',
        '&&products': AdobeAnalyticsProvider.serializeProduct(properties)
      };

      return this.client.trackState(actionName, contextData);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.detailProduct(properties, action);
    this.client[hitType](hitName, contextData);
  }

  purchase(properties: Events.Transaction, action: Events.TransactionAction): void {
    if (this.disabledEvents.purchase) {
      return;
    }

    if (!this.normalizers.purchase) {
      const contextData = {
        '&&events': 'purchase',
        '&&products': AdobeAnalyticsProvider.serializeProducts(properties.products),
        purchaseId: action.identifier
      };

      return this.client.trackAction('purchase', contextData);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.purchase(properties, action);
    this.client[hitType](hitName, contextData);
  }

  refundAll(properties: Events.Generics, action: Events.TransactionAction): void {
    if (this.disabledEvents.refundAll) {
      return;
    }

    if (!this.normalizers.refundAll) {
      return this.genericAction(properties);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.refundAll(properties, action);
    this.client[hitType](hitName, contextData);
  }

  refundPartial(properties: Events.TransactionRefund, action: Events.TransactionAction): void {
    if (this.disabledEvents.refundPartial) {
      return;
    }

    if (!this.normalizers.refundPartial) {
      return this.genericAction(properties);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.refundPartial(properties, action);
    this.client[hitType](hitName, contextData);
  }

  removeProduct(properties: Events.Product): void {
    if (this.disabledEvents.removeProduct) {
      return;
    }

    if (!this.normalizers.removeProduct) {
      const actionName = 'removeFromCart';
      const contextData = {
        '&&events': 'scRemove',
        '&&products': AdobeAnalyticsProvider.serializeProduct(properties)
      };

      return this.client.trackAction(actionName, contextData);
    }

    const { hitName, hitType, ...contextData } = this.normalizers.removeProduct(properties);
    this.client[hitType](hitName, contextData);
  }

  lifecycle(properties: Events.App): void { /** noop - Adobe SDK captures this already */}

  protected genericAction(properties: Events.Generics): void {
    const { eventCategory, eventAction } = properties;
    const actionName = this.generateActionName(eventCategory, eventAction);
    this.client.trackAction(actionName);
  }

  protected genericState(properties: Events.Generics): void {
    const { eventCategory } = properties;
    const actionName = this.generateActionName(eventCategory);
    this.client.trackState(actionName);
  }

  protected generateActionName(eventCategory: string, eventAction: string = ''): string {
    return !eventAction ? eventCategory : [eventAction, eventCategory].join(' ');
  }
}
