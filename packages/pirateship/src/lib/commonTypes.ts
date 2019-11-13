import { ImageURISource } from 'react-native';
import { OptionsTopBarButton } from 'react-native-navigation';
import { NavWrapper } from '@brandingbrand/fsapp';

export interface ScreenProps {
  isWebModal?: boolean;
  onNav: (handler: (event: any) => void) => void;
  navigator: NavWrapper;
}

export interface NavButton {
  button: OptionsTopBarButton;
  action: (params: any) => void;
}

export interface GridItem {
  title: string;
  image: ImageURISource;
  path: string;
}
