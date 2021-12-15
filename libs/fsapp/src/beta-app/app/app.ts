import type { AppConstructor } from './types';

import { BackHandler, Linking } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { DEV_KEEP_SCREEN, LAST_SCREEN_KEY } from '../constants';
import { StaticImplements } from '../utils';
import { FSAppBase } from './app.base';

export { APP_CONFIG_TOKEN, APP_VERSION_TOKEN, API_TOKEN } from './app.base';

@StaticImplements<AppConstructor>()
export class FSAppBeta extends FSAppBase {
  public async startApplication(): Promise<void> {
    Linking.addEventListener('url', async ({ url }) => this.router.open(url));

    const url = await(
      this.config.getInitialURL ? this.config.getInitialURL() : Linking.getInitialURL()
    );

    if (url) {
      setTimeout(() => {
        void this.router.open(url);
      });
    } else {
      const keepLastScreen = await AsyncStorage.getItem(DEV_KEEP_SCREEN);
      if (keepLastScreen === 'true') {
        const url = await AsyncStorage.getItem(LAST_SCREEN_KEY);
        if (url) {
          setTimeout(() => {
            void this.router.open(url);
          });
        }
      }
    }
  }

  public async stopApplication(): Promise<void> {
    BackHandler.exitApp();
  }
}
