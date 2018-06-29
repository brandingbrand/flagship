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

  private readonly kFunctionsGroup: { [key: string]: string } = {
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

  private readonly kFunctionsSubgroupKey: { [key: string]: string } = {
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
    const group = this.kFunctionsGroup[this.kFunctionsName.clickGeneric];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.clickGeneric]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    this.triggerTask(provider => provider.clickGeneric({
      group,
      subgroup,
      ...properties
    }));
  }

  private contactCall = (component: Component | string, properties: ContactCall): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.contactCall];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.contactCall]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    this.triggerTask(provider => provider.contactCall({
      group,
      subgroup,
      ...properties
    }));
  }

  private contactEmail = (component: Component | string, properties: ContactEmail): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.contactEmail];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.contactEmail]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    this.triggerTask(provider => provider.contactEmail({
      group,
      subgroup,
      ...properties
    }));
  }

  private impressionGeneric = (
    component: Component | string, properties: ImpressionGeneric
  ): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.impressionGeneric];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.impressionGeneric]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    this.triggerTask(provider => provider.impressionGeneric({
      group,
      subgroup,
      ...properties
    }));
  }

  private locationDirections = (
    component: Component | string, properties: LocationDirections
  ): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.locationDirections];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.locationDirections]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    this.triggerTask(provider => provider.locationDirections({
      group,
      subgroup,
      ...properties
    }));
  }

  private searchGeneric = (component: Component | string, properties: SearchGeneric): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.searchGeneric];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.searchGeneric]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    this.triggerTask(provider => provider.searchGeneric({
      group,
      subgroup,
      ...properties
    }));
  }

  // Private Enhanced Commerce Properties

  private impressionPromotion = (component: Component | string, properties: Promotion): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.impressionPromotion];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.impressionPromotion]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    this.triggerTask(provider => provider.impressionPromotion({
      group,
      subgroup,
      ...properties
    }));
  }

  private impressionProduct = (
    component: Component | string, properties: ImpressionProduct
  ): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.impressionProduct];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.impressionProduct]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    this.triggerTask(provider => provider.impressionProduct({
      group,
      subgroup,
      ...properties
    }));
  }

  private clickPromotion = (component: Component | string, properties: Promotion): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.clickPromotion];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.clickPromotion]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    this.triggerTask(provider => provider.clickPromotion({
      group,
      subgroup,
      ...properties
    }));
  }

  private clickProduct = (
    component: Component | string, properties: Product, action?: ProductAction
  ): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.clickProduct];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.clickProduct]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties, action);
    }

    this.triggerTask(provider => provider.clickProduct(
      {
        group,
        subgroup,
        ...properties
      },
      action
    ));
  }

  private detailProduct = (
    component: Component | string, properties: Product, action?: ProductAction
  ): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.detailProduct];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.detailProduct]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    this.triggerTask(provider => provider.detailProduct(
      {
        group,
        subgroup,
        ...properties
      },
      action
    ));
  }

  private addProduct = (component: Component | string, properties: Product): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.addProduct];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.addProduct]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    this.triggerTask(provider => provider.addProduct({
      group,
      subgroup,
      ...properties
    }));
  }

  private removeProduct = (component: Component | string, properties: Product): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.removeProduct];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.removeProduct]
    );

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    this.triggerTask(provider => provider.removeProduct({
      group,
      subgroup,
      ...properties
    }));
  }

  private refundPartial = (
    component: Component | string, products: RefundProduct[], action: TransactionAction
  ): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.refundPartial];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.refundPartial]
    );

    if (__DEV__) {
      this.log(group, subgroup, products, action);
    }

    this.triggerTask(provider => provider.refundPartial(
      {
        group,
        subgroup,
        products
      },
      action
    ));
  }

  private refundAll = (component: Component | string, action: TransactionAction): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.refundAll];
    const subgroup = this.getSubgroupFromComponent(
      component, group, this.kFunctionsSubgroupKey[this.kFunctionsName.refundAll]
    );

    if (__DEV__) {
      this.log(group, subgroup, undefined, action);
    }

    this.triggerTask(provider => provider.refundAll(
      {
        group,
        subgroup
      },
      action
    ));
  }

  // Private Apps Lifecyle Properties

  private lifecycleActive = (): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.lifecycleActive];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleActive];

    if (__DEV__) {
      this.log(group, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      group,
      lifecycle
    }));
  }

  private lifecycleBackground = (): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.lifecycleBackground];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleBackground];

    if (__DEV__) {
      this.log(group, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      group,
      lifecycle
    }));
  }

  private lifecycleCreate = (): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.lifecycleCreate];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleCreate];

    if (__DEV__) {
      this.log(group, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      group,
      lifecycle
    }));
  }

  private lifecycleClose = (): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.lifecycleClose];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleClose];

    if (__DEV__) {
      this.log(group, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      group,
      lifecycle
    }));
  }

  private lifecycleInactive = (): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.lifecycleInactive];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleInactive];

    if (__DEV__) {
      this.log(group, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      group,
      lifecycle
    }));
  }

  private lifecycleStart = (): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.lifecycleStart];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleStart];

    if (__DEV__) {
      this.log(group, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      group,
      lifecycle
    }));
  }

  private lifecycleSuspend = (): void => {
    const group = this.kFunctionsGroup[this.kFunctionsName.lifecycleSuspend];
    const lifecycle = this.kFunctionsLifecycle[this.kFunctionsName.lifecycleSuspend];

    if (__DEV__) {
      this.log(group, lifecycle);
    }

    this.triggerTask(provider => provider.lifecycle({
      group,
      lifecycle
    }));
  }

  // Private Log & Trigger Functions

  private getSubgroupFromComponent(
    component: Component | string, groupKey: string, subgroupKey?: string
  ): string {
    let subgroup: string;

    if (component instanceof Component) {
      const anyComponent: any = component;

      groupKey = groupKey.toLowerCase();
      subgroupKey = subgroupKey && subgroupKey.toLowerCase();

      if (subgroupKey) {
        subgroup = (anyComponent.analytics &&
                    anyComponent.analytics[groupKey] &&
                    anyComponent.analytics[groupKey][subgroupKey]) ||
                    anyComponent.constructor.name;
      } else {
        subgroup = (anyComponent.analytics &&
                    anyComponent.analytics[groupKey]) ||
                    anyComponent.constructor.name;
      }
    } else if ('string' === typeof component) {
      subgroup = component;
    } else {
      subgroup = 'unknown';
    }

    return subgroup;
  }

  private triggerTask(task: (provider: AnalyticsProvider) => void): void {
    this.providers.forEach(provider => {
      task(provider);
    });
  }

  private log(group: string, subgroup?: string, properties?: {} | any[], action?: {}): void {
    if (process.env.NODE_ENV === 'test') { return; }
    console.log(
      `%cAnalytics\n%c Group: ${group}\n Subgroup: ${subgroup}\n Properties:\n`,
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
    const group = this.kFunctionsGroup[this.screenview.name];
    const subgroup = this.getSubgroupFromComponent(component, group);

    if (__DEV__) {
      this.log(group, subgroup, properties);
    }

    if ('ios' === Platform.OS || 'android' === Platform.OS) {
      this.triggerTask(provider => provider.screenview({
        subgroup,
        ...properties
      }));
    } else {
      this.triggerTask(provider => provider.pageview({
        subgroup,
        ...properties
      }));
    }
  }

  // Public Enhanced Commerce Functions

  checkout(component: Component | string, products: Product[], action: CheckoutAction): void {
    const group = this.kFunctionsGroup[this.kFunctionsName.checkout];
    const subgroup = this.getSubgroupFromComponent(component, group);

    if (__DEV__) {
      this.log(group, subgroup, products, action);
    }

    this.triggerTask(provider => provider.checkout(
      {
        group,
        subgroup,
        products
      },
      action
    ));
  }

  checkoutOption(component: Component | string, action: CheckoutAction): void {
    const group = this.kFunctionsGroup[this.kFunctionsName.checkoutOption];
    const subgroup = this.getSubgroupFromComponent(component, group);

    if (__DEV__) {
      this.log(group, subgroup, undefined, action);
    }

    this.triggerTask(provider => provider.checkoutOption(
      {
        group,
        subgroup
      },
      action
    ));
  }

  purchase(component: Component | string, products: Product[], action: TransactionAction): void {
    const group = this.kFunctionsGroup[this.kFunctionsName.purchase];
    const subgroup = this.getSubgroupFromComponent(component, group);

    if (__DEV__) {
      this.log(group, subgroup, products, action);
    }

    this.triggerTask(provider => provider.purchase(
      {
        group,
        subgroup,
        products
      },
      action
    ));
  }
}
