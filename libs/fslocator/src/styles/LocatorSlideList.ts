import { ImageStyle, RegisteredStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locateMeIcon: {
    width: 40,
    height: 40,
  },
  locateMeButton: {
    position: 'absolute',
    top: 70,
    right: 20,
  },
  slideMapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  slideListContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  slideListSearchBar: {
    margin: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  innerContainer: {
    flex: 1,
  },
  inputContainer: {
    borderWidth: 0,
  },
});
