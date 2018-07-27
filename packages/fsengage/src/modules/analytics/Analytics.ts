// tslint:disable:member-ordering
import { Component } from 'react';
import { Platform } from 'react-native';

import AnalyticsProvider from './providers/AnalyticsProvider';

// Commerce Interfaces

export interface ClickGeneric {
  identifier?: string;
  name?: string;
  index?: number;
}

export interface ContactCall {
  number: string;
}

export interface ContactEmail {
  to: string;
}

export interface ImpressionGeneric {
  identifier?: string;
  name?: string;
  index?: number;
}

export interface LocationDirections {
  identifier?: string;
  address?: string;
}

export interface SearchGeneric {
  term: string;
  count?: number;
}

export interface Screenview {
  url: string;
}

// Enhanced Commerce Interfaces

export interface ImpressionProduct {
  identifier: string;
  name: string;
  brand?: string;
  category?: string;
  list: string;
  variant?: string;
  price?: string;
  index?: number;
}

export interface Product {
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

export interface Promotion {
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

// Class

export default class Analytics {
  private readonly kFunctionsName: { [key: string]: string } = {
    addProduct: 'addProduct',
    checkout: 'checkout',
    checkoutOption: 'checkoutOption',
    clickGeneric: 'clickGeneric',
    clickProduct: 'clickProduct',
    clickPromotion: 'clickPromotion',
    contactCall: 'contactCall',
    contactEmail: 'contactEmail',
    detailProduct: 'detailProduct',
    impressionGeneric: 'impressionGeneric',
    impressionProduct: 'impressionProduct',
    impressionPromotion: 'impressionPromotion',
    lifecycleActive: 'lifecycleActive',
    lifecycleBackground: 'lifecycleBackground',
    lifecycleCreate: 'lifecycleCreate',
    lifecycleClose: 'lifecycleClose',
    lifecycleInactive: 'lifecycleInactive',
    lifecycleStart: 'lifecycleStart',
    lifecycleSuspend: 'lifecycleSuspend',
    locationDirections: 'locationDirections',
    purchase: 'purchase',
    refundAll: 'refundAll',
    refundPartial: 'refundPartial',
    removeProduct: 'removeProduct',
    screenview: 'screenview',
    searchGeneric: 'searchGeneric'
  };

  private readonly kFunctionsEventAction: { [key: string]: string } = {
    addProduct: 'add',
    checkout: 'checkout',
    checkoutOption: 'checkoutOption',
    clickGeneric: 'click',
    clickProduct: 'click',
    clickPromotion: 'click',
    contactCall: 'contact',
    contactEmail: 'contact',
    detailProduct: 'detail',
    impressionGeneric: 'impression',
    impressionProduct: 'impression',
    impressionPromotion: 'impression',
    lifecycleActive: 'lifecycle',
    lifecycleBackground: 'lifecycle',
    lifecycleCreate: 'lifecycle',
    lifecycleClose: 'lifecycle',
    lifecycleInactive: 'lifecycle',
    lifecycleStart: 'lifecycle',
    lifecycleSuspend: 'lifecycle',
    locationDirections: 'location',
    purchase: 'purchase',
    refundAll: 'refund',
    refundPartial: 'refundPartial',
    removeProduct: 'remove',
    screenview: 'screenview',
    searchGeneric: 'search'
  };

  private readonly kFunctionsEventCategoryKey: { [key: string]: string } = {
    addProduct: 'product',
    clickGeneric: 'generic',
    clickProduct: 'product',
    clickPromotion: 'promotion',
    contactCall: 'call',
    contactEmail: 'email',
    detailProduct: 'product',
    locationDirections: 'directions',
    refundAll: 'all',
    refundPartial: 'partial',
    removeProduct: 'product',
    searchGeneric: 'generic',
    impressionGeneric: 'generic',
    impressionProduct: 'product',
    impressionPromotion: 'promotion'
  };

  private readonly kFunctionsLifecycle: { [key: string]: string } = {
    lifecycleActive: 'active',
    lifecycleBackground: 'background',
    lifecycleCreate: 'create',
    lifecycleClose: 'close',
    lifecycleInactive: 'inactive',
    lifecycleStart: 'start',
    lifecycleSuspend: 'suspend'
  };

  private providers: AnalyticsProvider[];

  constructor(providers: AnalyticsProvider[]) {
    this.providers = providers;
  }

  // Private Commerce Properties

