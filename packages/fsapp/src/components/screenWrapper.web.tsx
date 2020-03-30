import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import FSNetwork from '@brandingbrand/fsnetwork';
import { setGlobalData } from '../actions/globalDataAction';
import qs from 'qs';
import NavRender from './Navigator.web';
import Navigator, { GenericNavProp } from '../lib/nav-wrapper.web';
import { AppConfigType, DrawerConfig, NavModal } from '../types';

const StyleSheetCreate: any = StyleSheet.create;

const styles = StyleSheetCreate({
  screenContainer: {
    flex: 1,
    flexBasis: 'auto'
  },
  devNoteContainer: {
    position: 'fixed',
    bottom: 0,
    right: 0
  },
  devNote: {
    paddingLeft: 5,
    paddingRight: 5,
    color: 'white',
    fontSize: 15,
    backgroundColor: 'rgba(0,0,0,0.36)'
  }
});

export interface GenericScreenStateProp {
  devMenuHidden: boolean;
}

export interface GenericScreenDispatchProp {
  hideDevMenu: () => void;
}

export interface GenericScreenProp extends GenericScreenStateProp,
  GenericScreenDispatchProp, GenericNavProp {
  api: FSNetwork;
  href: string;
  match: any;
  location: any;
}

export interface GenericScreenState {
  navModals: NavModal[];
}

export default function wrapScreen(
  PageComponent: any,
  appConfig: AppConfigType,
  api: FSNetwork,
  toggleDrawerFn?: (config: DrawerConfig) => void
): any {
  if (!PageComponent) {
    throw new Error('no PageComponent passed to wrapScreen.web');
  }

  class GenericScreen extends Component<GenericScreenProp, GenericScreenState> {
    navigator: Navigator;
    showDevMenu: boolean;

    constructor(props: GenericScreenProp) {
      super(props);
      this.showDevMenu =
        __DEV__ ||
        (appConfig.env && appConfig.env.isFLAGSHIP);
      this.state = {
        navModals: []
      };
      this.navigator = new Navigator({
        appConfig,
        modals: [],
        toggleDrawerFn,
        updateModals: this.updateModals,
        ...props
      });
    }
    updateModals = (navModals: NavModal[]): void => {
      this.setState({ navModals });
    }

    componentDidMount(): void {
      const component = PageComponent.WrappedComponent || PageComponent;

      if (appConfig.analytics && !component.disableTracking) {
        let url = location.protocol + '//' + location.hostname;

        if (this.props.location) {
          url += this.props.location.pathname + this.props.location.search;
        }

        appConfig.analytics.screenview(component, { url });
      }
    }

    onDismiss = (index: number): void => {
      this.state.navModals.splice(index, 1);
      this.setState({
        navModals: this.state.navModals
      });
    }

    openDevMenu = () => {
      this.navigator.push({
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
      }).catch(err => console.warn('openDevMenu SHOWMODAL error: ', err));
    }

    render(): JSX.Element {
      return (
        <View style={styles.screenContainer}>
          {this.renderPage()}
          {this.renderVersion()}
          <NavRender
            appConfig={appConfig}
            modals={this.state.navModals}
            navigator={this.navigator}
            onDismiss={this.onDismiss}
            {...this.props}
          />
        </View>
      );
    }

    renderVersion = () => {
      // DEV feature
      if (!this.showDevMenu || PageComponent.name === 'DevMenu' || this.props.devMenuHidden) {
        return null;
      }

      const versionlabel =
        appConfig.version || appConfig.packageJson && appConfig.packageJson.version || '';

      return (
        <TouchableOpacity style={styles.devNoteContainer} onPress={this.openDevMenu}>
          <Text style={styles.devNote}>{`${versionlabel}`}</Text>
        </TouchableOpacity>
      );
    }

    renderPage = () => {
      const { location, match } = this.props;
      let passProps = {
        ...match.params
      };

      if (location && location.search) {
        passProps = {
          ...qs.parse(location.search, { ignoreQueryPrefix: true }),
          ...passProps
        };
      }

      if (PageComponent.matchConvert) {
        passProps = PageComponent.matchConvert(passProps);
      }

      return (
        <PageComponent
          {...this.props}
          {...passProps}
          appConfig={appConfig}
          api={api}
          navigator={this.navigator}
        />
      );
    }
  }

  function mapStateToProps(state: any, ownProps: GenericScreenProp): GenericScreenStateProp {
    return {
      devMenuHidden: state.global.devMenuHidden
    };
  }

  function mapDispatchToProps(
    dispatch: any,
    ownProps: GenericScreenProp
  ): GenericScreenDispatchProp {
    return {
      hideDevMenu: () => dispatch(setGlobalData({ devMenuHidden: true }))
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(GenericScreen);
}
