import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  buttonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingLeft: 10,
  },
  container: {
    backgroundColor: 'white',
    borderBottomColor: '#cdcdcd',
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 10,
  },
  rowInner: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
