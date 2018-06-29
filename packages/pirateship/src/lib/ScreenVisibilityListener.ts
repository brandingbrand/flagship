import { ScreenVisibilityListener as RNNScreenVisibilityListener } from 'react-native-navigation';

import Analytics, { screensToIgnore } from './analytics';

export default class ScreenVisibilityListener {
  listener: RNNScreenVisibilityListener;

  constructor() {
    this.listener = new RNNScreenVisibilityListener({
      didAppear: ({ screen, startTime, endTime, commandType }) => {
        if (!__DEV__ && screen && screensToIgnore.indexOf(screen) === -1) {
          Analytics.screenview(screen, {
            url: ''
          });
        }
      }
    });
  }

  register(): void {
    this.listener.register();
  }

  unregister(): void {
    if (this.listener) {
      this.listener.unregister();
    }
  }
}
