import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  buttonInner: {
    alignItems: 'center',
    flex: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonView: {
    alignItems: 'center',
    flex: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    borderRadius: 3,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  full: {
    flex: 1,
    flexBasis: 'auto',
    width: '100%',
  },
  icon: {
    marginRight: 5,
  },
  text: {
    textAlign: 'center',
  },
});

export const stylesTextColor = {
  primary: '#ffffff',
  secondary: '#ffffff',
  success: '#ffffff',
  info: '#ffffff',
  warning: '#ffffff',
  alert: '#ffffff',
  dark: '#ffffff',
  light: '#555555',
  disabled: '#aaaaaa',
};

export const stylesSize = StyleSheet.create({
  large: {
    height: 48,
  },
  medium: {
    height: 38,
  },
  small: {
    height: 28,
  },
});

export const stylesTextSize = StyleSheet.create({
  large: {
    fontSize: 18,
  },
  medium: {
    fontSize: 14,
  },
  small: {
    fontSize: 12,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
