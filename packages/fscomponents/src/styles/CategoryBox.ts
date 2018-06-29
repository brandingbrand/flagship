import {
  ImageStyle,
  RegisteredStyle,
  StyleSheet,
  TextStyle,
  ViewStyle
} from 'react-native';
export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  boxOuter: {
    padding: 10,
    backgroundColor: 'white'
  },
  boxInner: {
    alignItems: 'center'
  },
  boxText: {
    fontSize: 15,
    fontWeight: '500'
  }
});
