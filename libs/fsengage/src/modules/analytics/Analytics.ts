import { Component } from 'react';

import { Platform } from 'react-native';

import type AnalyticsProvider from './providers/AnalyticsProvider';

export type BaseEvent<T = any> = Record<string, T> & {
  gaQueryParams?: object;
};

// Commerce Interfaces

export interface ClickGeneric extends BaseEvent {
  identifier?: string;
  name?: string;
  index?: number;
}

export interface ContactCall extends BaseEvent {
  number: string;
}

export interface ContactEmail extends BaseEvent {
  to: string;
}

export interface ImpressionGeneric extends BaseEvent {
  identifier?: string;
  name?: string;
  index?: number;
}

export interface LocationDirections extends BaseEvent {
  identifier?: string;
  address?: string;
}

export interface SearchGeneric extends BaseEvent {
  term: string;
  count?: number;
}

export interface Query {
  [key: string]: Query | Query[] | string[] | string | undefined;
}

/**
 * @deprecated use `ScreenView` instead (more required options)
 */
export interface Screenview extends BaseEvent {
  url: string;
}

export interface ScreenView extends BaseEvent {
  id: string;
  path: string;
  data: Record<string, unknown>;
  params: Record<string, string | undefined>;
  query: Query;
  url: string;
  isExact: boolean;
  title?: string;
}

// Enhanced Commerce Interfaces

export interface ImpressionProduct extends BaseEvent {
  identifier: string;
  name: string;
  brand?: string;
  category?: string;
  list: string;
  variant?: string;
  price?: string;
  index?: number;
}

export interface Product extends BaseEvent {
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

export interface Promotion extends BaseEvent {
  identifier: string;
  name: string;
  creative?: string;
  slot?: string;
}

export interface RefundProduct extends BaseEvent {
  identifier: string;
  quantity: number;
  price?: string;
  coupons?: string[];
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

export interface Campaign {
  /**
   * Campaign id; used to identify particular campaign by an external identifier
   */
  id?: string;

  /**
   * Campaign source; used to identify a search engine, newsletter, or other source
   */
  source?: string;

  /**
   * Campaign medium; used to identify a medium such as email or cost-per-click (cpc)
   */
  medium?: string;

  /**
   * Campaign name; used for keyword analysis to identify a specific product promotion or
   * strategic campaign
   */
  campaign?: string;

  /**
   * Campaign term; used with paid search to supply the keywords for ads
   */
  term?: string;

  /**
   * Campaign content; used for A/B testing and content-targeted ads to differentiate ads or
   * links that point to the same URL
   */
  content?: string;
}

// Class

export default class Analytics {
  constructor(providers: AnalyticsProvider[]) {
    this.providers = providers;
  }

  private readonly providers: AnalyticsProvider[];

  // Private Commerce Properties

  private readonly clickGeneric = (
    component: Component | string,
    properties: ClickGeneric
  ): void => {
    const eventAction = 'click';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'generic');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask((provider) => {
      provider.clickGeneric({
        eventAction,
        eventCategory,
        ...properties,
      });
    });
  };

  private readonly contactCall = (component: Component | string, properties: ContactCall): void => {
    const eventAction = 'contact';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'call');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask((provider) => {
      provider.contactCall({
        eventAction,
        eventCategory,
        ...properties,
      });
    });
  };

