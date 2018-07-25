import {
  ImageStyle,
  RegisteredStyle,
  StyleSheet,
  TextStyle,
  ViewStyle
} from 'react-native';
export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 3
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center'
  },
  full: {
    flex: 1,
    width: '100%'
  },
  buttonInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginRight: 5
  }
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
  disabled: '#aaaaaa'
};

export const stylesSize = StyleSheet.create({
  large: {
    height: 48
  },
  medium: {
    height: 38
  },
  small: {
    height: 28
  }
});

export const stylesTextSize = StyleSheet.create({
  large: {
    fontSize: 18
  },
  medium: {
    fontSize: 14
  },
  small: {
    fontSize: 12
  }
});
