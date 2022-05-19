import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  recentSearch: {
    color: '#999',
    fontSize: 12,
  },
  recentSearchClearText: {},
  recentSearchContainer: {
    alignItems: 'flex-end',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingBottom: 10,
  },
  resultItem: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    padding: 15,
  },
  resultsContainer: {},
  searchBarContainer: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    padding: 10,
  },
  suggestionHighlight: {
    fontWeight: 'bold',
  },
  suggestionTitle: {},
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
