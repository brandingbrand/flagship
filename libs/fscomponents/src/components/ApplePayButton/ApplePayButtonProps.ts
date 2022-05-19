import type { StyleProp, ViewStyle } from 'react-native';

import type { InjectedProps } from '../DigitalWalletProvider';

export interface ApplePayButtonProps extends InjectedProps {
  applePayOnPress: () => void;
  buttonStyle?: 'black' | 'white-with-line' | 'white';
  style?: StyleProp<ViewStyle>;
}
