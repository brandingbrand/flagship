import React, { Component, ComponentClass } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Provider } from 'react-redux';
import screenWrapper, { GenericScreenProp } from '../components/screenWrapper';
import {
  BrowserRouter,
  HashRouter,
  Route,
  StaticRouter,
  Switch
} from 'react-router-dom';
import pathToRegexp, { Key } from 'path-to-regexp';
import { AppConfigType, DrawerConfig } from '../types';
import Drawer from '../components/Drawer.web';
import FSNetwork from '@brandingbrand/fsnetwork';

// hack to avoid ts complaint about certain web-only properties not being valid
const StyleSheetCreate: any = StyleSheet.create;
const DEFAULT_DRAWER_WIDTH = '60%';
const DEFAULT_DRAWER_DURATION = '0.3s';
const DEFAULT_DRAWER_OVERLAY_OPACITY = 0.5;

export interface AppStateTypes {
  leftDrawerOpen: boolean;
  rightDrawerOpen: boolean;
}

export interface PropType {
  appConfig: AppConfigType;
  api: any;
  store: any;
}

export default class DrawerRouter extends Component<PropType, AppStateTypes> {
  leftDrawerComponent?: ComponentClass<GenericScreenProp>;
  rightDrawerComponent?: ComponentClass<GenericScreenProp>;
  drawerConfig: any;
  screensRoutes: Route[];

  constructor(props: any) {
    super(props);

    const { appConfig, api } = this.props;

    this.drawerConfig = this.generateAppStyles(appConfig);
    const { leftDrawer, rightDrawer } = this.generateDrawers(appConfig, api);
    this.leftDrawerComponent = leftDrawer;
    this.rightDrawerComponent = rightDrawer;

    this.screensRoutes = this.generateRoutes(appConfig, api);

    this.state = {
      leftDrawerOpen: false,
      rightDrawerOpen: false
    };
  }

  generateDrawers = (appConfig: AppConfigType, api: FSNetwork) => {
    const { drawer = {} } = appConfig;
    let leftDrawer: ComponentClass<GenericScreenProp> | undefined;
    let rightDrawer: ComponentClass<GenericScreenProp> | undefined;

    if (drawer && drawer.left && drawer.left.screen) {
      const lScreenName = drawer.left.screen;
      const leftDrawerComponent = appConfig.screens[lScreenName];
      leftDrawer = screenWrapper(
        leftDrawerComponent,
        appConfig,
        api,
        this.toggleDrawer
      );
    }

    if (drawer && drawer.right && drawer.right.screen) {
      const rScreenName = drawer.right.screen;
      const rightDrawerComponent = appConfig.screens[rScreenName];
      rightDrawer = screenWrapper(
        rightDrawerComponent,
        appConfig,
        api,
        this.toggleDrawer
      );
    }

    return { leftDrawer, rightDrawer };
  }

  generateRoutes = (appConfig: AppConfigType, api: FSNetwork) => {
    const { screens, screen } = appConfig;

    // per-inject parsed path to screen object,
    // so it can be filled with passProps efficiently
    Object.keys(screens).forEach(key => {
      const path = screens[key].path;

      if (path) {
        const keys: Key[] = [];

        pathToRegexp(path, keys);
        screens[key].toPath = pathToRegexp.compile(path);
        screens[key].paramKeys = keys;
      }
    });

    if (!screen || !screen.screen) {
      throw new Error('screen is required in appConfig for web');
    }

    const rootComponent = (
      <Route
        exact
        key={-1}
        path={'/'}
        render={this._renderDrawerWrapper(
          screenWrapper(
            screens[screen.screen],
            appConfig,
            api,
            this.toggleDrawer
          )
        )}
      />
    );

    const screensRoutes = Object.keys(screens).map<any>((key, i): any => {
      const path = screens[key].path ? screens[key].path : `/_s/${key}/`;
      const component = screens[key];

      return (
        <Route
          exact
          key={i}
          path={path}
          render={this._renderDrawerWrapper(
            screenWrapper(component, appConfig, api, this.toggleDrawer)
          )}
        />
      );
    });

    return [rootComponent, ...screensRoutes];
  }

