import type { ComponentClass } from 'react';
import React, { Component } from 'react';

import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter, Route, StaticRouter, Switch } from 'react-router-dom';

import type FSNetwork from '@brandingbrand/fsnetwork';

import type { Key } from 'path-to-regexp';
import pathToRegexp, { compile } from 'path-to-regexp';

import Drawer from '../components/Drawer.web';
import type { GenericScreenProp } from '../components/screenWrapper.web';
import screenWrapper from '../components/screenWrapper.web';
import type AppRouter from '../lib/app-router';
import { pathForScreen } from '../lib/helpers';
import type { AppConfigType, DrawerConfig, RoutableComponentClass } from '../types';

import { NotFound } from './NotFound';

// hack to avoid ts complaint about certain web-only properties not being valid
const StyleSheetCreate: (obj: any) => StyleSheet.NamedStyles<any> = StyleSheet.create;
const DEFAULT_DRAWER_WIDTH = '60%';
const DEFAULT_DRAWER_DURATION = '0.3s';
const DEFAULT_DRAWER_OVERLAY_OPACITY = 0.5;

export interface AppStateTypes {
  leftDrawerOpen: boolean;
  rightDrawerOpen: boolean;
}

export interface PropType {
  appConfig: AppConfigType;
  api: FSNetwork;
  store: any;
  appRouter: AppRouter;
}

export default class DrawerRouter extends Component<PropType, AppStateTypes> {
  constructor(props: PropType) {
    super(props);

    const { api, appConfig, appRouter } = this.props;

    this.drawerConfig = this.generateAppStyles(appConfig);
    const { leftDrawer, rightDrawer } = this.generateDrawers(appConfig, api);
    this.leftDrawerComponent = leftDrawer;
    this.rightDrawerComponent = rightDrawer;

    this.screensRoutes = this.generateRoutes(appConfig, api, appRouter);

    this.state = {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
    };
  }

  private readonly leftDrawerComponent?: ComponentClass<GenericScreenProp>;
  private readonly rightDrawerComponent?: ComponentClass<GenericScreenProp>;
  private readonly drawerConfig: {
    drawerWidth: string;
    drawerDuration: React.ReactText;
    drawerOverlayOpacity: number;
    drawerLeftBackgroundColor?: string;
    drawerRightBackgroundColor?: string;
    appStyle: StyleSheet.NamedStyles<any>;
  };

  private readonly screensRoutes: JSX.Element[];

  private readonly generateDrawers = (appConfig: AppConfigType, api: FSNetwork) => {
    const { drawer = {} } = appConfig;
    let leftDrawer: ComponentClass<GenericScreenProp> | undefined;
    let rightDrawer: ComponentClass<GenericScreenProp> | undefined;

    if (drawer && drawer.left && drawer.left.screen) {
      const lScreenName = drawer.left.screen;
      const leftDrawerComponent = appConfig.screens[lScreenName];
      leftDrawer = screenWrapper(leftDrawerComponent, appConfig, api, this.toggleDrawer);
    }

    if (drawer && drawer.right && drawer.right.screen) {
      const rScreenName = drawer.right.screen;
      const rightDrawerComponent = appConfig.screens[rScreenName];
      rightDrawer = screenWrapper(rightDrawerComponent, appConfig, api, this.toggleDrawer);
    }

    return { leftDrawer, rightDrawer };
  };

  private readonly generateRoutes = (
    appConfig: AppConfigType,
    api: FSNetwork,
    appRouter: AppRouter
  ) => {
    const { routerConfig, screen, screens } = appConfig;

    const routes: any = {};
    if (routerConfig) {
      // getWebRouterConfig() is a method that returns the app routes plus the NA defined routes
      // in a format/order that will correctly create the routing for web
      // this means no duplicate paths and if the route has a handle (:productId) the app version
      // takes precedence, if its a static route the NA defined route takes precedence
      const config = (appRouter && appRouter.getWebRouterConfig()) || { ...routerConfig };

      for (const path of Object.keys(config)) {
        // NA defined routes go to the CMS screen
        const s = config[path].screen || 'CMS';
        if (!routes[s]) {
          routes[s] = [];
        }
        routes[s].push(path);
      }
    }

    // per-inject parsed path to screen object,
    // so it can be filled with passProps efficiently
    for (const key of Object.keys(screens)) {
      const path = screens[key]?.path || routes[key];
      // pathToRegexp is supposed to be able to take a string or array of string
      // however it throws an error if its an array of ONE string (multiple works)
      // - if there are multiple paths, leave as array, otherwise convert back to string
      const newPath = Array.isArray(path) && path.length === 1 ? path[0] : path;
      const screen = screens[key];
      if (screen && path) {
        const keys: Key[] = [];
        screen.path = newPath;
        pathToRegexp(newPath, keys);
        // compile() cannot take an array, we don't need toPath for array values regardless
        if (typeof newPath === 'string') {
          screen.toPath = compile(newPath);
        }
        screen.paramKeys = keys;
      }
    }

    if (!screen || !screen.name) {
      throw new Error('screen is required in appConfig for web');
    }

    const rootComponent = (
      <Route
        exact
        key={-1}
        path="/"
        render={this.renderDrawerWrapper(
          screenWrapper(screens[screen.name], appConfig, api, this.toggleDrawer)
        )}
      />
    );

    const screensRoutes = Object.keys(screens).map((key, i) => {
      const path = pathForScreen(screens[key] as RoutableComponentClass, key);
      const component = screens[key];

      return (
        <Route
          exact
          key={i}
          path={path}
          render={this.renderDrawerWrapper(
            screenWrapper(component, appConfig, api, this.toggleDrawer)
          )}
        />
      );
    });

    if (appConfig.notFoundRedirect) {
      if (typeof appConfig.notFoundRedirect === 'function') {
        screensRoutes.push(
          <Route
            key="not-found"
            path="*"
            render={this.renderDrawerWrapper(
              screenWrapper(appConfig.notFoundRedirect, appConfig, api, this.toggleDrawer)
            )}
          />
        );
      } else {
        screensRoutes.push(
          <Route
            key="not-found"
            path="*"
            render={this.renderDrawerWrapper(
              screenWrapper(NotFound(appConfig.notFoundRedirect), appConfig, api, this.toggleDrawer)
            )}
          />
        );
      }
    }

    return [rootComponent, ...screensRoutes];
  };

