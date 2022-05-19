import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  inputContainer: {
    borderWidth: 0,
  },
  locateMeButton: {
    height: 40,
    position: 'absolute',
    right: 10,
    top: -50,
    width: 40,
  },
  locateMeIcon: {
    height: 40,
    width: 40,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapVerticalList: {
    flex: 1,
  },
  mapVerticalSearchBar: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    overflow: 'hidden',
    paddingTop: 2,
  },
  resultContainer: {
    backgroundColor: 'white',
  },
  resultListAndLocateMe: {},
  seachAreaBtn: {},
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
