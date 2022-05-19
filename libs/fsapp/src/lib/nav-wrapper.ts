import type { EventSubscription } from 'react-native-navigation';
import { Navigation } from 'react-native-navigation';

import type { NavLayout, NavModal, NavOptions, Tab } from '../types';

export interface GenericNavProp {
  componentId: string;
  tabs: Tab[];
}

export default class Navigator {
  constructor(props: GenericNavProp, updateModals?: (modals: NavModal[]) => void) {
    this.componentId = props.componentId;
    this.tabs = props.tabs;
  }

  private readonly componentId: string;
  private readonly tabs: Tab[];

  public async push(layout: NavLayout, alternateId?: string): Promise<any> {
    return Navigation.push(alternateId || this.componentId, layout);
  }

  public async pop(options?: NavOptions, alternateId?: string): Promise<any> {
    return Navigation.pop(alternateId || this.componentId, options);
  }

  public async popToRoot(options?: NavOptions, alternateId?: string): Promise<any> {
    return Navigation.popToRoot(alternateId || this.componentId, options);
  }

  public async popTo(options?: NavOptions, alternateId?: string): Promise<any> {
    return Navigation.popTo(alternateId || this.componentId, options);
  }

  public async setStackRoot(layout: NavLayout, alternateId?: string): Promise<any> {
    return Navigation.setStackRoot(alternateId || this.componentId, layout);
  }

  public async showModal(layout: NavLayout): Promise<unknown> {
    return Navigation.showModal(layout);
  }

  public async dismissModal(options?: NavOptions, alternateId?: string): Promise<any> {
    return Navigation.dismissModal(alternateId || this.componentId, options);
  }

  public async dismissAllModals(options?: NavOptions): Promise<any> {
    return Navigation.dismissAllModals(options);
  }

  public async updateProps(newProps: object, alternateId?: string): Promise<any> {
    Navigation.updateProps(alternateId || this.componentId, newProps);
  }

  public mergeOptions(options: NavOptions, alternateId?: string): void {
    Navigation.mergeOptions(alternateId || this.componentId, options);
  }

  public bindNavigation(bindee: React.Component, alternateId?: string): EventSubscription | null {
    return Navigation.events().bindComponent(bindee, alternateId || this.componentId);
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

    this.mergeOptions({
      topBar: {
        title: {
          alignment: options.navBarTitleTextCentered ? 'center' : 'fill',
        },
      },
    });
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
    const icon =
      this.tabs[options.tabIndex]?.icon || this.tabs[options.tabIndex]?.options?.bottomTab?.icon;
    if (icon) {
      this.mergeOptions(
        {
          bottomTab: {
            badge: options.badge !== null ? options.badge.toString() : undefined,
            badgeColor: options.badgeColor,
            icon,
          },
        },
        this.tabs[options.tabIndex]?.id
      );
    }
  }

  public setTitle(options: { title: string }): void {
    console.warn(
      'setTitle has been deprecated. ' +
        "Please use mergeOptions({\n  topBar: {\n    title: 'title\\n  }\n}) instead"
    );

    this.mergeOptions({
      topBar: {
        title: {
          text: options.title,
        },
      },
    });
  }

  public switchToTab(options: { tabIndex: number }): void {
    console.warn(
      'switchToTab has been deprecated. ' +
        'Please use mergeOptions({\n  bottomTabs: {\n    currentTabIndex: 0\n  }\n}) instead'
    );

    this.mergeOptions({
      bottomTabs: {
        currentTabIndex: options.tabIndex,
      },
    });
  }
}
