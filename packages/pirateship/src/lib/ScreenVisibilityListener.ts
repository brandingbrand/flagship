import { EventSubscription, Navigation } from 'react-native-navigation';

import Analytics, { screensToIgnore } from './analytics';

export default class ScreenVisibilityListener {
  listener: EventSubscription | null;

  constructor() {
    this.listener = null;
  }

  register(): void {
    this.listener = Navigation.events().registerComponentDidAppearListener(
      ({componentId, componentName}) => {
        if (!__DEV__ && screen && screensToIgnore.indexOf(componentName) === -1) {
          Analytics.screenview(componentName, {
            url: ''
          });
        }
      }
    );
  }

  unregister(): void {
    if (this.listener) {
      this.listener.remove();
    }
  }
}
