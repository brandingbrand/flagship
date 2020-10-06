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
  trackerId: string | Promise<string>;
  clientId?: string | Promise<string>;
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

interface QueuedFunction {
  func: any;
  params: IArguments;
}

export default class GoogleAnalyticsProvider extends AnalyticsProvider {
  client?: GAClient;
  configuration: GoogleAnalyticsProviderConfiguration;
  queue: QueuedFunction[];

  constructor(commonConfiguration: AnalyticsProviderConfiguration,
              configuration: GoogleAnalyticsProviderConfiguration) {
    super(commonConfiguration);
    this.configuration = configuration;
    this.queue = [];
  }

  async asyncInit(): Promise<void> {
    // TODO | BD: Check and filter optional fields.

    const network = new FSNetwork();

    this.client = new GAClient(
      await this.configuration.trackerId,
      (await this.configuration.clientId) || null,
      null,
      this.userAgent,
      // @ts-ignore TODO update react-native-google-analytics to not need the private instance
      network.instance
    );

    while (this.queue.length) {
      const queued: QueuedFunction | undefined = this.queue.pop();
      if (queued) {
        queued.func.apply(this, queued.params);
      } else {
        break;
      }
    }
  }

  // Commerce Functions

  contactCall(properties: ContactCall): void {
    const extraData = this.extractExtraData(properties);

    this._sendEvent({
      action: properties.eventAction,
      category: properties.eventCategory,
      label: properties.number
    }, extraData);
  }

  contactEmail(properties: ContactEmail): void {
    const extraData = this.extractExtraData(properties);

    this._sendEvent({
      action: properties.eventAction,
      category: properties.eventCategory,
      label: properties.to
    }, extraData);
  }

  clickGeneric(properties: ClickGeneric): void {
    const extraData = this.extractExtraData(properties);

    this._sendEvent({
      action: properties.eventAction,
      category: properties.eventCategory,
      label: properties.identifier || properties.name,
      value: properties.index
    }, extraData);
  }

  impressionGeneric(properties: ImpressionGeneric): void {
    // TODO: Fix this implementaiton so its not identical to click
    return this.clickGeneric(properties);
  }

  locationDirections(properties: LocationDirections): void {
    const extraData = this.extractExtraData(properties);

    this._sendEvent({
      action: properties.eventAction,
      category: properties.eventCategory,
      label: properties.identifier || properties.address
    }, extraData);
  }

  pageview(properties: Screenview): void {
    const parser = properties.url && parseURL(properties.url);
    const extraData = this.extractExtraData(properties);

    this._sendPageView({
      hostname: parser && parser.host,
      page: parser && parser.pathname,
      title: properties.eventCategory
    }, extraData);
  }

  screenview(properties: Screenview): void {
    const extraData = this.extractExtraData(properties);

    this._sendScreenView({
      appId: this.appId,
      appInstallerId: this.appInstallerId,
      appName: this.appName,
      appVersion: this.appVersion,
      screenName: properties.eventCategory
    }, extraData);
  }

  searchGeneric(properties: SearchGeneric): void {
    const extraData = this.extractExtraData(properties);

    this._sendEvent({
      action: properties.eventAction,
      category: properties.eventCategory,
      label: properties.term,
      value: properties.count
    }, extraData);
  }

  // Enhanced Commerce Functions

