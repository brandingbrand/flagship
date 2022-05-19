import React, { Component } from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import type FSNetwork from '@brandingbrand/fsnetwork';

import qs from 'qs';

import { setGlobalData } from '../actions/globalDataAction';
import type { GenericNavProp } from '../lib/nav-wrapper.web';
import Navigator from '../lib/nav-wrapper.web';
import type { AppConfigType, DrawerConfig, NavModal } from '../types';

import NavRender from './Navigator.web';

// hack to avoid ts complaint about certain web-only properties not being valid
const StyleSheetCreate: (obj: any) => StyleSheet.NamedStyles<any> = StyleSheet.create;

const styles = StyleSheetCreate({
  screenContainer: {
    flex: 1,
    flexBasis: 'auto',
  },
  devNoteContainer: {
    position: 'fixed',
    bottom: 0,
    right: 0,
  },
  devNote: {
    paddingLeft: 5,
    paddingRight: 5,
    color: 'white',
    fontSize: 15,
    backgroundColor: 'rgba(0,0,0,0.36)',
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
  api: FSNetwork;
  href: string;
  match: any;
  location: Location;
}

export interface GenericScreenState {
  navModals: NavModal[];
}

const wrapScreen = (
  PageComponent: any,
  appConfig: AppConfigType,
  api: FSNetwork,
  toggleDrawerFn?: (config: DrawerConfig) => void
): any => {
  if (!PageComponent) {
    throw new Error('no PageComponent passed to wrapScreen.web');
  }

  class GenericScreen extends Component<GenericScreenProp, GenericScreenState> {
    constructor(props: GenericScreenProp) {
      super(props);
      this.showDevMenu = __DEV__ || (appConfig.env && appConfig.env.isFLAGSHIP);
      this.state = {
        navModals: [],
      };
      this.navigator = new Navigator({
        ...props,
        toggleDrawerFn,
        appConfig,
        updateModals: this.updateModals,
        modals: props.modals || [],
      });
    }

    private readonly navigator: Navigator;
    private readonly showDevMenu: boolean;

    private readonly updateModals = (navModals: NavModal[]): void => {
      this.setState({ navModals });
    };

    private readonly onDismiss = (index: number): void => {
      this.state.navModals.splice(index, 1);
      this.setState({
        navModals: this.state.navModals,
      });
    };

    private readonly openDevMenu = () => {
      this.navigator
        .push({
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
        })
        .catch((error) => {
          console.warn('openDevMenu SHOWMODAL error:', error);
        });
    };

    private readonly renderVersion = () => {
      // DEV feature
      if (!this.showDevMenu || PageComponent.name === 'DevMenu' || this.props.devMenuHidden) {
        return null;
      }

      const versionlabel =
        appConfig.version || (appConfig.packageJson && appConfig.packageJson.version) || '';

      return (
        <TouchableOpacity onPress={this.openDevMenu} style={styles.devNoteContainer}>
          <Text style={styles.devNote}>{`${versionlabel}`}</Text>
        </TouchableOpacity>
      );
    };

    private readonly renderPage = () => {
      const { location, match } = this.props;
      let passProps = {
        ...match.params,
      };

      if (location && location.search) {
        passProps = {
          ...qs.parse(location.search, { ignoreQueryPrefix: true }),
          ...passProps,
        };
      }

      if (PageComponent.matchConvert) {
        passProps = PageComponent.matchConvert(passProps);
      }

      return (
        <PageComponent
          {...this.props}
          {...passProps}
          api={api}
          appConfig={appConfig}
          navigator={this.navigator}
        />
      );
    };

    public componentDidMount(): void {
      const component = PageComponent.WrappedComponent || PageComponent;

      if (appConfig.analytics && !component.disableTracking) {
        let url = `${location.protocol}//${location.hostname}`;

        if (this.props.location) {
          url += this.props.location.pathname + this.props.location.search;
        }

        appConfig.analytics.screenview(component, { url });
      }
    }

    public render(): JSX.Element {
      return (
        <View style={styles.screenContainer}>
          {this.renderPage()}
          {this.renderVersion()}
          <NavRender
            {...this.props}
            appConfig={appConfig}
            modals={this.state.navModals}
            navigator={this.navigator}
            onDismiss={this.onDismiss}
          />
        </View>
      );
    }
  }

  const mapStateToProps = (state: any, ownProps: GenericScreenProp): GenericScreenStateProp => ({
    devMenuHidden: state.global.devMenuHidden,
  });

  const mapDispatchToProps = (
    dispatch: any,
    ownProps: GenericScreenProp
  ): GenericScreenDispatchProp => ({
    hideDevMenu: () => dispatch(setGlobalData({ devMenuHidden: true })),
  });

  return connect(mapStateToProps, mapDispatchToProps)(GenericScreen);
};

export default wrapScreen;
