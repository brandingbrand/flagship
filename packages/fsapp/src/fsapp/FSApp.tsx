import React from 'react';
import {
  BottomTabSelectedEvent,
  ComponentDidAppearEvent,
  LayoutBottomTabsChildren,
  LayoutComponent,
  Navigation
} from 'react-native-navigation';
import { Provider } from 'react-redux';
import screenWrapper from '../components/screenWrapper';
import { AppConfigType, Tab } from '../types';
import { AsyncStorage, NativeModules, Platform } from 'react-native';
const { CodePush } = NativeModules;
import NativeConstants from '../lib/native-constants';
import { FSAppBase } from './FSAppBase';
import DevMenu from '../components/DevMenu';

const LAST_SCREEN_KEY = 'lastScreen';
const DEV_KEEP_SCREEN = 'devKeepPage';

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
    const { appType, defaultOptions, popToRootOnTabPressAndroid, tabs } = this.appConfig;

    if (this.shouldShowDevMenu()) {
      Navigation.events().registerComponentDidAppearListener(this.screenChangeListener.bind(this));
    }

    if (appType !== 'singleScreen' && Platform.OS === 'android' && popToRootOnTabPressAndroid) {
      Navigation.events().registerBottomTabSelectedListener((event: BottomTabSelectedEvent) => {
        if (event.selectedTabIndex === event.unselectedTabIndex && tabs) {
          const tabId = tabs[event.selectedTabIndex].id;
          Navigation.popToRoot(tabId).catch(e => console.warn(e));
        }
      });
    }

    Navigation.events().registerAppLaunchedListener(async () => {
      if (defaultOptions) {
        Navigation.setDefaultOptions(defaultOptions);
      }

      try {
        if (appType === 'singleScreen') {
          await this.startSingleScreenApp();
        } else {
          await this.startTabApp();
        }

      } catch (e) {
        console.warn('FSApp setRoot error: ', e);
      }
    });
  }

  protected async startSingleScreenApp(): Promise<void> {
    const { screen } = this.appConfig;
    if (!screen) {
      throw new Error('screen must be defined in the app config to start a singleScreen app');
    }

    const children = [{
      component: screen
    }];

    if (this.shouldShowDevMenu()) {
      const restoredScreen = await this.getSavedScreen();
      if (restoredScreen !== undefined) {
        children.push({ component: restoredScreen });
      }
    }

    return Navigation.setRoot({
      root: {
        stack: {
          children
        }
      }
    });
  }

  protected async startTabApp(): Promise<void> {
    const {
      bottomTabsId,
      bottomTabsOptions,
      tabs
    } = this.appConfig;

    if (!Array.isArray(tabs) || tabs.length === 0) {
      throw new Error('One or more tabs must be defined in the app config to start a tabbed app');
    }

    const tabPromises = tabs.map(this.prepareTab.bind(this));
    return Navigation.setRoot({
      root: {
        bottomTabs: {
          id: bottomTabsId || 'bottomTabsId',
          children: await Promise.all(tabPromises),
          options: bottomTabsOptions
        }
      }
    });
  }

  protected async prepareTab(tab: Tab, index: number): Promise<LayoutBottomTabsChildren> {
    const { id, options, ...tabComponent } = tab;
    const children = [{
      component: tabComponent
    }];

    // Push saved screen onto the first tab stack
    if (index === 0 && this.shouldShowDevMenu()) {
      const restoredScreen = await this.getSavedScreen();
      if (restoredScreen !== undefined) {
        children.push({ component: restoredScreen });
      }
    }

    return {
      stack: {
        id,
        children,
        options
      }
    };
  }

  protected async screenChangeListener(event: ComponentDidAppearEvent): Promise<void> {
    try {
      const keepLastScreen = await AsyncStorage.getItem(DEV_KEEP_SCREEN);

      if (keepLastScreen === 'true') {
        await AsyncStorage.setItem(LAST_SCREEN_KEY, JSON.stringify(event));
      }

    } catch (e) {
      console.log('Cannot get lastScreen from AsyncStorage', e);
    }
  }

  protected async getSavedScreen(): Promise<LayoutComponent | undefined> {
    try {
      const keepLastScreen = await AsyncStorage.getItem(DEV_KEEP_SCREEN);
      if (keepLastScreen !== 'true') {
        return;
      }

      const json = await AsyncStorage.getItem(LAST_SCREEN_KEY);

      if (!json) {
        return;
      }

      const event: ComponentDidAppearEvent = JSON.parse(json);
      const { componentName, passProps } = event;

      if (!this.appConfig.screens[componentName]) {
        return;
      }

      return {
        name: componentName,
        passProps
      };

    } catch (e) {
      console.warn('Unable to restore screen', e);
      return;
    }
  }
}