  private readonly generateAppStyles = (appConfig: AppConfigType) => {
    const { drawer = {} } = appConfig;
    const drawerWidth = '90%' || drawer.webWidth || DEFAULT_DRAWER_WIDTH;
    const drawerDuration = drawer.webDuration || DEFAULT_DRAWER_DURATION;
    const drawerOverlayOpacity = drawer.webOverlayOpacity || DEFAULT_DRAWER_OVERLAY_OPACITY;
    const drawerLeftBackgroundColor = drawer.webLeftBackgroundColor;
    const drawerRightBackgroundColor = drawer.webRightBackgroundColor;
    const appStyle = StyleSheetCreate({
      appDrawerOpen: {
        overflowX: 'hidden',
      },
      appDrawerDefault: {
        flex: 1,
        flexBasis: 'auto',
      },
      container: {
        transitionDuration: drawerDuration,
        width: '100%',
        flex: 1,
        flexBasis: 'auto',
      },
      containerDrawerLeftOpen: {
        marginLeft: drawer.webSlideContainer === false ? undefined : drawerWidth,
      },
      containerDrawerRightOpen: {
        marginLeft: drawer.webSlideContainer === false ? undefined : `-${drawerWidth}`,
      },
      containerOverlay: {
        backgroundColor: 'black',
        opacity: 0,
        position: 'fixed',
        height: '100%',
        width: 0,
      },
      containerOverlayActive: {
        width: '100%',
        opacity: drawerOverlayOpacity,
        transitionProperty: 'opacity',
        transitionDuration: drawerDuration,
      },
    });

    return {
      drawerWidth,
      drawerDuration,
      drawerOverlayOpacity,
      drawerLeftBackgroundColor,
      drawerRightBackgroundColor,
      appStyle,
    };
  };

  private readonly toggleDrawer = (config: DrawerConfig): void => {
    const { side } = config;
    const { to } = config;

    // The following code assumes that only one drawer can be open at a time.
    if (side === 'left') {
      this.setState({
        leftDrawerOpen: to === 'toggle' ? !this.state.leftDrawerOpen : to === 'open',
        rightDrawerOpen: false,
      });
    } else {
      this.setState({
        leftDrawerOpen: false,
        rightDrawerOpen: to === 'toggle' ? !this.state.rightDrawerOpen : to === 'open',
      });
    }
  };

  private readonly closeDrawers = () => {
    this.setState({
      leftDrawerOpen: false,
      rightDrawerOpen: false,
    });
  };

  public render(): JSX.Element {
    const { appConfig, store } = this.props;
    const { packageJson, webBasename, webRouterProps, webRouterType } = appConfig;

    let Router: typeof React.Component;

    switch (webRouterType) {
      case 'hash':
        Router = HashRouter;
        break;
      case 'static':
        Router = StaticRouter;
        break;
      default:
        Router = BrowserRouter;
        break;
    }
    const routerProps = {
      basename:
        webBasename || (packageJson && packageJson.flagship && packageJson.flagship.webPath) || '/',
      ...webRouterProps,
    };

    return (
      <Provider store={store}>
        <Router {...routerProps}>
          <Switch location={appConfig.location}>{this.screensRoutes}</Switch>
        </Router>
      </Provider>
    );
  }

  private readonly renderDrawerWrapper = (component: any) => {
    const {
      appStyle,
      drawerDuration,
      drawerLeftBackgroundColor,
      drawerRightBackgroundColor,
      drawerWidth,
    } = this.drawerConfig;

    return (props: any) => (
      <View
        style={[
          (this.state.leftDrawerOpen || this.state.rightDrawerOpen) && appStyle.appDrawerOpen,
          appStyle.appDrawerDefault,
        ]}
      >
        {this.leftDrawerComponent ? (
          <Drawer
            backgroundColor={drawerLeftBackgroundColor}
            component={this.leftDrawerComponent}
            duration={drawerDuration}
            isOpen={this.state.leftDrawerOpen}
            orientation="left"
            width={drawerWidth}
            {...props}
          />
        ) : null}
        {this.rightDrawerComponent ? (
          <Drawer
            backgroundColor={drawerRightBackgroundColor}
            component={this.rightDrawerComponent}
            duration={drawerDuration}
            isOpen={this.state.rightDrawerOpen}
            orientation="right"
            width={drawerWidth}
            {...props}
          />
        ) : null}
        <View
          style={[
            appStyle.container,
            this.state.leftDrawerOpen && appStyle.containerDrawerLeftOpen,
            this.state.rightDrawerOpen && appStyle.containerDrawerRightOpen,
          ]}
        >
          {React.createElement(component, props)}
        </View>
        <TouchableWithoutFeedback onPress={this.closeDrawers}>
          <View
            style={[
              appStyle.containerOverlay,
              (this.state.leftDrawerOpen || this.state.rightDrawerOpen) &&
                appStyle.containerOverlayActive,
            ]}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  };
}
