import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  inputContainer: {
    borderWidth: 0,
  },
  locateMeButton: {
    position: 'absolute',
    right: 20,
    top: 70,
  },
  locateMeIcon: {
    height: 40,
    width: 40,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  slideListContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  slideListSearchBar: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingTop: 2,
  },
  slideMapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
