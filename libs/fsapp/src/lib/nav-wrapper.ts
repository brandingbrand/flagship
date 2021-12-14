import { EventSubscription, Navigation } from 'react-native-navigation';
import { NavLayout, NavModal, NavOptions, Tab } from '../types';

export interface GenericNavProp {
  componentId: string;
  tabs: Tab[];
}

export default class Navigator {
  componentId: string;
  tabs: Tab[];
  constructor(props: GenericNavProp, updateModals?: (modals: NavModal[]) => void) {
    this.componentId = props.componentId;
    this.tabs = props.tabs;
  }
  async push(layout: NavLayout, alternateId?: string): Promise<any> {
    return Navigation.push(alternateId || this.componentId, layout);
  }
  async pop(options?: NavOptions, alternateId?: string): Promise<any> {
    return Navigation.pop(alternateId || this.componentId, options);
  }
  async popToRoot(options?: NavOptions, alternateId?: string): Promise<any> {
    return Navigation.popToRoot(alternateId || this.componentId, options);
  }
  async popTo(options?: NavOptions, alternateId?: string): Promise<any> {
    return Navigation.popTo(alternateId || this.componentId, options);
  }
  async setStackRoot(layout: NavLayout, alternateId?: string): Promise<any> {
    return Navigation.setStackRoot(alternateId || this.componentId, layout);
  }
  async showModal(layout: NavLayout): Promise<any> {
    return Navigation.showModal(layout);
  }
  async dismissModal(options?: NavOptions, alternateId?: string): Promise<any> {
    return Navigation.dismissModal(alternateId || this.componentId, options);
  }
  async dismissAllModals(options?: NavOptions): Promise<any> {
    return Navigation.dismissAllModals(options);
  }
  async updateProps(newProps: object, alternateId?: string): Promise<any> {
    return Navigation.updateProps(alternateId || this.componentId, newProps);
  }
  mergeOptions(options: NavOptions, alternateId?: string): void {
    return Navigation.mergeOptions(alternateId || this.componentId, options);
  }
  bindNavigation(bindee: React.Component, alternateId?: string): EventSubscription | null {
    return Navigation.events().bindComponent(bindee, alternateId || this.componentId);
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

    this.mergeOptions({
      topBar: {
        title: {
          alignment: options.navBarTitleTextCentered ? 'center' : 'fill'
        }
      }
    });
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
    const icon = this.tabs[options.tabIndex].icon ||
    this.tabs[options.tabIndex].options?.bottomTab?.icon;
    if (icon) {
      this.mergeOptions({
        bottomTab: {
          badge: options.badge !== null ? options.badge.toString() : undefined,
          badgeColor: options.badgeColor,
          icon
        }
      }, this.tabs[options.tabIndex].id);
    }
  }
  setTitle(options: { title: string}): void {
    console.warn('setTitle has been deprecated. ' +
      'Please use mergeOptions({\n  topBar: {\n    title: \'title\\n  }\n}) instead');

    this.mergeOptions({
      topBar: {
        title: {
          text: options.title
        }
      }
    });
  }
  switchToTab(options: { tabIndex: number}): void {
    console.warn('switchToTab has been deprecated. ' +
      'Please use mergeOptions({\n  bottomTabs: {\n    currentTabIndex: 0\n  }\n}) instead');

    this.mergeOptions({
      bottomTabs: {
        currentTabIndex: options.tabIndex
      }
    });
  }
}
