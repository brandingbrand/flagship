import { AppRegistry } from 'react-native';
import { AppConfigType } from '../types';
import { FSAppBase, WebApplication } from './FSAppBase';
import App from '../components/DrawerRouter.web';
import DevMenu from '../components/DevMenu.web';
import { Store } from 'redux';
import AppRouter from '../lib/app-router';

export class FSApp extends FSAppBase {
  constructor(appConfig: AppConfigType) {
    super(appConfig);
    if (!appConfig.serverSide) {
      this.startApp().catch(e => console.error(e));
    }
  }

  registerScreens(): void {
    if (this.shouldShowDevMenu()) {
      this.appConfig.screens = {
        devMenu: DevMenu,
        ...this.appConfig.screens
      };
      if (this.appConfig.devMenuPath) {
        this.appConfig.screens.devMenu.path = this.appConfig.devMenuPath;
      }
    }

    AppRegistry.registerComponent('Flagship', () => App);
  }

  shouldShowDevMenu(): boolean {
    return __DEV__;
  }

  async startApp(): Promise<void> {
    await this.initApp();
    if (this.appConfig.routerConfig) {
      await this.initRouter();
    }

    const startFn = requestAnimationFrame || ((cb: () => void) => cb());
    const startCallback = () => {
      let rootTag: HTMLElement | null = null;
      if (this.appConfig.root) {
        if (typeof this.appConfig.root === 'string') {
          rootTag = document.querySelector(this.appConfig.root);
        } else {
          rootTag = this.appConfig.root;
        }
      }
      if (rootTag === null) {
        rootTag = document.getElementById('root');
      }
      AppRegistry.runApplication('Flagship', {
        rootTag,
        initialProps: {
          appConfig: this.appConfig,
          api: this.api,
          store: this.store
        }
      });
    };

    startFn(startCallback);
  }

  async initRouter(): Promise<void> {
    const appRouter = new AppRouter(this.appConfig);
    await appRouter.loadRoutes();
  }

  getApp(appConfig?: AppConfigType, store?: Store): WebApplication | undefined {
    // @ts-ignore: Is set in react-native-web
    if (AppRegistry.getApplication) {
      const config = appConfig || this.appConfig;
      // @ts-ignore: Is set in react-native-web
      return AppRegistry.getApplication('Flagship', {
        initialProps: {
          appConfig: config,
          api: this.api,
          store: store || this.store
        }
      });
    }
    return undefined;
  }
}
