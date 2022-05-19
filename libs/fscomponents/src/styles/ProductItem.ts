import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  horizontalLeft: {
    width: 100,
  },
  horizontalListContainer: {
    flexDirection: 'row',
  },
  horizontalRight: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    marginTop: 10,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
