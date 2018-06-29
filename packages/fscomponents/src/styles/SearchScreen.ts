import {
  ImageStyle,
  RegisteredStyle,
  StyleSheet,
  TextStyle,
  ViewStyle
} from 'react-native';
export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  modalContainer: {
    flex: 1
  },
  searchBarContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  resultsContainer: {},
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  recentSearchContainer: {
    padding: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  recentSearchClearText: {},
  recentSearch: {
    fontSize: 12,
    color: '#999'
  },
  suggestionTitle: {},
  suggestionHighlight: {
    fontWeight: 'bold'
  }
});
