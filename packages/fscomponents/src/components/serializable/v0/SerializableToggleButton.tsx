import { ComponentClass } from 'react';
import { ViewStyle } from 'react-native';
import { ToggleButton } from '../../ToggleButton';

export interface SerializableToggleButtonProps {
  state?: boolean;
  disableAnimation?: boolean;

  // Styles
  containerInactiveColor?: string;
  containerActiveColor?: string;
  wrapperStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  containerActiveStyle?: ViewStyle;
  containerPinStyle?: ViewStyle;
  containerPinActiveStyle?: ViewStyle;
}

export const SerializableToggleButton: ComponentClass<SerializableToggleButtonProps> =
  ToggleButton as ComponentClass<SerializableToggleButtonProps>;
