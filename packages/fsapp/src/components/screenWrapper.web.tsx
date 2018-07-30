import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { ModalScreen, Screen } from 'react-native-navigation';
import FSNetwork from '@brandingbrand/fsnetwork';
import qs from 'qs';
import pushRoute from '../lib/push-route';
import { AppConfigType, DrawerConfig } from '../types';

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1
  },
  devNoteContainer: {
    position: 'absolute',
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

export interface GenericScreenDispatchProp {
  navigator: {
    push: (params: Screen) => void;
    showModal: (params: ModalScreen) => void;
    dismissModal: () => void;
    pop: () => void;
    toggleDrawer: (config: DrawerConfig) => void;
    popToRoot: () => void;
    setOnNavigatorEvent: () => void;
    [key: string]: Function;
  };
  hideDevMenu: () => void;
}

export interface GenericScreenProp extends GenericScreenDispatchProp {
  appConfig: AppConfigType;
  api: FSNetwork;
  href: string;
  match: any;
  location: any;
  history: any;
}

export default function wrapScreen(
  PageComponent: any,
  appConfig: AppConfigType,
  api: FSNetwork,
  toggleDrawerFn?: (config: DrawerConfig) => void
): React.ComponentClass<GenericScreenProp> & {
  WrappedComponent: React.ComponentType<GenericScreenProp>;
} {
  if (!PageComponent) {
    throw new Error('no PageComponent passed to wrapScreen.web');
  }

  class GenericScreen extends Component<GenericScreenProp> {
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

    openDevMenu = () => {
      this.props.navigator.showModal({
        screen: 'devMenu',
        title: 'FLAGSHIP Dev Menu'
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
      if (PageComponent.name === 'DevMenu') {
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
      let passProps = {};

      if (location && location.search) {
        passProps = {
          ...qs.parse(location.search, { ignoreQueryPrefix: true }),
          ...match.params
        };
      }

      return (
        <PageComponent
          {...this.props}
          {...passProps}
          appConfig={appConfig}
          api={api}
        />
      );
    }
  }

  function mapDispatchToProps(
    dispatch: any,
    ownProps: GenericScreenProp
  ): GenericScreenDispatchProp {
    const { history } = ownProps;

    return {
      navigator: {
        push: route => pushRoute(route, history, appConfig),
        showModal: route => pushRoute(route, history, appConfig),
        dismissModal: () => console.log('dismiss modal'),
        pop: () => history.goBack(),
        toggleDrawer: config => toggleDrawerFn && toggleDrawerFn(config),
        popToRoot: () => console.log('navigator popToRoot'),
        setOnNavigatorEvent: () => console.log('navigator setOnNavigatorEvent'),
        setTitle: () => console.log('navigator setTitle')
      },
      hideDevMenu: () => null
    };
  }

  return connect(null, mapDispatchToProps)(GenericScreen);
}
