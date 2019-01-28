import React, { Component, ComponentClass, ComponentType } from 'react';
import { AsyncStorage, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { Navigator, NavigatorStyle } from 'react-native-navigation';
import FSNetwork from '@brandingbrand/fsnetwork';
import { setGlobalData } from '../actions/globalDataAction';
import { AppConfigType, DrawerConfig, NavButton, NavigatorButtons, NavigatorEvent } from '../types';
import NativeConstants from '../lib/native-constants';
import EnvSwitcher from '../lib/env-switcher';

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1
  },
  devNoteContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.36)'
  },
  devNote: {
    paddingLeft: 5,
    paddingRight: 5,
    color: 'white',
    fontSize: 15
  }
});

export interface GenericScreenStateProp {
  devMenuHidden: boolean;
}

export interface GenericScreenDispatchProp {
  hideDevMenu: () => void;
}

export interface GenericScreenProp extends GenericScreenStateProp, GenericScreenDispatchProp {
  navigator: Navigator & { screenInstanceID: string };
  appConfig: AppConfigType;
  api: FSNetwork;
  testID: string;
}

let lastScreenLoaded = false;

export default function wrapScreen(
  PageComponent: any,
  appConfig: AppConfigType,
  api: FSNetwork,
  toggleDrawerFn?: (config: DrawerConfig) => void
): ComponentClass<GenericScreenProp> & {
  WrappedComponent: ComponentType<GenericScreenProp>;
} {
  class GenericScreen extends Component<GenericScreenProp> {
    static navigatorStyle: NavigatorStyle = PageComponent.navigatorStyle;
    static navigatorButtons: NavigatorButtons = {
      rightButtons: (PageComponent.rightButtons || []).map((b: NavButton) => b.button),
      leftButtons: (PageComponent.leftButtons || []).map((b: NavButton) => b.button)
    };

    extraNavigatorEventHandler: any;
    showDevMenu: boolean;

    constructor(props: GenericScreenProp) {
      super(props);

      this.extraNavigatorEventHandler = null;
      this.showDevMenu =
        (NativeConstants &&
          NativeConstants.ShowDevMenu &&
          NativeConstants.ShowDevMenu === 'true') ||
        (appConfig.env && appConfig.env.isFLAGSHIP);

      // @ts-ignore wrong type in @types/react-native-navigation
      props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);

      // DEV feature
      if (this.showDevMenu) {
        this.storeLastScreen(props);
      }
    }

    storeLastScreen = (props: GenericScreenProp) => {
      ['push', 'switchToTab', 'showModal'].forEach(action => {
        const nav: any = props.navigator;
        const originalFunc = nav[action];
        nav[action] = (...args: any[]) => {
          originalFunc.apply(props.navigator, args);
          if (args && args[0] && args[0].screen === 'devMenu') {
            return;
          }
          AsyncStorage.setItem('lastScreen', JSON.stringify({ action, args })).catch(e =>
            console.log('Cannot get lastScreen from AsyncStorage', e)
          );
        };
      });
    }

    onNavigatorEvent = (event: NavigatorEvent) => {
      if (event.type === 'NavBarButtonPress') {
        this.handleNavButtonPress(event);
      }

      if (
        event.id === 'bottomTabReselected' &&
        Platform.OS === 'android' &&
        appConfig.popToRootOnTabPressAndroid
      ) {
        this.props.navigator.popToRoot();
      }

      if (this.extraNavigatorEventHandler) {
        this.extraNavigatorEventHandler(event);
      }
    }

    handleNavButtonPress = (event: NavigatorEvent) => {
      const navButtons = [
        ...(PageComponent.rightButtons || []),
        ...(PageComponent.leftButtons || [])
      ];

      navButtons.forEach(btn => {
        if (event.id === btn.button.id) {
          btn.action(this.props);
        }
      });
    }

    componentDidMount(): void {
      const component = PageComponent.WrappedComponent || PageComponent;

      if (!__DEV__ && appConfig.analytics && !component.disableTracking) {
        appConfig.analytics.screenview(component, {
          url: component.name
        });
      }

      // DEV feature
      if (this.showDevMenu) {
        this.handlekeepLastPage().catch(e => console.log('cannot handle keep Last Page', e));
      }
    }

    handlekeepLastPage = async () => {
      if (lastScreenLoaded) {
        return;
      }
      lastScreenLoaded = true;

      const [devKeepPage, lastScreen] = await Promise.all([
        AsyncStorage.getItem('devKeepPage'),
        AsyncStorage.getItem('lastScreen')
      ]);

      if (!devKeepPage || !lastScreen) {
        return;
      }

      let parsed = null;

      try {
        parsed = JSON.parse(lastScreen);
      } catch (e) {
        return;
      }

      if (!parsed) {
        return;
      }

      if (!appConfig.screens[parsed.args && parsed.args[0].screen]) {
        return;
      }

      const nav: any = this.props.navigator;
      nav[parsed.action].apply(nav, parsed.args);
    }

    openDevMenu = () => {
      this.props.navigator.showModal({
        screen: 'devMenu',
        title: 'FLAGSHIP Dev Menu',
        passProps: { hideDevMenu: this.props.hideDevMenu }
      });
    }

    render(): JSX.Element {
      return (
        <View style={styles.screenContainer}>
          {this.renderPage()}
          {this.renderVersion()}
        </View>
      );
    }

    renderVersion = () => {
      // DEV feature
      if (!this.showDevMenu || this.props.testID === 'devMenu' || this.props.devMenuHidden) {
        return null;
      }

      const versionlabel =
        appConfig.version || appConfig.packageJson && appConfig.packageJson.version || '';

      return (
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={'development menu'}
          style={styles.devNoteContainer}
          onPress={this.openDevMenu}
        >
          <Text style={styles.devNote}>
            {`${versionlabel}`}
            {appConfig.codePushVersionLabel || ''}
            {` env:${EnvSwitcher.envName || 'prod'}`}
          </Text>
        </TouchableOpacity>
      );
    }

    setExtraNavigatorEventHandler = (handler: (event: NavigatorEvent) => void) => {
      if (typeof handler !== 'function') {
        throw new Error('onNav requires a function as parameter');
      }
      this.extraNavigatorEventHandler = handler;
    }

    renderPage = () => {
      return (
        <PageComponent
          {...this.props}
          appConfig={appConfig}
          api={api}
          onNav={this.setExtraNavigatorEventHandler}
        />
      );
    }
  }

  function mapStateToProps(state: any, ownProps: GenericScreenProp): GenericScreenStateProp {
    return {
      devMenuHidden: state.global.devMenuHidden
    };
  }

  function mapDispatchToProps(dispatch: any): GenericScreenDispatchProp {
    return {
      hideDevMenu: () => dispatch(setGlobalData({ devMenuHidden: true }))
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(GenericScreen);
}
