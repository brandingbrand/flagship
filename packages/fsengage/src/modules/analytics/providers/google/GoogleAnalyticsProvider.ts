import {
  Actions as GAActions,
  Analytics as GAClient,
  Hits as GAHits
  // @ts-ignore TODO: Update react-native-google-analytics to support typing
} from '@brandingbrand/react-native-google-analytics';
import FSNetwork from '@brandingbrand/fsnetwork';
import parseURL from 'url-parse';
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

export interface GoogleAnalyticsProviderConfiguration {
  trackerId: string;
  clientId?: string;
  trackerName?: string;
  cookieDomain?: string;
}

interface GoogleAnalyticsEventProperties {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface GoogleAnalyticsPageViewProperties {
  hostname: string | number | null;
  page: string | null;
  title: string;
}

interface GoogleAnalyticsScreenViewProperties {
  appId: string;
  appInstallerId?: string;
  appName: string;
  appVersion: string;
  screenName: string;
}

export default class GoogleAnalyticsProvider extends AnalyticsProvider {
  client: GAClient;

  constructor(commonConfiguration: AnalyticsProviderConfiguration,
              configuration: GoogleAnalyticsProviderConfiguration) {
    super(commonConfiguration);

    // TODO | BD: Check and filter optional fields.

    const network = new FSNetwork();

    this.client = new GAClient(
      configuration.trackerId,
      configuration.clientId || null,
      null,
      this.userAgent,
      // @ts-ignore TODO update react-native-google-analytics to not need the private instance
      network.instance
    );
  }

  // Commerce Functions

  contactCall(properties: ContactCall): void {
    this._sendEvent({
      action: properties.eventAction,
      category: properties.eventCategory,
      label: properties.number
    });
  }

  contactEmail(properties: ContactEmail): void {
    this._sendEvent({
      action: properties.eventAction,
      category: properties.eventCategory,
      label: properties.to
    });
  }

  clickGeneric(properties: ClickGeneric): void {
    this._sendEvent({
      action: properties.eventAction,
      category: properties.eventCategory,
      label: properties.identifier || properties.name,
      value: properties.index
    });
  }

  impressionGeneric(properties: ImpressionGeneric): void {
    // TODO: Fix this implementaiton so its not identical to click
    return this.clickGeneric(properties);
  }

  locationDirections(properties: LocationDirections): void {
    this._sendEvent({
      action: properties.eventAction,
      category: properties.eventCategory,
      label: properties.identifier || properties.address
    });
  }

  pageview(properties: Screenview): void {
    const parser = properties.url && parseURL(properties.url);

    this._sendPageView({
      hostname: parser && parser.host,
      page: parser && parser.pathname,
      title: properties.eventCategory
    });
  }

  screenview(properties: Screenview): void {
    this._sendScreenView({
      appId: this.appId,
      appInstallerId: this.appInstallerId,
      appName: this.appName,
      appVersion: this.appVersion,
      screenName: properties.eventCategory
    });
  }

  searchGeneric(properties: SearchGeneric): void {
    this._sendEvent({
      action: properties.eventAction,
      category: properties.eventCategory,
      label: properties.term,
      value: properties.count
    });
  }

  // Enhanced Commerce Functions

  addProduct(properties: Product): void {
    this._addProduct(properties);
    this.client.set(new GAActions.Add());
  }

  checkout(properties: Checkout, action: CheckoutAction): void {
    properties.products.forEach(product => this._addProduct(product));

    this.client.set(new GAActions.Checkout(
      action.step,
      action.option
    ));
  }

  checkoutOption(properties: Generics, action: CheckoutAction): void {
    this.client.set(new GAActions.CheckoutOption(action.step, action.option));
  }

  clickProduct(properties: Product, action?: ProductAction): void {
    this._addProduct(properties);
    this.client.set(new GAActions.Click(action && action.list));
  }

  clickPromotion(properties: Promotion): void {
    this.client.add(new GAHits.Promo(
      properties.identifier,
      properties.name,
      properties.creative,
      properties.slot
    ));

    this.client.set(new GAActions.PromoClick());
  }

  impressionProduct(properties: ImpressionProduct): void {
    this.client.add(new GAHits.Impression(
      properties.identifier,
      properties.name,
      properties.list,
      properties.brand,
      properties.category,
      properties.variant,
      properties.index,
      properties.price
    ));
  }

  impressionPromotion(properties: Promotion): void {
    this.client.add(new GAHits.Promo(
      properties.identifier,
      properties.name,
      properties.creative,
      properties.slot
    ));
  }

  detailProduct(properties: Product, action?: ProductAction): void {
    this._addProduct(properties);
    this.client.set(new GAActions.Detail(action && action.list));
  }

  purchase(properties: Transaction, action: TransactionAction): void {
    properties.products.forEach(product => this._addProduct(product));

    this.client.set(new GAActions.Purchase(
      action.identifier,
      action.affiliation,
      action.revenue,
      action.tax,
      action.shippingCost,
      action.coupons && action.coupons[0] // GA only supports one coupon
    ));
  }

  refundAll(properties: Generics, action: TransactionAction): void {
    this.client.set(new GAActions.Refund(action.identifier));
  }

  refundPartial(properties: TransactionRefund, action: TransactionAction): void {
    properties.products.forEach(product => {
      this.client.add(new GAHits.Product(
        product.identifier,
        null,
        null,
        null,
        null,
        null,
        null,
        product.quantity,
        null
      ));
    });

    this.client.set(new GAActions.Refund(action.identifier));
  }

  removeProduct(properties: Product): void {
    this._addProduct(properties);
    this.client.set(new GAActions.Remove());
  }

  // App Lifecycle Functions

  lifecycle(properties: App): void {
    this._sendEvent({
      action: this.appId,
      category: properties.eventAction,
      label: properties.lifecycle
    });
  }

  // Trigger Functions

  private _addProduct(properties: any): void {
    this.client.add(new GAHits.Product(
      properties.identifier,
      properties.name,
      properties.brand,
      properties.category,
      properties.variant,
      properties.coupons && properties.coupons[0], // GA only supports one coupon
      properties.price,
      properties.quantity,
      properties.index
    ));
  }

  private _sendEvent(properties: GoogleAnalyticsEventProperties): void {
    this.client.send(new GAHits.Event(
      properties.category,
      properties.action,
      properties.label,
      properties.value
    ));
  }

  private _sendPageView(properties: GoogleAnalyticsPageViewProperties): void {
    this.client.send(new GAHits.PageView(
      properties.hostname,
      properties.page,
      properties.title
    ));
  }

  private _sendScreenView(properties: GoogleAnalyticsScreenViewProperties): void {
    this.client.send(new GAHits.ScreenView(
      properties.appName,
      properties.screenName,
      properties.appVersion,
      properties.appId,
      properties.appInstallerId
    ));
  }
}
