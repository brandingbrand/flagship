import { AppRegistry } from 'react-native';

import type { Store } from 'redux';

import DevMenu from '../components/DevMenu.web';
import App from '../components/DrawerRouter.web';
import type { AppConfigType } from '../types';

import type { WebApplication } from './FSAppBase';
import { FSAppBase } from './FSAppBase';

export class FSApp extends FSAppBase {
  constructor(appConfig: AppConfigType) {
    super(appConfig);
    if (!appConfig.serverSide) {
      this.startApp().catch((error) => {
        console.error(error);
      });
    }
  }

  public registerScreens(): void {
    if (this.shouldShowDevMenu()) {
      this.appConfig.screens = {
        devMenu: DevMenu,
        ...this.appConfig.screens,
      };

      if (this.appConfig.devMenuPath && this.appConfig.screens.devMenu) {
        this.appConfig.screens.devMenu.path = this.appConfig.devMenuPath;
      }
    }

    AppRegistry.registerComponent('Flagship', () => App);
  }

  public shouldShowDevMenu(): boolean {
    return __DEV__;
  }

  public async startApp(): Promise<void> {
    await this.initApp();

    const startFn =
      requestAnimationFrame ||
      ((cb: () => void) => {
        cb();
      });
    const startCallback = () => {
      let rootTag: HTMLElement | null = null;
      if (this.appConfig.root) {
        rootTag =
          typeof this.appConfig.root === 'string'
            ? document.querySelector(this.appConfig.root)
            : this.appConfig.root;
      }
      if (rootTag === null) {
        rootTag = document.querySelector('#root');
      }
      AppRegistry.runApplication('Flagship', {
        rootTag,
        hydrate: this.appConfig.hydrate,
        initialProps: {
          appConfig: this.appConfig,
          api: this.api,
          store: this.store,
          appRouter: this.appRouter,
        },
      });
    };

    startFn(startCallback);
  }

  public getApp(appConfig?: AppConfigType, store?: Store): WebApplication | undefined {
    // @ts-expect-error: Is set in react-native-web
    if (AppRegistry.getApplication) {
      const config = appConfig || this.appConfig;
      // @ts-expect-error: Is set in react-native-web
      return AppRegistry.getApplication('Flagship', {
        initialProps: {
          appConfig: config,
          api: this.api,
          store: store || this.store,
        },
      });
    }
    return undefined;
  }
}
