import { ImageURISource } from 'react-native';
import {
  Navigator,
  NavigatorButton,
  NavigatorStyle,
  PushedScreen
} from 'react-native-navigation';

export interface ScreenProps {
  navigator: Navigator;
  onNav: (handler: (event: any) => void) => void;
}

export interface NavButton {
  button: NavigatorButton;
  action: (params: any) => void;
}

export interface GridItem {
  title: string;
  image: ImageURISource;
  path: string;
}

export { NavigatorStyle, PushedScreen };
