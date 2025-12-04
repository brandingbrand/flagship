import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';

import {palette} from '../../lib/theme';

import {Text, TextPresetKind} from './Text';

export interface ButtonProps extends TouchableOpacityProps {
  textStyle?: StyleProp<TextStyle>;
  type?: ButtonPresetKind;
  size?: ButtonSizeKind;
}

export function Button({
  children,
  onPress,
  style,
  textStyle,
  type = 'primary',
  size = 'large',
  ...restProps
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, typeStyles[type], sizeStyles[size], style]}
      {...restProps}>
      {typeof children === 'string' ? (
        <Text type={textPresetMap[type]} style={textStyle}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const sizeStyles = StyleSheet.create({
  large: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
export type ButtonSizeKind = keyof typeof sizeStyles;

const typeStyles = StyleSheet.create({
  primary: {
    borderColor: palette.brandBg,
    backgroundColor: palette.brandBg,
  },
  primaryDisabled: {
    borderColor: palette.brandBgWeakest,
    backgroundColor: palette.brandBgWeakest,
  },
  secondary: {
    borderColor: palette.neutralBorder,
    backgroundColor: palette.neutralBg,
  },
});
export type ButtonPresetKind = keyof typeof typeStyles;

const textPresetMap = {
  primary: 'buttonPrimary',
  primaryDisabled: 'buttonPrimaryDisabled',
  secondary: 'buttonSecondary',
} as const satisfies Record<ButtonPresetKind, TextPresetKind>;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 1000,
  },
});
