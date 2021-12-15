import { ImageStyle, RegisteredStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapVerticalList: {
    flex: 1,
  },
  mapVerticalSearchBar: {
    margin: 10,
    backgroundColor: 'white',
    paddingTop: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  locateMeIcon: {
    width: 40,
    height: 40,
  },
  locateMeButton: {
    position: 'absolute',
    right: 10,
    top: -50,
    width: 40,
    height: 40,
  },
  resultListAndLocateMe: {},
  resultContainer: {
    backgroundColor: 'white',
  },
  inputContainer: {
    borderWidth: 0,
  },
  seachAreaBtn: {},
});
