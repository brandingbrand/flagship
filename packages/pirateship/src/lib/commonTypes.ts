import { ImageURISource } from 'react-native';
import { OptionsTopBarButton } from 'react-native-navigation';
import { Navigator } from '@brandingbrand/fsapp';

export interface ScreenProps {
  isWebModal?: boolean;
  onNav: (handler: (event: any) => void) => void;
  navigator: Navigator;
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
