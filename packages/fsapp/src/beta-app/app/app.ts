import type { AppConstructor } from './types';

import { BackHandler, Linking } from 'react-native';
import { Navigation } from 'react-native-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import { DEV_KEEP_SCREEN, LAST_SCREEN_KEY } from '../constants';
import { StaticImplements } from '../utils';
import { FSAppBase } from './app.base';

@StaticImplements<AppConstructor>()
export class FSAppBeta extends FSAppBase {
  public async startApplication(): Promise<void> {
    return new Promise(resolve => {
      Navigation.events().registerAppLaunchedListener(async () => {
        Linking.addEventListener('url', ({ url }) => this.router.open(url));

        const url = await Linking.getInitialURL();
        if (url) {
          await this.router.open(url);
        } else {
          const keepLastScreen = await AsyncStorage.getItem(DEV_KEEP_SCREEN);
          if (keepLastScreen === 'true') {
            const url = await AsyncStorage.getItem(LAST_SCREEN_KEY);
            if (url) {
              await this.router.open(url);
            }
          }
        }
        resolve();
      });
    });
  }

  public async stopApplication(): Promise<void> {
    BackHandler.exitApp();
  }
}