  addProduct(properties: Product): void {
    this._addProduct(properties);
    if (this.client) {
      this.client.set(new GAActions.Add());
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this.addProduct,
        params: arguments
      });
    }
  }

  checkout(properties: Checkout, action: CheckoutAction): void {
    properties.products.forEach(product => this._addProduct(product));

    if (this.client) {
      this.client.set(new GAActions.Checkout(
        action.step,
        action.option
      ));
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this.checkout,
        params: arguments
      });
    }
  }

  checkoutOption(properties: Generics, action: CheckoutAction): void {
    if (this.client) {
      this.client.set(new GAActions.CheckoutOption(action.step, action.option));
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this.checkoutOption,
        params: arguments
      });
    }
  }

  clickProduct(properties: Product, action?: ProductAction): void {
    this._addProduct(properties);
    if (this.client) {
      this.client.set(new GAActions.Click(action && action.list));
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this.clickProduct,
        params: arguments
      });
    }
  }

  clickPromotion(properties: Promotion): void {
    if (this.client) {
      this.client.add(new GAHits.Promo(
        properties.identifier,
        properties.name,
        properties.creative,
        properties.slot
      ));

      this.client.set(new GAActions.PromoClick());
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this.clickPromotion,
        params: arguments
      });
    }
  }

  impressionProduct(properties: ImpressionProduct): void {
    if (this.client) {
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
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this.impressionProduct,
        params: arguments
      });
    }
  }

  impressionPromotion(properties: Promotion): void {
    if (this.client) {
      this.client.add(new GAHits.Promo(
        properties.identifier,
        properties.name,
        properties.creative,
        properties.slot
      ));
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this.impressionPromotion,
        params: arguments
      });
    }
  }

  detailProduct(properties: Product, action?: ProductAction): void {
    this._addProduct(properties);
    if (this.client) {
      this.client.set(new GAActions.Detail(action && action.list));
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this.detailProduct,
        params: arguments
      });
    }
  }

  purchase(properties: Transaction, action: TransactionAction): void {
    properties.products.forEach(product => this._addProduct(product));

    if (this.client) {
      this.client.set(new GAActions.Purchase(
        action.identifier,
        action.affiliation,
        action.revenue,
        action.tax,
        action.shippingCost,
        action.coupons && action.coupons[0] // GA only supports one coupon
      ));
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this.purchase,
        params: arguments
      });
    }
  }

  refundAll(properties: Generics, action: TransactionAction): void {
    if (this.client) {
      this.client.set(new GAActions.Refund(action.identifier));
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this.refundAll,
        params: arguments
      });
    }
  }

  refundPartial(properties: TransactionRefund, action: TransactionAction): void {
    if (this.client) {
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
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this.refundPartial,
        params: arguments
      });
    }
  }

  removeProduct(properties: Product): void {
    this._addProduct(properties);
    if (this.client) {
      this.client.set(new GAActions.Remove());
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this.removeProduct,
        params: arguments
      });
    }
  }

  // App Lifecycle Functions

  lifecycle(properties: App): void {
    const extraData = this.extractExtraData(properties);

    this._sendEvent({
      action: this.appId,
      category: properties.eventAction,
      label: properties.lifecycle
    }, extraData);
  }

  // Trigger Functions

  private _addProduct(properties: any): void {
    if (this.client) {
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
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this._addProduct,
        params: arguments
      });
    }
  }

  private _sendEvent(properties: GoogleAnalyticsEventProperties, extraProps?: object): void {
    if (this.client) {
      const hit = new GAHits.Event(
        properties.category,
        properties.action,
        properties.label,
        properties.value
      );

      if (extraProps) {
        hit.set(extraProps);
      }

      this.client.send(hit);
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this._sendEvent,
        params: arguments
      });
    }
  }

  private _sendPageView(properties: GoogleAnalyticsPageViewProperties, extraProps?: object): void {
    if (this.client) {
      const hit = new GAHits.PageView(
        properties.hostname,
        properties.page,
        properties.title
      );

      if (extraProps) {
        hit.set(extraProps);
      }

      this.client.send(hit);
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this._sendPageView,
        params: arguments
      });
    }
  }

  private _sendScreenView(
    properties: GoogleAnalyticsScreenViewProperties,
    extraProps?: object
  ): void {
    if (this.client) {
      const hit = new GAHits.ScreenView(
        properties.appName,
        properties.screenName,
        properties.appVersion,
        properties.appId,
        properties.appInstallerId
      );

      if (extraProps) {
        hit.set(extraProps);
      }

      this.client.send(hit);
    } else {
      this.queue.unshift({
        // tslint:disable-next-line: no-unbound-method
        func: this._sendScreenView,
        params: arguments
      });
    }
  }

  private extractExtraData(
    properties: import ('../../Analytics').BaseEvent
  ): object | undefined {
    // TODO: Add warning/errors for invalid query string parameters

    return properties.gaQueryParams;
  }
}
