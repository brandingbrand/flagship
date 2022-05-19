import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  averageStyle: {
    paddingLeft: 10,
  },
  container: {
    flexDirection: 'column',
    padding: 10,
  },
  countStyle: {},
  recommendStyle: {
    paddingTop: 10,
  },
  row: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingBottom: 5,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
