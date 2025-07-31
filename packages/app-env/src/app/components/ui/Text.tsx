import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
} from 'react-native';

import {font, palette} from '../../lib/theme';

export interface TextProps extends RNTextProps {
  type?: TextPresetKind;
}

export const Text = ({style, type = 'body', ...props}: TextProps) => {
  return (
    <RNText {...props} style={[styles.text, textPresetStyles[type], style]} />
  );
};

const styles = StyleSheet.create({
  text: {
    color: palette.neutralFg,
  },
});

export const textPresetStyles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  titleSm: {
    fontWeight: '500',
  },
  body: {},
  bodySm: {
    fontSize: 12,
  },
  buttonPrimary: {
    fontSize: 12,
    fontWeight: 'bold',
    color: palette.brandFg,
  },
  buttonPrimaryDisabled: {
    fontSize: 12,
    fontWeight: 'bold',
    color: palette.neutralFgSecondary,
  },
  buttonSecondary: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  overlay: {
    fontSize: 11,
    color: palette.overlayFg,
    textTransform: 'uppercase',
  },
  code: {
    fontSize: 12,
    fontFamily: font.monospace,
  },
  codeSm: {
    fontSize: 11,
    fontFamily: font.monospace,
  },
});
export type TextPresetKind = keyof typeof textPresetStyles;
