import { BackHandler, Linking } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import type ReactDOMServer from 'react-dom/server';

import { DEV_KEEP_SCREEN, LAST_SCREEN_KEY } from '../constants';
import { StaticImplements } from '../utils';

import { FSAppBase } from './app.base';
import type { AppConstructor, AppServerElements } from './types';

export {
  APP_CONFIG_TOKEN,
  APP_VERSION_TOKEN,
  API_TOKEN,
  ENGAGEMENT_COMPONENT,
  ENGAGEMENT_SERVICE,
  APP_TOKEN,
} from './app.base';

@StaticImplements<AppConstructor>()
export class FSAppBeta extends FSAppBase {
  public async startApplication(): Promise<void> {
    Linking.addEventListener('url', ({ url }) => {
      this.router
        .open(url)
        .then(() => {})
        .catch(() => {});
    });

    const url = await (this.config.getInitialURL
      ? this.config.getInitialURL()
      : Linking.getInitialURL());

    if (url !== null) {
      setTimeout(() => {
        void this.router.open(url).then(() => {
          this.markStable();
        });
      });
    } else {
      const keepLastScreen = await AsyncStorage.getItem(DEV_KEEP_SCREEN);
      if (keepLastScreen === 'true') {
        const lastUrl = await AsyncStorage.getItem(LAST_SCREEN_KEY);
        if (lastUrl !== null) {
          setTimeout(() => {
            void this.router.open(lastUrl).then(() => {
              this.markStable();
            });
          });
        } else {
          this.markStable();
        }
      }
    }
  }

  public stopApplication(): void {
    this.subscriptions.unsubscribe();
    this.config.onDestroy?.();
    BackHandler.exitApp();
  }

  public getReactServerDom(): typeof ReactDOMServer {
    throw new Error('getReactServerDom() is only valid for server');
  }

  public getApplication(): AppServerElements {
    throw new Error('getApplication() is only valid for server');
  }
}