  private clickGeneric = (component: Component | string, properties: ClickGeneric): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.clickGeneric];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.clickGeneric]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask(provider => provider.clickGeneric({
      eventAction,
      eventCategory,
      ...properties
    }));
  }

  private contactCall = (component: Component | string, properties: ContactCall): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.contactCall];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.contactCall]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask(provider => provider.contactCall({
      eventAction,
      eventCategory,
      ...properties
    }));
  }

  private contactEmail = (component: Component | string, properties: ContactEmail): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.contactEmail];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.contactEmail]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask(provider => provider.contactEmail({
      eventAction,
      eventCategory,
      ...properties
    }));
  }

  private impressionGeneric = (
    component: Component | string, properties: ImpressionGeneric
  ): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.impressionGeneric];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.impressionGeneric]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask(provider => provider.impressionGeneric({
      eventAction,
      eventCategory,
      ...properties
    }));
  }

  private locationDirections = (
    component: Component | string, properties: LocationDirections
  ): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.locationDirections];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[
        this.kFunctionsName.locationDirections
      ]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask(provider => provider.locationDirections({
      eventAction,
      eventCategory,
      ...properties
    }));
  }

  private searchGeneric = (component: Component | string, properties: SearchGeneric): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.searchGeneric];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.searchGeneric]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask(provider => provider.searchGeneric({
      eventAction,
      eventCategory,
      ...properties
    }));
  }

  // Private Enhanced Commerce Properties

  private impressionPromotion = (component: Component | string, properties: Promotion): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.impressionPromotion];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[
        this.kFunctionsName.impressionPromotion
      ]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask(provider => provider.impressionPromotion({
      eventAction,
      eventCategory,
      ...properties
    }));
  }

  private impressionProduct = (
    component: Component | string, properties: ImpressionProduct
  ): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.impressionProduct];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.impressionProduct]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask(provider => provider.impressionProduct({
      eventAction,
      eventCategory,
      ...properties
    }));
  }

  private clickPromotion = (component: Component | string, properties: Promotion): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.clickPromotion];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.clickPromotion]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask(provider => provider.clickPromotion({
      eventAction,
      eventCategory,
      ...properties
    }));
  }

  private clickProduct = (
    component: Component | string, properties: Product, action?: ProductAction
  ): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.clickProduct];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.clickProduct]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties, action);
    }

    this.triggerTask(provider => provider.clickProduct(
      {
        eventAction,
        eventCategory,
        ...properties
      },
      action
    ));
  }

  private detailProduct = (
    component: Component | string, properties: Product, action?: ProductAction
  ): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.detailProduct];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.detailProduct]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask(provider => provider.detailProduct(
      {
        eventAction,
        eventCategory,
        ...properties
      },
      action
    ));
  }

  private addProduct = (component: Component | string, properties: Product): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.addProduct];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.addProduct]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask(provider => provider.addProduct({
      eventAction,
      eventCategory,
      ...properties
    }));
  }

  private removeProduct = (component: Component | string, properties: Product): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.removeProduct];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.removeProduct]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    this.triggerTask(provider => provider.removeProduct({
      eventAction,
      eventCategory,
      ...properties
    }));
  }

  private refundPartial = (
    component: Component | string, products: RefundProduct[], action: TransactionAction
  ): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.refundPartial];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.refundPartial]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, products, action);
    }

    this.triggerTask(provider => provider.refundPartial(
      {
        eventAction,
        eventCategory,
        products
      },
      action
    ));
  }

  private refundAll = (component: Component | string, action: TransactionAction): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.refundAll];
    const eventCategory = this.geteventCategoryFromComponent(
      component, eventAction, this.kFunctionsEventCategoryKey[this.kFunctionsName.refundAll]
    );

    if (__DEV__) {
      this.log(eventAction, eventCategory, undefined, action);
    }

    this.triggerTask(provider => provider.refundAll(
      {
        eventAction,
        eventCategory
      },
      action
    ));
  }

  // Private Apps Lifecyle Properties

  private lifecycleActive = (): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.lifecycleActive];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleActive];

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      eventAction,
      lifecycle
    }));
  }

  private lifecycleBackground = (): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.lifecycleBackground];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleBackground];

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      eventAction,
      lifecycle
    }));
  }

  private lifecycleCreate = (): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.lifecycleCreate];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleCreate];

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      eventAction,
      lifecycle
    }));
  }

  private lifecycleClose = (): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.lifecycleClose];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleClose];

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      eventAction,
      lifecycle
    }));
  }

  private lifecycleInactive = (): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.lifecycleInactive];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleInactive];

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      eventAction,
      lifecycle
    }));
  }

  private lifecycleStart = (): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.lifecycleStart];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleStart];

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      eventAction,
      lifecycle
    }));
  }

  private lifecycleSuspend = (): void => {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.lifecycleSuspend];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleSuspend];

    if (__DEV__) {
      this.log(eventAction, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      eventAction,
      lifecycle
    }));
  }

  // Private Log & Trigger Functions

  private geteventCategoryFromComponent(
    component: Component | string, eventActionKey: string, eventCategoryKey?: string
  ): string {
    let eventCategory: string;

    if (component instanceof Component) {
      const anyComponent: any = component;

      eventActionKey = eventActionKey.toLowerCase();
      eventCategoryKey = eventCategoryKey && eventCategoryKey.toLowerCase();

      if (eventCategoryKey) {
        eventCategory = (anyComponent.analytics &&
                    anyComponent.analytics[eventActionKey] &&
                    anyComponent.analytics[eventActionKey][eventCategoryKey]) ||
                    anyComponent.constructor.name;
      } else {
        eventCategory = (anyComponent.analytics &&
                    anyComponent.analytics[eventActionKey]) ||
                    anyComponent.constructor.name;
      }
    } else if ('string' === typeof component) {
      eventCategory = component;
    } else {
      eventCategory = 'unknown';
    }

    return eventCategory;
  }

  private triggerTask(task: (provider: AnalyticsProvider) => void): void {
    this.providers.forEach(provider => {
      task(provider);
    });
  }

  private log(
    eventAction: string, eventCategory?: string, properties?: {} | any[], action?: {}
  ): void {
    if (process.env.NODE_ENV === 'test') { return; }
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

  // TSLint `typedef` rule is disable in the below properties
  // to avoid opaquing the documentation of its internal functions when used.
  // tslint:disable:typedef

  // Public Commerce Properties

  add = {
    product: this.addProduct
  };

  click = {
    generic: this.clickGeneric,
    product: this.clickProduct,
    promotion: this.clickPromotion
  };

  contact = {
    call: this.contactCall,
    email: this.contactEmail
  };

  detail = {
    product: this.detailProduct
  };

  location = {
    directions: this.locationDirections
  };

  refund = {
    all: this.refundAll,
    partial: this.refundPartial
  };

  remove = {
    product: this.removeProduct
  };

  search = {
    generic: this.searchGeneric
  };

  impression = {
    generic: this.impressionGeneric,
    product: this.impressionProduct,
    promotion: this.impressionPromotion
  };

  // Public Apps Lifecyle Properties

  lifecycle = {
    active: this.lifecycleActive,
    background: this.lifecycleBackground,
    close: this.lifecycleClose,
    create: this.lifecycleCreate,
    inactive: this.lifecycleInactive,
    start: this.lifecycleStart,
    suspend: this.lifecycleSuspend
  };

  // tslint:enable:typedef

  // Public Commerce Functions

  screenview(component: Component | string, properties: Screenview): void {
    const eventAction = this.kFunctionsEventAction[this.screenview.name];
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction);

    if (__DEV__) {
      this.log(eventAction, eventCategory, properties);
    }

    if ('ios' === Platform.OS || 'android' === Platform.OS) {
      this.triggerTask(provider => provider.screenview({
        eventCategory,
        ...properties
      }));
    } else {
      this.triggerTask(provider => provider.pageview({
        eventCategory,
        ...properties
      }));
    }
  }

  // Public Enhanced Commerce Functions

  checkout(component: Component | string, products: Product[], action: CheckoutAction): void {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.checkout];
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction);

    if (__DEV__) {
      this.log(eventAction, eventCategory, products, action);
    }

    this.triggerTask(provider => provider.checkout(
      {
        eventAction,
        eventCategory,
        products
      },
      action
    ));
  }

  checkoutOption(component: Component | string, action: CheckoutAction): void {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.checkoutOption];
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction);

    if (__DEV__) {
      this.log(eventAction, eventCategory, undefined, action);
    }

    this.triggerTask(provider => provider.checkoutOption(
      {
        eventAction,
        eventCategory
      },
      action
    ));
  }

  purchase(component: Component | string, products: Product[], action: TransactionAction): void {
    const eventAction = this.kFunctionsEventAction[this.kFunctionsName.purchase];
    const eventCategory = this.geteventCategoryFromComponent(component, eventAction);

    if (__DEV__) {
      this.log(eventAction, eventCategory, products, action);
    }

    this.triggerTask(provider => provider.purchase(
      {
        eventAction,
        eventCategory,
        products
      },
      action
    ));
  }
}
