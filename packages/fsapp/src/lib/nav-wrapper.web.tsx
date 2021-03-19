import React from 'react';
import { EventSubscription } from 'react-native';
import pushRoute, { overwrite } from './push-route';
import {
  AppConfigType,
  DrawerConfig,
  NavLayout,
  NavLayoutStackChildren,
  NavModal,
  NavOptions
} from '../types';

export interface GenericNavProp {
  appConfig: AppConfigType;
  history: any;
  modals: NavModal[];
  toggleDrawerFn?: (config: DrawerConfig) => void;
  updateModals: (modals: NavModal[]) => void;
}

export default class Navigator {
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
  async updateProps(newProps: object, alternateId?: string): Promise<any> {
    overwrite(newProps, this.props.history, this.props.appConfig);
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
  handleDeepLink(options: any): void {
    console.error('handleDeepLink is no longer part of react-native-navigation');
  }
  setOnNavigatorEvent(): void {
    console.error('setOnNavigatorEvent is no longer part of react-native-navigation. ' +
      'Please use navigator.bindNavigation(this) to bind events, then reference ' +
      'https://wix.github.io/react-native-navigation/#/docs/events');
  }
  resetTo(options: {
    screen: string;
    title: string;
    animated: boolean;
  }): void {
    console.warn('resetTo has been deprecated. ' +
      'Please use setStackRoot');

    this.setStackRoot({
      component: {
        name: options.screen,
        options: {
          topBar: {
            title: {
              text: options.title
            }
          }
        }
      }
    }).catch(e => {
      console.error(e);
    });
  }
  setStyle(options: { navBarTitleTextCentered: boolean }): void {
    console.warn('setStyle has been deprecated. ' +
      'Please use mergeOptions({\n  topBar: {\n    alignment: \'center\'\n  }\n}) instead');
  }
  setTabBadge(options: {
    tabIndex: number;
    badge: string | number | null;
    badgeColor?: string;
  }): void {
    console.warn('setTabBadge has been deprecated. ' +
      'Please use mergeOptions({\n  bottomTab: {\n    badge: \'1\',\n    ' +
      'badgeColor: \'rgb(255, 255, 255)\',\n    ' +
      'icon: iconImageSource\n  }\n}, componentIdOfTab) instead');
  }
  setTitle(options: { title: string}): void {
    console.warn('setTitle has been deprecated. ' +
      'Please use mergeOptions({\n  topBar: {\n    title: \'title\\n  }\n}) instead');
  }
  switchToTab(options: { tabIndex: number}): void {
    console.warn('switchToTab has been deprecated. ' +
      'Please use mergeOptions({\n  bottomTabs: {\n    currentTabIndex: 0\n  }\n}) instead');
  }
}
