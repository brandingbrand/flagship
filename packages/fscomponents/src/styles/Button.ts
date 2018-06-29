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
    height: 40,
    paddingLeft: 10,
    paddingRight: 10
  },
  text: {
    textAlign: 'center',
    fontSize: 16
  },
  full: {
    flex: 1
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
    height: 50
  },
  small: {
    height: 30
  }
});

export const stylesTextSize = StyleSheet.create({
  large: {
    fontSize: 18
  },
  small: {
    fontSize: 13
  }
});
