import React from 'react';
import { EventSubscription } from 'react-native';
import { GenericNavProp } from '../components/screenWrapper.web';
import pushRoute from './push-route';
import {
  NavLayout,
  NavLayoutStackChildren,
  NavOptions
} from '../types';


export default class NavWrapper {
  props: GenericNavProp;
  constructor(props: GenericNavProp) {
    this.props = props;
  }

  async push(layout: NavLayout, alternateId?: string): Promise<any> {
    pushRoute(layout, this.props.history, this.props.appConfig);
  }
  async pop(options?: NavOptions, alternateId?: string): Promise<any> {
    this.props.history.goBack();
  }
  async popToRoot(options?: NavOptions, alternateId?: string): Promise<any> {
    if (this.props.appConfig.screen &&
      this.props.appConfig.screens[this.props.appConfig.screen.name]) {
      this.props.history.push(
        this.props.appConfig.screens[this.props.appConfig.screen.name].path || '/'
      );
    } else {
      this.props.history.push('/');
    }
  }
  async popTo(options?: NavOptions, alternateId?: string): Promise<any> {
    if (alternateId) {
      if (this.props.appConfig.screens[alternateId]) {
        this.props.history.push(
          this.props.appConfig.screens[alternateId].path || '/'
        );
      } else {
        console.error('Unknown screen: ' + alternateId);
      }
    } else {
      console.warn('Specify a screen to pop to.');
    }
  }
  async setStackRoot(layout: NavLayout, alternateId?: string): Promise<any> {
    pushRoute(layout, this.props.history, this.props.appConfig);
  }
  async showStackedModal(layout: NavLayout | NavLayoutStackChildren): Promise<any> {
    if (layout.component) {
      this.props.modals.push({
        layout
      });
    }
  }

  async showModal(layout: NavLayout): Promise<any> {
    if (layout.stack && layout.stack.children) {
      // tslint:disable-next-line: prefer-for-of
      for (let loop = 0; loop < layout.stack.children.length; loop++) {
        await this.showModal(layout.stack.children[loop]);
      }
    }
    await this.showStackedModal(layout);
    this.props.updateModals(this.props.modals);
  }
  async dismissModal(options?: NavOptions, alternateId?: string): Promise<any> {
    this.props.modals.pop();
    this.props.updateModals(this.props.modals);
  }
  async dismissAllModals(options?: NavOptions): Promise<any> {
    this.props.modals = [];
    this.props.updateModals(this.props.modals);
  }
  mergeOptions(options: NavOptions, alternateId?: string): void {
    if (options.sideMenu && this.props.toggleDrawerFn) {
      if (options.sideMenu.left && options.sideMenu.left.visible !== undefined) {
        this.props.toggleDrawerFn({
          side: 'left',
          to: options.sideMenu.left.visible ? 'open' : 'closed'
        });
      } else if (options.sideMenu.right && options.sideMenu.right.visible !== undefined) {
        this.props.toggleDrawerFn({
          side: 'right',
          to: options.sideMenu.right.visible ? 'open' : 'closed'
        });
      }
    }
    return;
  }
  bindNavigation(bindee: React.Component, alternateId?: string): EventSubscription | null {
    // This is something that we likely won't need, as it's usually for changing tabs,
    // but is technically something TODO
    console.warn('binding to navigation events is not supported in web');
    return null;
  }
}
