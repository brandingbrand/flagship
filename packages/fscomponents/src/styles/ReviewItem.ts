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
    paddingBottom: 8
  },
  title: {
    fontWeight: 'bold'
  },
  indicator: {
    marginLeft: -3,
    marginBottom: 2
  },
  verified: {
    color: '#c45500',
    fontSize: 12,
    fontWeight: 'bold'
  },
  helpful: {
    color: '#555',
    fontSize: 14
  },
  recommended: {
    color: '#000',
    fontSize: 15
  },
  user: {
    color: '#555'
  },
  button: {
    width: 120,
    marginTop: 8,
    marginRight: 10
  }
});
