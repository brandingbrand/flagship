import { AppRegistry } from 'react-native';
import { AppConfigType } from '../types';
import { FSAppBase } from './FSAppBase';
import App from '../components/DrawerRouter.web';
import DevMenu from '../components/DevMenu';

export class FSApp extends FSAppBase {
  constructor(appConfig: AppConfigType) {
    super(appConfig);
    this.startApp();
  }

  registerScreens(): void {
    if (this.shouldShowDevMenu()) {
      this.appConfig.screens.devMenu = DevMenu as any;
    }

    AppRegistry.registerComponent('Flagship', () => App);
  }

  shouldShowDevMenu(): boolean {
    return __DEV__;
  }

  startApp(): void {
    const startFn = requestAnimationFrame || ((cb: any) => cb());
    const startCallback = () => {
      AppRegistry.runApplication('Flagship', {
        rootTag: document.getElementById('root'),
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
