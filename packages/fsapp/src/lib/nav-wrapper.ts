import { EventSubscription, Navigation } from 'react-native-navigation';
import { GenericNavProp } from '../components/screenWrapper';
import { NavLayout, NavOptions } from '../types';

export default class NavigationWrapper {
  componentId: string;
  constructor(props: GenericNavProp) {
    this.componentId = props.componentId;
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
  mergeOptions(options: NavOptions, alternateId?: string): void {
    return Navigation.mergeOptions(alternateId || this.componentId, options);
  }
  bindNavigation(bindee: React.Component, alternateId?: string): EventSubscription | null {
    return Navigation.events().bindComponent(bindee, alternateId || this.componentId);
  }
  render(): JSX.Element | null {
    return null;
  }
}
