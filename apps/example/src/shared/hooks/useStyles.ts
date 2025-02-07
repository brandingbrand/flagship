import type {ImageStyle, TextStyle, ViewStyle} from 'react-native';

import {resolvePaletteFunction, type PaletteFunction} from '../lib/theme';

import {useTheme} from './useTheme';

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

export function createStyleSheet<S extends NamedStyles<S> | NamedStyles<any>>(
  styles: PaletteFunction<S>,
): PaletteFunction<S>;
export function createStyleSheet<S extends NamedStyles<S> | NamedStyles<any>>(
  styles: S,
): S;
export function createStyleSheet<S extends NamedStyles<S> | NamedStyles<any>>(
  styles: S | PaletteFunction<S>,
): S | PaletteFunction<S> {
  return styles;
}
export function useStyles<S extends NamedStyles<S>>(
  stylesheet: PaletteFunction<S> | S,
): Readonly<S> {
  const theme = useTheme();
  if (typeof stylesheet === 'function') {
    return resolvePaletteFunction(stylesheet, theme);
  }

  return stylesheet;
}
