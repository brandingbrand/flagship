import React, { Component, ComponentClass, ComponentType } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import {
  EventSubscription,
  Navigation,
  NavigationButtonPressedEvent,
  Options,
  OptionsTopBar} from 'react-native-navigation';
import FSNetwork from '@brandingbrand/fsnetwork';
import { setGlobalData } from '../actions/globalDataAction';
import { AppConfigType, DrawerConfig, NavButton } from '../types';
import NativeConstants from '../lib/native-constants';
import EnvSwitcher from '../lib/env-switcher';

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    flexBasis: 'auto'
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
  componentId: string;
  appConfig: AppConfigType;
  api: FSNetwork;
  testID: string;
}

export default function wrapScreen(
  PageComponent: any,
  appConfig: AppConfigType,
  api: FSNetwork,
  toggleDrawerFn?: (config: DrawerConfig) => void
): ComponentClass<GenericScreenProp> & {
  WrappedComponent: ComponentType<GenericScreenProp>;
} {
  const pageOptions: Options = PageComponent.options;
  const pageTopBar: OptionsTopBar = PageComponent.options && PageComponent.options.topBar;
  class GenericScreen extends Component<GenericScreenProp> {
    static options: Options = {
      ...pageOptions,
      topBar: {
        ...pageTopBar,
        rightButtons: (PageComponent.rightButtons || []).map((b: NavButton) => b.button),
        leftButtons: (PageComponent.leftButtons || []).map((b: NavButton) => b.button)
      }
    };

    navigationEventListener: EventSubscription | null;
    bottomTabEventListener: EventSubscription | null;
    showDevMenu: boolean;

    constructor(props: GenericScreenProp) {
      super(props);

      this.navigationEventListener = null;
      this.bottomTabEventListener = null;
      this.showDevMenu =
        (NativeConstants &&
          NativeConstants.ShowDevMenu &&
          NativeConstants.ShowDevMenu === 'true') ||
        (appConfig.env && appConfig.env.isFLAGSHIP);
    }

    navigationButtonPressed = (event: NavigationButtonPressedEvent): void => {
      const navButtons = [
        ...(PageComponent.rightButtons || []),
        ...(PageComponent.leftButtons || [])
      ];

      navButtons.forEach(btn => {
        if (event.buttonId === btn.button.id) {
          btn.action(this.props);
        }
      });
    }

    componentDidMount(): void {
      const component = PageComponent.WrappedComponent || PageComponent;

      this.navigationEventListener = Navigation.events().bindComponent(this);

      if (!__DEV__ && appConfig.analytics && !component.disableTracking) {
        appConfig.analytics.screenview(component, {
          url: component.name
        });
      }
    }

    componentWillUnmount(): void {
      if (this.navigationEventListener) {
        this.navigationEventListener.remove();
      }
    }

    openDevMenu = () => {
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'devMenu',
              passProps: {
                hideDevMenu: this.props.hideDevMenu
              },
              options: {
                topBar: {
                  title: {
                    text: 'FLAGSHIP Dev Menu'
                  }
                }
              }
            }
          }]
        }
      })
      .catch(err => console.warn('openDevMenu SHOWMODAL error: ', err));
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

    renderPage = () => {
      return (
        <PageComponent
          {...this.props}
          appConfig={appConfig}
          api={api}
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
