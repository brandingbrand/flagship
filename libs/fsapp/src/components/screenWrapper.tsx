import React, { Component } from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type {
  EventSubscription,
  NavigationButtonPressedEvent,
  Options,
  OptionsTopBar,
} from 'react-native-navigation';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';

import type FSNetwork from '@brandingbrand/fsnetwork';

import { setGlobalData } from '../actions/globalDataAction';
import EnvSwitcher from '../lib/env-switcher';
import NativeConstants from '../lib/native-constants';
import type { GenericNavProp } from '../lib/nav-wrapper';
import Navigator from '../lib/nav-wrapper';
import type { AppConfigType, DrawerConfig, NavButton } from '../types';

const styles = StyleSheet.create({
  devNote: {
    color: 'white',
    fontSize: 15,
    paddingLeft: 5,
    paddingRight: 5,
  },
  devNoteContainer: {
    backgroundColor: 'rgba(0,0,0,0.36)',
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
  screenContainer: {
    flex: 1,
    flexBasis: 'auto',
  },
});

export interface GenericScreenStateProp {
  devMenuHidden: boolean;
}

export interface GenericScreenDispatchProp {
  hideDevMenu: () => void;
}

export interface GenericScreenProp
  extends GenericScreenStateProp,
    GenericScreenDispatchProp,
    GenericNavProp {
  appConfig: AppConfigType;
  api: FSNetwork;
  testID: string;
}

const wrapScreen = (
  PageComponent: any,
  appConfig: AppConfigType,
  api: FSNetwork,
  toggleDrawerFn?: (config: DrawerConfig) => void
): any => {
  // Note: in RNN v2, PageComponent.options type is a function `(passProps: Props) => Options`
  // the transformation code below for backward-compatibility purpose will only work
  // if the incoming value is not a function
  const pageOptions: Options = PageComponent.options;
  const pageTopBar: OptionsTopBar = PageComponent.options && PageComponent.options.topBar;
  class GenericScreen extends Component<GenericScreenProp> {
    public static options: Options =
      typeof PageComponent.options === 'function'
        ? PageComponent.options
        : {
            ...pageOptions,
            topBar: {
              ...pageTopBar,
              rightButtons: (PageComponent.rightButtons || []).map((b: NavButton) => b.button),
              leftButtons: (PageComponent.leftButtons || []).map((b: NavButton) => b.button),
            },
          };

    constructor(props: GenericScreenProp) {
      super(props);
      this.navigationEventListener = null;
      this.bottomTabEventListener = null;
      this.showDevMenu =
        (NativeConstants &&
          NativeConstants.ShowDevMenu &&
          NativeConstants.ShowDevMenu === 'true') ||
        (appConfig.env && appConfig.env.isFLAGSHIP);
      this.navigator = new Navigator({
        componentId: props.componentId,
        tabs: (props.appConfig || appConfig).tabs || [],
      });
    }

    private readonly navigator: Navigator;
    private navigationEventListener: EventSubscription | null;
    private readonly showDevMenu: boolean;
    public bottomTabEventListener: EventSubscription | null;

    public readonly navigationButtonPressed = (event: NavigationButtonPressedEvent): void => {
      const navButtons = [
        ...(PageComponent.rightButtons || []),
        ...(PageComponent.leftButtons || []),
      ];

      for (const btn of navButtons) {
        if (event.buttonId === btn.button.id) {
          btn.action(this.navigator);
        }
      }
    };

    private readonly openDevMenu = () => {
      Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                name: 'devMenu',
                passProps: {
                  hideDevMenu: this.props.hideDevMenu,
                },
                options: {
                  topBar: {
                    title: {
                      text: 'FLAGSHIP Dev Menu',
                    },
                  },
                },
              },
            },
          ],
        },
      }).catch((error) => {
        console.warn('openDevMenu SHOWMODAL error:', error);
      });
    };

    private readonly renderVersion = () => {
      // DEV feature
      if (!this.showDevMenu || this.props.testID === 'devMenu' || this.props.devMenuHidden) {
        return null;
      }

      const versionlabel =
        appConfig.version || (appConfig.packageJson && appConfig.packageJson.version) || '';

      return (
        <TouchableOpacity
          accessibilityLabel="development menu"
          accessible
          onPress={this.openDevMenu}
          style={styles.devNoteContainer}
        >
          <Text style={styles.devNote}>
            {`${versionlabel}`}
            {appConfig.codePushVersionLabel || ''}
            {` env:${EnvSwitcher.envName || 'prod'}`}
          </Text>
        </TouchableOpacity>
      );
    };

    private readonly renderPage = () => (
      <PageComponent {...this.props} api={api} appConfig={appConfig} navigator={this.navigator} />
    );

    public componentDidMount(): void {
      const component = PageComponent.WrappedComponent || PageComponent;

      this.navigationEventListener = Navigation.events().bindComponent(this);

      if (!__DEV__ && appConfig.analytics && !component.disableTracking) {
        appConfig.analytics.screenview(component, {
          url: component.name,
        });
      }
    }

    public componentWillUnmount(): void {
      if (this.navigationEventListener) {
        this.navigationEventListener.remove();
      }
    }

    public render(): JSX.Element {
      return (
        <View style={styles.screenContainer}>
          {this.renderPage()}
          {this.renderVersion()}
        </View>
      );
    }
  }

  const mapStateToProps = (state: any, ownProps: GenericScreenProp): GenericScreenStateProp => ({
    devMenuHidden: state.global.devMenuHidden,
  });

  const mapDispatchToProps = (dispatch: any): GenericScreenDispatchProp => ({
    hideDevMenu: () => dispatch(setGlobalData({ devMenuHidden: true })),
  });

  return connect(mapStateToProps, mapDispatchToProps)(GenericScreen);
};

export default wrapScreen;
