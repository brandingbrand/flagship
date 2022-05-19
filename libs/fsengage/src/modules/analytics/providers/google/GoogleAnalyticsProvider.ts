import FSNetwork from '@brandingbrand/fsnetwork';
import {
  Actions as GAActions,
  Analytics as GAClient,
  Hits as GAHits,
  // @ts-expect-error TODO: Update react-native-google-analytics to support typing
} from '@brandingbrand/react-native-google-analytics';

import parseURL from 'url-parse';

import type { BaseEvent, Campaign } from '../../Analytics';
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

export interface GoogleAnalyticsProviderConfiguration {
  trackerId: Promise<string> | string;
  clientId?: Promise<string> | string;
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
  hostname: number | string | null;
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
  constructor(
    commonConfiguration: AnalyticsProviderConfiguration,
    configuration: GoogleAnalyticsProviderConfiguration
  ) {
    super(commonConfiguration);
    this.configuration = configuration;
    this.queue = [];
  }

  private client?: GAClient;
  private readonly configuration: GoogleAnalyticsProviderConfiguration;
  private readonly queue: QueuedFunction[];

  private _addProduct(properties: any): void {
    if (this.client) {
      this.client.add(
        new GAHits.Product(
          properties.identifier,
          properties.name,
          properties.brand,
          properties.category,
          properties.variant,
          properties.coupons && properties.coupons[0], // GA only supports one coupon
          properties.price,
          properties.quantity,
          properties.index
        )
      );
    } else {
      this.queue.unshift({
        func: this._addProduct,
        params: arguments,
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
        func: this._sendEvent,
        params: arguments,
      });
    }
  }

  private _sendPageView(properties: GoogleAnalyticsPageViewProperties, extraProps?: object): void {
    if (this.client) {
      const hit = new GAHits.PageView(properties.hostname, properties.page, properties.title);

      if (extraProps) {
        hit.set(extraProps);
      }

      this.client.send(hit);
    } else {
      this.queue.unshift({
        func: this._sendPageView,
        params: arguments,
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
        func: this._sendScreenView,
        params: arguments,
      });
    }
  }

  private extractExtraData(properties: BaseEvent): object | undefined {
    // TODO: Add warning/errors for invalid query string parameters

    return properties.gaQueryParams;
  }

  public async asyncInit(): Promise<void> {
    // TODO | BD: Check and filter optional fields.

    const network = new FSNetwork();

    this.client = new GAClient(
      await this.configuration.trackerId,
      (await this.configuration.clientId) || null,
      null,
      this.userAgent,
      // @ts-expect-error TODO update react-native-google-analytics to not need the private instance
      network.instance
    );

    while (this.queue.length > 0) {
      const queued: QueuedFunction | undefined = this.queue.pop();
      if (queued) {
        queued.func.apply(this, queued.params);
      } else {
        break;
      }
    }
  }

  public contactCall(properties: ContactCall): void {
    const extraData = this.extractExtraData(properties);

    this._sendEvent(
      {
        action: properties.eventAction,
        category: properties.eventCategory,
        label: properties.number,
      },
      extraData
    );
  }

  public contactEmail(properties: ContactEmail): void {
    const extraData = this.extractExtraData(properties);

    this._sendEvent(
      {
        action: properties.eventAction,
        category: properties.eventCategory,
        label: properties.to,
      },
      extraData
    );
  }

  public clickGeneric(properties: ClickGeneric): void {
    const extraData = this.extractExtraData(properties);

    this._sendEvent(
      {
        action: properties.eventAction,
        category: properties.eventCategory,
        label: properties.identifier || properties.name,
        value: properties.index,
      },
      extraData
    );
  }

  public impressionGeneric(properties: ImpressionGeneric): void {
    // TODO: Fix this implementation so its not identical to click
    this.clickGeneric(properties);
  }

  public locationDirections(properties: LocationDirections): void {
    const extraData = this.extractExtraData(properties);

    this._sendEvent(
      {
        action: properties.eventAction,
        category: properties.eventCategory,
        label: properties.identifier || properties.address,
      },
      extraData
    );
  }

  public pageview(properties: Screenview): void {
    const parser = properties.url && parseURL(properties.url);
    const extraData = this.extractExtraData(properties);

    this._sendPageView(
      {
        hostname: parser && parser.host,
        page: parser && parser.pathname,
        title: properties.eventCategory,
      },
      extraData
    );
  }

  public screenview(properties: Screenview): void {
    const extraData = this.extractExtraData(properties);

    this._sendScreenView(
      {
        appId: this.appId,
        appInstallerId: this.appInstallerId,
        appName: this.appName,
        appVersion: this.appVersion,
        screenName: properties.eventCategory,
      },
      extraData
    );
  }

  public searchGeneric(properties: SearchGeneric): void {
    const extraData = this.extractExtraData(properties);

    this._sendEvent(
      {
        action: properties.eventAction,
        category: properties.eventCategory,
        label: properties.term,
        value: properties.count,
      },
      extraData
    );
  }

