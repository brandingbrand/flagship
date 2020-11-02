import { Image, StyleProp, TextStyle, ViewStyle } from 'react-native';
import React from 'react';

type autoCapitalizeType = 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';

interface Config {
  onIconPress?: () => void;
  icon?: Image;
  showIcon?: boolean;
  title?: string;
  placeholder?: string;
  onValueChange?: () => void;
}
interface TrackColor {
  true: string | null;
  false: string | null;
}

interface ControlLabel {
  normal: ViewStyle;
}

export interface FieldOptions {
  template?: <T>(value: T) => JSX.Element | null;
  placeholder?: string;
  placeholderTextColor?: string;
  returnKeyType?: string;
  autoCorrect?: boolean;
  keyboardType?: string;
  autoCapitalize?: autoCapitalizeType;
  onSubmitEditing?: () => void;
  config: Config;
  secureTextEntry?: boolean;
  password?: boolean;
  hidden?: boolean;
  label?: string;
  trackColor?: TrackColor;
  thumbTintColor?: string;
  stylesheet?: StyleProp<ViewStyle & TextStyle>;
  controlLabel?: ControlLabel;
  nullOption?: boolean;
  onValueChange?: () => void;
  error?: string;
  help?: React.ReactNode;
}
