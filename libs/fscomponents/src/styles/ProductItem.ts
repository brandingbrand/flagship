import { ImageStyle, RegisteredStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  label: {
    marginTop: 10,
  },
  horizontalListContainer: {
    flexDirection: 'row',
  },
  horizontalLeft: {
    width: 100,
  },
  horizontalRight: {
    flex: 1,
    marginLeft: 10,
  },
});