  generateAppStyles = (appConfig: AppConfigType) => {
    const { drawer = {} as any } = appConfig;
    const drawerWidth = '90%' || drawer.webWidth || DEFAULT_DRAWER_WIDTH;
    const drawerDuration = drawer.webDuration || DEFAULT_DRAWER_DURATION;
    const drawerOverlayOpacity = drawer.webOverlayOpacity || DEFAULT_DRAWER_OVERLAY_OPACITY;
    const drawerLeftBackgroundColor = drawer.webLeftBackgroundColor;
    const drawerRightBackgroundColor = drawer.webRightBackgroundColor;
    const appStyle = StyleSheetCreate({
      appDrawerOpen: {
        overflowX: 'hidden'
      },
      appDrawerDefault: {
        flex: 1
      },
      container: {
        transitionDuration: drawerDuration,
        width: '100%',
        flex: 1
      },
      containerDrawerLeftOpen: {
        marginLeft: drawerWidth
      },
      containerDrawerRightOpen: {
        marginLeft: '-' + drawerWidth
      },
      containerOverlay: {
        backgroundColor: 'black',
        opacity: 0,
        position: 'fixed',
        height: '100%',
        width: 0
      },
      containerOverlayActive: {
        width: '100%',
        opacity: drawerOverlayOpacity,
        transitionProperty: 'opacity',
        transitionDuration: drawerDuration
      }
    });

    return {
      drawerWidth,
      drawerDuration,
      drawerOverlayOpacity,
      drawerLeftBackgroundColor,
      drawerRightBackgroundColor,
      appStyle
    };
  }

  toggleDrawer = (config: DrawerConfig): void => {
    const side = config.side;
    const to = config.to;

    // The following code assumes that only one drawer can be open at a time.
    if (side === 'left') {
      this.setState({
        leftDrawerOpen: to ? to === 'open' : !this.state.leftDrawerOpen,
        rightDrawerOpen: false
      });
    } else {
      this.setState({
        leftDrawerOpen: false,
        rightDrawerOpen: to ? to === 'open' : !this.state.rightDrawerOpen
      });
    }
  }

  closeDrawers = () => {
    this.setState({
      leftDrawerOpen: false,
      rightDrawerOpen: false
    });
  }

  render(): JSX.Element {
    const { appConfig, store } = this.props;
    const {
      packageJson,
      webBasename,
      webRouterType,
      webRouterProps
    } = appConfig;

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
      basename: webBasename
        || (packageJson && packageJson.flagship && packageJson.flagship.webPath) || '/',
      ...webRouterProps
    };

    return (
      <Provider store={store}>
        <Router {...routerProps}>
          <Switch>
            {this.screensRoutes}
          </Switch>
        </Router>
      </Provider>
    );
  }

  _renderDrawerWrapper = (component: any) => {
    const {
      drawerWidth,
      drawerDuration,
      drawerLeftBackgroundColor,
      drawerRightBackgroundColor,
      appStyle
    } = this.drawerConfig;

    return (props: any) => {
      return (
        <View
          style={[
            (this.state.leftDrawerOpen || this.state.rightDrawerOpen) && appStyle.appDrawerOpen,
            appStyle.appDrawerDefault
          ]}
        >
          {this.leftDrawerComponent && (
            <Drawer
              width={drawerWidth}
              duration={drawerDuration}
              isOpen={this.state.leftDrawerOpen}
              orientation='left'
              component={this.leftDrawerComponent}
              backgroundColor={drawerLeftBackgroundColor}
              {...props}
            />
          )}
          {this.rightDrawerComponent && (
            <Drawer
              width={drawerWidth}
              duration={drawerDuration}
              isOpen={this.state.rightDrawerOpen}
              orientation='right'
              component={this.rightDrawerComponent}
              backgroundColor={drawerRightBackgroundColor}
              {...props}
            />
          )}
          <View
            style={[
              appStyle.container,
              this.state.leftDrawerOpen && appStyle.containerDrawerLeftOpen,
              this.state.rightDrawerOpen && appStyle.containerDrawerRightOpen
            ]}
          >
            {React.createElement(component, props)}
          </View>
          <TouchableWithoutFeedback onPress={this.closeDrawers}>
            <View
              style={[
                appStyle.containerOverlay,
                (this.state.leftDrawerOpen || this.state.rightDrawerOpen) &&
                  appStyle.containerOverlayActive
              ]}
            />
          </TouchableWithoutFeedback>
        </View>
      );
    };
  }
}
