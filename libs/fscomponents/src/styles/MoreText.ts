import { ImageStyle, RegisteredStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  text: {
    textAlign: 'left',
  },
  textMoreLess: {
    color: '#0066DB',
    marginTop: 5,
  },
});
