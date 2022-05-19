import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  clearIconWrapper: {
    position: 'absolute',
    right: 0,
  },
  container: {},
  input: {
    flex: 1,
    fontSize: 14,
    height: 44,
    paddingHorizontal: 10,
  },
  inputContainer: {
    alignContent: 'center',
    alignItems: 'center',
    borderColor: '#333',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
  },
  locateButton: {},
  locateIcon: {
    height: 25,
    marginRight: 10,
    width: 25,
  },
  rightButton: {
    padding: 10,
  },
  searchBarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchIcon: {
    height: 25,
    marginLeft: 10,
    opacity: 0.2,
    width: 30,
  },
  searchIconFocused: {
    opacity: 1,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
