import { Analytics } from '@brandingbrand/fsengage';
import { Dictionary } from '@brandingbrand/fsfoundation';
import { FSNetworkRequestConfig } from '@brandingbrand/fsnetwork';
import { Drawer, NavigatorButton, Screen, TabScreen } from 'react-native-navigation';
import { ImageRequireSource } from 'react-native';
import { PathFunction } from 'path-to-regexp';

export interface DrawerType {
  screen: string;
  passProps?: Dictionary;
}

export interface DrawerConfig {
  side: 'left' | 'right';
  to?: 'open' | 'closed';
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
  screen?: Screen;
  packageJson?: Dictionary; // TODO: deprecated, insecure - should be removed after the transition
  version?: string; // TODO: mark version & basename as required after the transition
  codePushVersionLabel?: string;
  webBasename?: string;
  env?: Dictionary;
  remote?: FSNetworkRequestConfig;
  tabs?: TabScreen[];
  drawer?: Drawer;
  tabsStyle?: TabStyle;
  appStyle?: AppStyle;
  variables?: Dictionary;
  initialState?: any;
  reducers?: any;
  webRouterType?: string;
  webRouterProps?: Dictionary;
  analytics?: Analytics;
  devMenuScreens?: Screen[];
  popToRootOnTabPressAndroid?: boolean;
  serverSide?: boolean;
  devMenuPath?: string;
}

export interface NavButton {
  button: NavigatorButton;
  action: (params: any) => void;
}

export interface NavigatorButtons {
  [key: string]: NavButton[];
}

export interface NavigatorEvent {
  id: string;
  type: string;
}
