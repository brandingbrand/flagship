import { Analytics } from '@brandingbrand/fsengage';
import { Dictionary } from '@brandingbrand/fsfoundation';
import { FSNetworkRequestConfig } from '@brandingbrand/fsnetwork';
import {
  Layout,
  LayoutComponent,
  LayoutStack,
  LayoutStackChildren,
  Options,
  OptionsTopBarButton
} from 'react-native-navigation';
import { ImageRequireSource, ViewStyle } from 'react-native';
import { PathFunction } from 'path-to-regexp';

export interface DrawerType {
  screen: string;
  passProps?: Dictionary;
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
}

export interface Screen {
  screen: string;
  title?: string;
  passProps?: any;
}

export interface TabStyle {
  tabBarHidden?: boolean;
  tabBarButtonColor?: string;
  tabBarSelectedButtonColor?: string;
  tabBarBackgroundColor?: string;
  tabBarTranslucent?: boolean;
  tabBarTextFontFamily?: string;
  tabBarLabelColor?: string;
  tabBarSelectedLabelColor?: string;
  forceTitlesDisplay?: boolean;
  tabBarHideShadow?: boolean;
  initialTabIndex?: number;
}

export interface AppStyle extends TabStyle {
  orientation?: 'auto' | 'landscape' | 'portrait';
  bottomTabBadgeTextColor?: string;
  bottomTabBadgeBackgroundColor?: string;
  backButtonImage?: ImageRequireSource;
  hideBackButtonTitle?: boolean;
}

export interface RoutableComponentClass extends React.ComponentClass<any> {
  path?: string;
  toPath?: PathFunction;
  paramKeys?: any[];
}

export interface AppConfigType {
  screens: {
    [key: string]: RoutableComponentClass;
  };
  appType?: 'singleScreen';
  packageJson?: Dictionary; // TODO: deprecated, insecure - should be removed after the transition
  version?: string; // TODO: mark version & basename as required after the transition
  codePushVersionLabel?: string;
  webBasename?: string;
  env?: Dictionary;
  remote?: FSNetworkRequestConfig;
  tabs?: Tab[];
  drawer?: Drawer;
  variables?: Dictionary;
  initialState?: any;
  reducers?: any;
  webRouterType?: string;
  webRouterProps?: Dictionary;
  analytics?: Analytics;
  devMenuScreens?: NavLayoutComponent[];
  popToRootOnTabPressAndroid?: boolean;
  serverSide?: boolean;
  devMenuPath?: string;
  location?: Location; // Use to provide a server-side location to router in DrawerRouter.web.tsx
  screen?: NavLayoutComponent;
  screenWeb?: Screen;
  defaultOptions?: Options;
  bottomTabsId?: string;
  bottomTabsOptions?: Options;
}

export interface Tab extends LayoutComponent {
  id: string;
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

export interface NavModalOptions {
  style?: ViewStyle;
}

export interface NavOptions extends Options {
  modalContainer?: NavModalOptions;
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

export { default as NavWrapper } from '../lib/nav-wrapper';
