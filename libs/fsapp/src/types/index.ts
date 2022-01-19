import { Analytics } from '@brandingbrand/fsengage';
import { FSNetworkRequestConfig } from '@brandingbrand/fsnetwork';
import {
  Layout,
  LayoutComponent,
  LayoutStack,
  LayoutStackChildren,
  ModalOptions,
  Options,
  OptionsTopBarButton,
} from 'react-native-navigation';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { ImageRequireSource, ModalProps, ViewStyle } from 'react-native';
import { PathFunction } from 'path-to-regexp';
import type { Request } from 'express';
import { Middleware } from 'redux';

export interface DrawerType {
  screen: string;
  passProps?: Record<string, any>;
}

export interface DrawerConfig {
  side: 'left' | 'right';
  to?: 'open' | 'closed' | 'toggle';
}

export interface Drawer {
  left?: {
    screen: string;
    passProps?: any;
    disableOpenGesture?: boolean;
    fixedWidth?: number;
  };
  right?: {
    screen: string;
    passProps?: any;
    disableOpenGesture?: boolean;
    fixedWidth?: number;
  };
  style?: {
    drawerShadow?: boolean;
    contentOverlayColor?: string;
    leftDrawerWidth?: number;
    rightDrawerWidth?: number;
    shouldStretchDrawer?: boolean;
  };
  type?: string;
  animationType?: string;
  disableOpenGesture?: boolean;
  webSlideContainer?: boolean;
  webWidth?: number;
  webDuration?: number;
  webOpacity?: number;
  webOverlayOpacity?: number;
  webLeftBackgroundColor?: string;
  webRightBackgroundColor?: string;
}

export interface Screen {
  screen: string;
  title?: string;
  passProps?: any;
}

export interface RoutableComponentClass extends React.ComponentClass<any> {
  path?: string;
  toPath?: PathFunction;
  paramKeys?: any[];
  cache?: number;
  loadInitialData?: (data: SSRData, req: Request) => Promise<SSRData>;
  // Set to true to call next immediately if this is matched
  instantNext?: boolean;
  // Function to call to determine programmatically whether to call next
  // Includes data after running loadInitialState
  shouldNext?: (data: SSRData, req: Request) => Promise<boolean>;
}

export interface SSRData {
  initialState: any;
  variables: any;
}

export interface AppConfigType {
  screens: Record<string, RoutableComponentClass>;
  appType?: 'singleScreen';
  packageJson?: Record<string, any>; // TODO: deprecated, insecure - should be removed after the transition
  version?: string; // TODO: mark version & basename as required after the transition
  codePushVersionLabel?: string;
  webBasename?: string;
  env?: Record<string, any>;
  remote?: FSNetworkRequestConfig;
  tabs?: Tab[];
  drawer?: Drawer;
  variables?: Record<string, any>;
  initialState?: any;
  reducers?: any;
  webRouterType?: string;
  webRouterProps?: Record<string, any>;
  analytics?: Analytics;
  devMenuScreens?: NavLayoutComponent[];
  popToRootOnTabPressAndroid?: boolean;
  serverSide?: boolean;
  devMenuPath?: string;
  location?: Location; // Use to provide a server-side location to router in DrawerRouter.web.tsx
  root?: HTMLElement | string;
  screen?: NavLayoutComponent;
  screenWeb?: Screen;
  defaultOptions?: Options;
  bottomTabsId?: string;
  bottomTabsOptions?: Options;
  routerConfig?: RouterConfig;
  storeMiddleware?: Middleware[];
  notFoundRedirect?: RoutableComponentClass | NavLayout | true;
  uncachedData?: (initialState: any, req?: Request) => Promise<SSRData>;
  cachedData?: (initialState: any, req?: Request) => Promise<SSRData>;

  /**
   * Only affects Web.
   *
   * If the client should hydrate server-rendered HTML.
   */
  hydrate?: boolean;
}

export interface Tab extends LayoutComponent {
  id?: string;
  label?: string;
  title?: string;
  icon?: ImageRequireSource;
  selectedIcon?: ImageRequireSource;
}

export interface NavButton {
  button: OptionsTopBarButton;
  action: (params: any) => void;
}

export interface NavigatorButtons {
  [key: string]: NavButton[];
}

export interface NavigatorEvent {
  id: string;
  type: string;
}

export interface Location<T = any> {
  pathname: string;
  search: string;
  hash: string;
  state: T;
}

export interface NavModalOptions extends ModalOptions {
  modalProps?: ModalProps;
  style?: ViewStyle;
  backdropStyle?: ViewStyle;
}

export interface NavOptions extends Options {
  modal?: NavModalOptions;
  title?: string;
}

export interface NavLayoutComponent extends LayoutComponent {
  options?: NavOptions;
}

export interface NavLayoutStackChildren extends LayoutStackChildren {
  component?: NavLayoutComponent;
}

export interface NavLayoutStack extends LayoutStack {
  children?: NavLayoutStackChildren[];
}

export interface NavLayout extends Layout {
  stack?: NavLayoutStack;
  component?: NavLayoutComponent;
}

export interface NavModal {
  layout: NavLayout;
}

export interface PublishedPage {
  id: string;
  path: string | null;
  content: string;
  pageId: string;
  title: string;
  dataInputs: string[];
  defaultInputs: string[];
}

export interface PropValue {
  [key: string]: PropValue | boolean | string | number | string[];
}

export interface LayoutBuilderObject {
  type: string;
  childObjects?: LayoutBuilderObject[];
  props?: PropValue;
  publishedPages?: PublishedPage[];
}

export interface RouteProps {
  id?: string;
  query?: CommerceTypes.ProductQuery;
  // I don't exactly know how this will work yet, we will probably end up changing the way
  // we pass props anyway
}

export interface Route {
  screen: string;
  passProps?: RouteProps;
  tabIndex?: number;
}

export interface RouterConfig {
  [key: string]: Route;
}

export interface CMSRoutesConfig {
  [key: string]: PublishedPage;
}

export interface CombinedRouter {
  [key: string]: PublishedPage | Route;
}
