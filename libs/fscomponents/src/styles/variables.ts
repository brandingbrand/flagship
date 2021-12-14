import { StyleSheet } from 'react-native';

export * from './weights';

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

export const types = StyleSheet.create({
  title1: {
    fontSize: 44,
    lineHeight: 56
  },
  title2: {
    fontSize: 32,
    lineHeight: 36
  },
  title3: {
    fontSize: 24,
    lineHeight: 28
  },
  large: {
    fontSize: 19,
    lineHeight: 24
  },
  regular: {
    fontSize: 16,
    lineHeight: 22
  },
  small: {
    fontSize: 14,
    lineHeight: 18
  },
  caption: {
    fontSize: 12,
    lineHeight: 16
  },
  micro: {
    fontSize: 10,
    lineHeight: 12
  }
});
