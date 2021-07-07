import { InjectedProps } from '../DigitalWalletProvider';
import { StyleProp, ViewStyle } from 'react-native';

export interface SerializableApplePayButtonProps extends InjectedProps {
  buttonStyle?: 'black' | 'white' | 'white-with-line';
  style?: ViewStyle;
}

export interface ApplePayButtonProps extends InjectedProps, Omit<
  SerializableApplePayButtonProps,
  'style' |
  'buttonStyle'
  > {
  applePayOnPress: () => void;
  buttonStyle?: 'black' | 'white' | 'white-with-line';
  style?: StyleProp<ViewStyle>;
}
