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
    padding: 10,
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 5
  },
  countStyle: {
  },
  averageStyle: {
    paddingLeft: 10
  },
  recommendStyle: {
    paddingTop: 10
  }
});
