import { EventSubscription, Navigation } from 'react-native-navigation';
import { AppConfigType, NavLayout, NavModal, NavOptions, Tab } from '../types';
import { hrefToNav } from './helpers';

export interface GenericNavProp {
  componentId: string;
  tabs?: Tab[];
  appConfig?: AppConfigType;
}

export default class Navigator {
  componentId: string;
  tabs?: Tab[];
  appConfig?: AppConfigType;
  constructor(props: GenericNavProp, updateModals?: (modals: NavModal[]) => void) {
    this.componentId = props.componentId;
    this.tabs = props.tabs;
    if (props.tabs) {
      console.warn('Navigator.tabs is deprecated');
    }
    this.appConfig = props.appConfig;
    if (!props.appConfig) {
      console.warn('Navigator.appConfig will be required in a future version of Flagship');
    }
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
  // tslint:disable-next-line: cyclomatic-complexity
  async openUrl(
    href: string,
    alternateId?: string,
    openStyle?: 'push' | 'root',
    stayOnTab?: boolean
  ): Promise<boolean> {
    if (this.appConfig) {
      const navMatch = hrefToNav(href, this.appConfig);
      if (navMatch) {
        const toOpen = openStyle || navMatch.screen.defaultOpen || 'push';
        const tabToOpen = alternateId || navMatch.screen.defaultTab;
        try {
          if (toOpen === 'push') {
            await this.push(navMatch.layout, tabToOpen);
          } else {
            await this.setStackRoot(navMatch.layout, tabToOpen);
          }
          if (stayOnTab !== false && tabToOpen) {
            let tabIndex = -1;
            this.appConfig.tabs?.forEach((tab: Tab, index: number) => {
              if (tab.id === tabToOpen) {
                tabIndex = index;
              }
            });
            if (tabIndex !== -1) {
              this.mergeOptions({
                bottomTabs: {
                  currentTabIndex: tabIndex
                }
              });
            }
          }
          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
      }
    } else {
      console.warn('openUrl will only work with a Navigator with appConfig configured');
    }
    return false;
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
    const tabs = this.appConfig?.tabs || this.tabs;
    if (tabs) {
      const icon = tabs[options.tabIndex].icon ||
        tabs[options.tabIndex].options?.bottomTab?.icon;
      if (icon) {
        this.mergeOptions({
          bottomTab: {
            badge: options.badge !== null ? options.badge.toString() : undefined,
            badgeColor: options.badgeColor,
            icon
          }
        }, tabs[options.tabIndex].id);
      }
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
