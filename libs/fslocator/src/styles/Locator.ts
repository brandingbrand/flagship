import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  locateMeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  locateMeIcon: {
    height: 40,
    width: 40,
  },
  map: {
    flex: 1,
  },
  mapVerticalContainer: {
    flex: 1,
  },
  mapVerticalList: {
    flex: 1,
  },
  mapVerticalSearchBar: {},
  noResultsText: {
    margin: 10,
  },
  resultList: {
    flex: 1,
  },
  slideListContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  slideListSearchBar: {
    padding: 10,
  },
  slideMapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