  public addProduct(properties: Product): void {
    this._addProduct(properties);
    if (this.client) {
      this.client.set(new GAActions.Add());
    } else {
      this.queue.unshift({
        func: this.addProduct,
        params: arguments,
      });
    }
  }

  public checkout(properties: Checkout, action: CheckoutAction): void {
    for (const product of properties.products) {
      this._addProduct(product);
    }

    if (this.client) {
      this.client.set(new GAActions.Checkout(action.step, action.option));
    } else {
      this.queue.unshift({
        func: this.checkout,
        params: arguments,
      });
    }
  }

  public checkoutOption(properties: Generics, action: CheckoutAction): void {
    if (this.client) {
      this.client.set(new GAActions.CheckoutOption(action.step, action.option));
    } else {
      this.queue.unshift({
        func: this.checkoutOption,
        params: arguments,
      });
    }
  }

  public clickProduct(properties: Product, action?: ProductAction): void {
    this._addProduct(properties);
    if (this.client) {
      this.client.set(new GAActions.Click(action && action.list));
    } else {
      this.queue.unshift({
        func: this.clickProduct,
        params: arguments,
      });
    }
  }

  public clickPromotion(properties: Promotion): void {
    if (this.client) {
      this.client.add(
        new GAHits.Promo(
          properties.identifier,
          properties.name,
          properties.creative,
          properties.slot
        )
      );

      this.client.set(new GAActions.PromoClick());
    } else {
      this.queue.unshift({
        func: this.clickPromotion,
        params: arguments,
      });
    }
  }

  public impressionProduct(properties: ImpressionProduct): void {
    if (this.client) {
      this.client.add(
        new GAHits.Impression(
          properties.identifier,
          properties.name,
          properties.list,
          properties.brand,
          properties.category,
          properties.variant,
          properties.index,
          properties.price
        )
      );
    } else {
      this.queue.unshift({
        func: this.impressionProduct,
        params: arguments,
      });
    }
  }

  public impressionPromotion(properties: Promotion): void {
    if (this.client) {
      this.client.add(
        new GAHits.Promo(
          properties.identifier,
          properties.name,
          properties.creative,
          properties.slot
        )
      );
    } else {
      this.queue.unshift({
        func: this.impressionPromotion,
        params: arguments,
      });
    }
  }

  public detailProduct(properties: Product, action?: ProductAction): void {
    this._addProduct(properties);
    if (this.client) {
      this.client.set(new GAActions.Detail(action && action.list));
    } else {
      this.queue.unshift({
        func: this.detailProduct,
        params: arguments,
      });
    }
  }

  public purchase(properties: Transaction, action: TransactionAction): void {
    for (const product of properties.products) {
      this._addProduct(product);
    }

    if (this.client) {
      this.client.set(
        new GAActions.Purchase(
          action.identifier,
          action.affiliation,
          action.revenue,
          action.tax,
          action.shippingCost,
          action.coupons && action.coupons[0] // GA only supports one coupon
        )
      );
    } else {
      this.queue.unshift({
        func: this.purchase,
        params: arguments,
      });
    }
  }

  public refundAll(properties: Generics, action: TransactionAction): void {
    if (this.client) {
      this.client.set(new GAActions.Refund(action.identifier));
    } else {
      this.queue.unshift({
        func: this.refundAll,
        params: arguments,
      });
    }
  }

  public refundPartial(properties: TransactionRefund, action: TransactionAction): void {
    if (this.client) {
      for (const product of properties.products) {
        this.client.add(
          new GAHits.Product(
            product.identifier,
            null,
            null,
            null,
            null,
            null,
            null,
            product.quantity,
            null
          )
        );
      }

      this.client.set(new GAActions.Refund(action.identifier));
    } else {
      this.queue.unshift({
        func: this.refundPartial,
        params: arguments,
      });
    }
  }

  public removeProduct(properties: Product): void {
    this._addProduct(properties);
    if (this.client) {
      this.client.set(new GAActions.Remove());
    } else {
      this.queue.unshift({
        func: this.removeProduct,
        params: arguments,
      });
    }
  }

  public lifecycle(properties: App): void {
    const extraData = this.extractExtraData(properties);

    this._sendEvent(
      {
        action: this.appId,
        category: properties.eventAction,
        label: properties.lifecycle,
      },
      extraData
    );
  }

  public setTrafficSource(properties: Campaign): void {
    if (this.client) {
      this.client.set(
        new GAHits.TrafficSource({
          utm_id: properties.id,
          utm_source: properties.source,
          utm_medium: properties.medium,
          utm_campaign: properties.campaign,
          utm_term: properties.term,
          utm_content: properties.content,
        })
      );
    } else {
      this.queue.unshift({
        func: this.setTrafficSource,
        params: arguments,
      });
    }
  }
}
