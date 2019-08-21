import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import screenWrapper from '../components/screenWrapper';
import { AppConfigType } from '../types';
import { NativeModules } from 'react-native';
const { CodePush } = NativeModules;
import NativeConstants from '../lib/native-constants';
import { FSAppBase } from './FSAppBase';
import DevMenu from '../components/DevMenu';

export class FSApp extends FSAppBase {
  constructor(appConfig: AppConfigType) {
    super(appConfig);

    if (CodePush) {
      CodePush.getUpdateMetadata(CodePush.codePushUpdateStateRunning).then((version: any) => {
        if (version) {
          this.appConfig.codePushVersionLabel = version.label;
        }
      });
    }

    this.startApp();
  }

  registerScreens(): void {
    const { screens } = this.appConfig;
    const enhancedScreens = Object.keys(screens).map(key => {
      const component = screens[key];

      return {
        key,
        Screen: screenWrapper(component, this.appConfig, this.api)
      };
    });

    if (this.shouldShowDevMenu()) {
      enhancedScreens.unshift({
        key: 'devMenu',
        Screen: screenWrapper(DevMenu, this.appConfig, this.api)
      });
    }

    enhancedScreens.forEach(({ key, Screen }) => {
      Navigation.registerComponent(key, () => props => {
        return (
          <Provider store={this.store}>
            <Screen {...props}/>
          </Provider>
        );
      }
      , () => Screen);
    });
  }

  shouldShowDevMenu(): boolean {
    return NativeConstants && NativeConstants.ShowDevMenu && NativeConstants.ShowDevMenu === 'true';
  }

  startApp(): void {
    Navigation.events().registerAppLaunchedListener(() => {
      const {
        appType,
        bottomTabsId,
        bottomTabsOptions,
        defaultOptions,
        screen,
        tabs
      } = this.appConfig;

      if (defaultOptions) {
        Navigation.setDefaultOptions(defaultOptions);
      }

      if (appType === 'singleScreen' && screen) {
        Navigation.setRoot({ root: { component: screen }})
        .catch(err => console.warn('FSApp setRoot error: ', err));
      } else if (tabs && tabs.length) {
        Navigation.setRoot({
          root: {
            bottomTabs: {
              id: bottomTabsId || 'bottomTabsId',
              children: tabs.map(tab => ({ component: tab })),
              options: bottomTabsOptions
            }
          }
        }).catch(err => console.warn('FSApp setRoot error: ', err));
      } else {
        throw new Error('invalide settings for screens and appType in appConfig');
      }
    });
  }
}
