import { InjectedProps } from '../DigitalWalletProvider';
import { StyleProp, ViewStyle } from 'react-native';

export interface ApplePayButtonProps extends InjectedProps {
  applePayOnPress: () => void;
  buttonStyle?: 'black' | 'white' | 'white-with-line';
  style?: StyleProp<ViewStyle>;
}