  private readonly contactEmail = (
    component: Component | string,
    properties: ContactEmail
  ): void => {
    const eventAction = 'contact';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'email');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask((provider) => {
      provider.contactEmail({
        eventAction,
        eventCategory,
        ...properties,
      });
    });
  };

  private readonly impressionGeneric = (
    component: Component | string,
    properties: ImpressionGeneric
  ): void => {
    const eventAction = 'impression';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'generic');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask((provider) => {
      provider.impressionGeneric({
        eventAction,
        eventCategory,
        ...properties,
      });
    });
  };

  private readonly locationDirections = (
    component: Component | string,
    properties: LocationDirections
  ): void => {
    const eventAction = 'location';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'directions');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask((provider) => {
      provider.locationDirections({
        eventAction,
        eventCategory,
        ...properties,
      });
    });
  };

  private readonly searchGeneric = (
    component: Component | string,
    properties: SearchGeneric
  ): void => {
    const eventAction = 'search';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'generic');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask((provider) => {
      provider.searchGeneric({
        eventAction,
        eventCategory,
        ...properties,
      });
    });
  };

  // Private Enhanced Commerce Properties

  private readonly impressionPromotion = (
    component: Component | string,
    properties: Promotion
  ): void => {
    const eventAction = 'impression';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'promotion');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask((provider) => {
      provider.impressionPromotion({
        eventAction,
        eventCategory,
        ...properties,
      });
    });
  };

  private readonly impressionProduct = (
    component: Component | string,
    properties: ImpressionProduct
  ): void => {
    const eventAction = 'impression';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'product');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask((provider) => {
      provider.impressionProduct({
        eventAction,
        eventCategory,
        ...properties,
      });
    });
  };

  private readonly clickPromotion = (
    component: Component | string,
    properties: Promotion
  ): void => {
    const eventAction = 'click';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'promotion');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask((provider) => {
      provider.clickPromotion({
        eventAction,
        eventCategory,
        ...properties,
      });
    });
  };

  private readonly clickProduct = (
    component: Component | string,
    properties: Product,
    action?: ProductAction
  ): void => {
    const eventAction = 'click';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'product');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties, action);
    }

    this.triggerTask((provider) => {
      provider.clickProduct(
        {
          eventAction,
          eventCategory,
          ...properties,
        },
        action
      );
    });
  };

  private readonly detailProduct = (
    component: Component | string,
    properties: Product,
    action?: ProductAction
  ): void => {
    const eventAction = 'detail';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'product');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask((provider) => {
      provider.detailProduct(
        {
          eventAction,
          eventCategory,
          ...properties,
        },
        action
      );
    });
  };

  private readonly addProduct = (component: Component | string, properties: Product): void => {
    const eventAction = 'add';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'product');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask((provider) => {
      provider.addProduct({
        eventAction,
        eventCategory,
        ...properties,
      });
    });
  };

  private readonly removeProduct = (component: Component | string, properties: Product): void => {
    const eventAction = 'remove';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'product');

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask((provider) => {
      provider.removeProduct({
        eventAction,
        eventCategory,
        ...properties,
      });
    });
  };

  private readonly refundPartial = (
    component: Component | string,
    products: RefundProduct[],
    action: TransactionAction
  ): void => {
    const eventAction = 'refundPartial';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'partial');

    if (__DEV__) {
      this.log(eventAction, eventCategory, products, action);
    }

    this.triggerTask((provider) => {
      provider.refundPartial(
        {
          eventAction,
          eventCategory,
          products,
        },
        action
      );
    });
  };

  private readonly refundAll = (component: Component | string, action: TransactionAction): void => {
    const eventAction = 'refund';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction, 'all');

    if (__DEV__) {
      this.log(eventAction, eventCategory, undefined, action);
    }

    this.triggerTask((provider) => {
      provider.refundAll(
        {
          eventAction,
          eventCategory,
        },
        action
      );
    });
  };

  // Private Apps Lifecyle Properties

  private readonly lifecycleActive = (): void => {
    const eventAction = 'lifecycle';
    const lifecycle = 'active';

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask((provider) => {
      provider.lifecycle({
        eventAction,
        lifecycle,
      });
    });
  };

  private readonly lifecycleBackground = (): void => {
    const eventAction = 'lifecycle';
    const lifecycle = 'background';

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask((provider) => {
      provider.lifecycle({
        eventAction,
        lifecycle,
      });
    });
  };

  private readonly lifecycleCreate = (): void => {
    const eventAction = 'lifecycle';
    const lifecycle = 'create';

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask((provider) => {
      provider.lifecycle({
        eventAction,
        lifecycle,
      });
    });
  };

  private readonly lifecycleClose = (): void => {
    const eventAction = 'lifecycle';
    const lifecycle = 'close';

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask((provider) => {
      provider.lifecycle({
        eventAction,
        lifecycle,
      });
    });
  };

  private readonly lifecycleInactive = (): void => {
    const eventAction = 'lifecycle';
    const lifecycle = 'inactive';

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask((provider) => {
      provider.lifecycle({
        eventAction,
        lifecycle,
      });
    });
  };

  private readonly lifecycleStart = (): void => {
    const eventAction = 'lifecycle';
    const lifecycle = 'start';

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask((provider) => {
      provider.lifecycle({
        eventAction,
        lifecycle,
      });
    });
  };

  private readonly lifecycleSuspend = (): void => {
    const eventAction = 'lifecycle';
    const lifecycle = 'suspend';

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask((provider) => {
      provider.lifecycle({
        eventAction,
        lifecycle,
      });
    });
  };

  // Private Log & Trigger Functions

  private geteventCategoryFromComponent(
    component: Component | string,
    eventActionKey: string,
    eventCategoryKey?: string
  ): string {
    let eventCategory: string;

    if (component instanceof Component) {
      const anyComponent = component as Component & { analytics: Record<string, any> };

      eventActionKey = eventActionKey.toLowerCase();
      eventCategoryKey = eventCategoryKey && eventCategoryKey.toLowerCase();

      eventCategory = eventCategoryKey
        ? (anyComponent.analytics &&
            anyComponent.analytics[eventActionKey] &&
            anyComponent.analytics[eventActionKey][eventCategoryKey]) ||
          anyComponent.constructor.name
        : (anyComponent.analytics && anyComponent.analytics[eventActionKey]) ||
          anyComponent.constructor.name;
    } else if ('string' === typeof component) {
      eventCategory = component;
    } else {
      eventCategory = 'unknown';
    }

    return eventCategory;
  }

  private triggerTask(task: (provider: AnalyticsProvider) => void): void {
    for (const provider of this.providers) {
      task(provider);
    }
  }

  private log(
    eventAction: string,
    eventCategory?: string,
    properties?: unknown[] | {},
    action?: {}
  ): void {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    console.log(
      `%cAnalytics\n%c eventAction: ${eventAction}\n eventCategory: ${eventCategory}\n
      Properties:\n`,
      'color: blue',
      'color: grey',
      properties,
      '\n Action:\n',
      action
    );
  }

  // Public Commerce Properties

  public readonly add = {
    product: this.addProduct,
  };

  public readonly click = {
    generic: this.clickGeneric,
    product: this.clickProduct,
    promotion: this.clickPromotion,
  };

  public readonly contact = {
    call: this.contactCall,
    email: this.contactEmail,
  };

  public readonly detail = {
    product: this.detailProduct,
  };

  public readonly location = {
    directions: this.locationDirections,
  };

  public readonly refund = {
    all: this.refundAll,
    partial: this.refundPartial,
  };

  public readonly remove = {
    product: this.removeProduct,
  };

  public readonly search = {
    generic: this.searchGeneric,
  };

  public readonly impression = {
    generic: this.impressionGeneric,
    product: this.impressionProduct,
    promotion: this.impressionPromotion,
  };

  // Public Apps Lifecyle Properties

  public readonly lifecycle = {
    active: this.lifecycleActive,
    background: this.lifecycleBackground,
    close: this.lifecycleClose,
    create: this.lifecycleCreate,
    inactive: this.lifecycleInactive,
    start: this.lifecycleStart,
    suspend: this.lifecycleSuspend,
  };

  // Public Commerce Functions
  public screenview(component: Component | string, properties: ScreenView | Screenview): void {
    const eventAction = 'screenview';

    const eventCategory = this.geteventCategoryFromComponent(component, eventAction);

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    if ('ios' === Platform.OS || 'android' === Platform.OS) {
      this.triggerTask((provider) => {
        provider.screenview({
          eventCategory,
          ...properties,
        });
      });
    } else {
      this.triggerTask((provider) => {
        provider.pageview({
          eventCategory,
          ...properties,
        });
      });
    }
  }

  // Public Enhanced Commerce Functions

  public checkout(
    component: Component | string,
    products: Product[],
    action: CheckoutAction
  ): void {
    const eventAction = 'checkout';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction);

    if (__DEV__) {
      this.log(eventAction, eventCategory, products, action);
    }

    this.triggerTask((provider) => {
      provider.checkout(
        {
          eventAction,
          eventCategory,
          products,
        },
        action
      );
    });
  }

  public checkoutOption(component: Component | string, action: CheckoutAction): void {
    const eventAction = 'checkoutOption';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction);

    if (__DEV__) {
      this.log(eventAction, eventCategory, undefined, action);
    }

    this.triggerTask((provider) => {
      provider.checkoutOption(
        {
          eventAction,
          eventCategory,
        },
        action
      );
    });
  }

  public purchase(
    component: Component | string,
    products: Product[],
    action: TransactionAction
  ): void {
    const eventAction = 'purchase';
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction);

    if (__DEV__) {
      this.log(eventAction, eventCategory, products, action);
    }

    this.triggerTask((provider) => {
      provider.purchase(
        {
          eventAction,
          eventCategory,
          products,
        },
        action
      );
    });
  }

  public setTrafficSource(campaignData: Campaign): void {
    this.triggerTask((provider) => {
      provider.setTrafficSource(campaignData);
    });
  }
}
