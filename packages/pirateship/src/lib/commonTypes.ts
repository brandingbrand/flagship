import { ImageURISource } from 'react-native';
import { OptionsTopBarButton } from 'react-native-navigation';

export interface ScreenProps {
  componentId: string;
  onNav: (handler: (event: any) => void) => void;
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
