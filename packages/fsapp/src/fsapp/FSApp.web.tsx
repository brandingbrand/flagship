import { AppRegistry } from 'react-native';
import { AppConfigType } from '../types';
import { FSAppBase } from './FSAppBase';
import App from '../components/DrawerRouter.web';
import DevMenu from '../components/DevMenu';

export class FSApp extends FSAppBase {
  constructor(appConfig: AppConfigType) {
    super(appConfig);
    if (!appConfig.serverSide) {
      this.startApp();
    }
  }

  registerScreens(): void {
    if (this.shouldShowDevMenu()) {
      this.appConfig.screens = {
        devMenu: DevMenu as any,
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

  startApp(): void {
    const startFn = requestAnimationFrame || ((cb: any) => cb());
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
}
