import { StyleSheet } from 'react-native';

export const grays = {
  one: '#f5f5f5',
  two: '#e9e9e9',
  three: '#dedede',
  four: '#cecece',
  five: '#adadad',
  six: '#6c6c6c',
  seven: '#494949',
  eight: '#343434',
  nine: '#212121'
};

export const color = {
  black: '#000000',
  lightGray: grays.three,
  gray: grays.six,
  darkGray: grays.eight,
  green: '#227d74',
  yellow: '#dab10e',
  white: '#ffffff',
  red: '#d0021b'
};

export const palette = {
  primary: color.green,
  secondary: color.darkGray,
  accent: color.yellow,
  error: color.red,
  background: color.white,
  surface: grays.one,
  onPrimary: color.white,
  onSecondary: color.white,
  onAccent: color.white,
  onBackground: color.black,
  onSurface: color.black,
  onError: color.white
};

export const fontSize = {
  base: 14,
  huge: 25,
  large: 16,
  small: 12
};

export const fontWeightLight = '300';
export const fontWeightNormal = '400';
export const fontWeightBold = '800';

export const padding = {
  base: 10,
  wide: 15,
  narrow: 5
};

export const border = {
  color: color.lightGray,
  width: StyleSheet.hairlineWidth,
  radius: 3
};

// Number of columns to show on product index pages, use 1 for a list view
export const pipColumns = 1;
