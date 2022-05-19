import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  boxInner: {
    alignItems: 'center',
  },
  boxOuter: {
    backgroundColor: 'white',
    padding: 10,
  },
  boxText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
