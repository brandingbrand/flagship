import {
  ImageStyle,
  RegisteredStyle,
  StyleSheet,
  TextStyle,
  ViewStyle
} from 'react-native';

export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  mapVerticalList: {
    flex: 1
  },
  mapVerticalSearchBar: {},
  mapVerticalContainer: {
    flex: 1
  },
  loadingIndicator: {
    marginTop: 20
  },
  noResultsText: {
    margin: 10
  },
  list: {
    flex: 1
  },
  resultList: {
    flex: 1
  },
  locateMeIcon: {
    width: 40,
    height: 40
  },
  locateMeButton: {
    position: 'absolute',
    top: 20,
    right: 20
  },
  slideMapContainer: {
    ...StyleSheet.absoluteFillObject
  },
  slideListContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  slideListSearchBar: {
    padding: 10
  },
  innerContainer: {
    flex: 1
  }
});
