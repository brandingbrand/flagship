import type { AppConfig, AppConstructor, WebApplication } from './types';

import { AppRegistry } from 'react-native';

import { StaticImplements } from '../utils';
import { AppBase } from './AppBase';

@StaticImplements<AppConstructor>()
export class App extends AppBase {
  public static async getVersion(config: AppConfig): Promise<string> {
    return config.version ?? '';
  }

  public static getApp(): WebApplication | undefined {
    if ('getApplication' in AppRegistry) {
      // @ts-ignore: Is set in react-native-web
      return AppRegistry.getApplication('Flagship', {});
    }

    return undefined;
  }

  public static shouldShowDevMenu(): boolean {
    return __DEV__;
  }
}
