import type React from 'react';

import type { EventSubscription } from 'react-native';

import type {
  AppConfigType,
  DrawerConfig,
  NavLayout,
  NavLayoutStackChildren,
  NavModal,
  NavOptions,
} from '../types';

import pushRoute, { overwrite } from './push-route';

export interface GenericNavProp {
  appConfig: AppConfigType;
  history: any;
  modals: NavModal[];
  toggleDrawerFn?: (config: DrawerConfig) => void;
  updateModals: (modals: NavModal[]) => void;
}

export default class Navigator {
  constructor(private readonly props: GenericNavProp) {}

  public async push(layout: NavLayout, alternateId?: string): Promise<any> {
    pushRoute(layout, this.props.history, this.props.appConfig, alternateId);
  }

  public async pop(options?: NavOptions, alternateId?: string): Promise<any> {
    this.props.history.goBack();
  }

  public async popToRoot(options?: NavOptions, alternateId?: string): Promise<any> {
    if (
      this.props.appConfig.screen &&
      this.props.appConfig.screens[this.props.appConfig.screen.name]
    ) {
      this.props.history.push(
        this.props.appConfig.screens[this.props.appConfig.screen.name]?.path || '/'
      );
    } else {
      this.props.history.push('/');
    }
  }

  public async popTo(options?: NavOptions, alternateId?: string): Promise<any> {
    if (alternateId) {
      if (this.props.appConfig.screens[alternateId]) {
        this.props.history.push(this.props.appConfig.screens[alternateId]?.path || '/');
      } else {
        console.error(`Unknown screen: ${alternateId}`);
      }
    } else {
      console.warn('Specify a screen to pop to.');
    }
  }

  public async setStackRoot(layout: NavLayout, alternateId?: string): Promise<any> {
    pushRoute(layout, this.props.history, this.props.appConfig);
  }

  public async showStackedModal(layout: NavLayout | NavLayoutStackChildren): Promise<any> {
    if (layout.component) {
      this.props.modals.push({
        layout,
      });
    }
  }

  public async showModal(layout: NavLayout): Promise<any> {
    if (layout.stack && layout.stack.children) {
      for (let loop = 0; loop < layout.stack.children.length; loop++) {
        await this.showModal(layout.stack.children[loop] as NavLayoutStackChildren);
      }
    }
    await this.showStackedModal(layout);
    this.props.updateModals(this.props.modals);
  }

  public async dismissModal(options?: NavOptions, alternateId?: string): Promise<any> {
    this.props.modals.pop();
    this.props.updateModals(this.props.modals);
  }

  public async dismissAllModals(options?: NavOptions): Promise<any> {
    this.props.modals = [];
    this.props.updateModals(this.props.modals);
  }

  public async updateProps(newProps: object, alternateId?: string): Promise<any> {
    overwrite(newProps, this.props.history, this.props.appConfig);
  }

  public mergeOptions(options: NavOptions, alternateId?: string): void {
    if (options.sideMenu && this.props.toggleDrawerFn) {
      if (options.sideMenu.left && options.sideMenu.left.visible !== undefined) {
        this.props.toggleDrawerFn({
          side: 'left',
          to: options.sideMenu.left.visible ? 'open' : 'closed',
        });
      } else if (options.sideMenu.right && options.sideMenu.right.visible !== undefined) {
        this.props.toggleDrawerFn({
          side: 'right',
          to: options.sideMenu.right.visible ? 'open' : 'closed',
        });
      }
    }
  }

  public bindNavigation(bindee: React.Component, alternateId?: string): EventSubscription | null {
    // This is something that we likely won't need, as it's usually for changing tabs,
    // but is technically something TODO
    console.warn('binding to navigation events is not supported in web');
    return null;
  }

  public handleDeepLink(options: unknown): void {
    console.error('handleDeepLink is no longer part of react-native-navigation');
  }

  public setOnNavigatorEvent(): void {
    console.error(
      'setOnNavigatorEvent is no longer part of react-native-navigation. ' +
        'Please use navigator.bindNavigation(this) to bind events, then reference ' +
        'https://wix.github.io/react-native-navigation/#/docs/events'
    );
  }

  public resetTo(options: { screen: string; title: string; animated: boolean }): void {
    console.warn('resetTo has been deprecated. ' + 'Please use setStackRoot');

    this.setStackRoot({
      component: {
        name: options.screen,
        options: {
          topBar: {
            title: {
              text: options.title,
            },
          },
        },
      },
    }).catch((error) => {
      console.error(error);
    });
  }

  public setStyle(options: { navBarTitleTextCentered: boolean }): void {
    console.warn(
      'setStyle has been deprecated. ' +
        "Please use mergeOptions({\n  topBar: {\n    alignment: 'center'\n  }\n}) instead"
    );
  }

  public setTabBadge(options: {
    tabIndex: number;
    badge: number | string | null;
    badgeColor?: string;
  }): void {
    console.warn(
      'setTabBadge has been deprecated. ' +
        "Please use mergeOptions({\n  bottomTab: {\n    badge: '1',\n    " +
        "badgeColor: 'rgb(255, 255, 255)',\n    " +
        'icon: iconImageSource\n  }\n}, componentIdOfTab) instead'
    );
  }

  public setTitle(options: { title: string }): void {
    console.warn(
      'setTitle has been deprecated. ' +
        "Please use mergeOptions({\n  topBar: {\n    title: 'title\\n  }\n}) instead"
    );
  }

  public switchToTab(options: { tabIndex: number }): void {
    console.warn(
      'switchToTab has been deprecated. ' +
        'Please use mergeOptions({\n  bottomTabs: {\n    currentTabIndex: 0\n  }\n}) instead'
    );
  }
}
