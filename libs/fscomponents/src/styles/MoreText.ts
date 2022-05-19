import { StyleSheet } from 'react-native';

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

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
