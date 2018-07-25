import { StyleSheet } from 'react-native';
import {
  fontSize,
  fontWeightBold,
  palette
} from './variables';

export default StyleSheet.create({
  // Headings
  h1: {
    fontSize: fontSize.huge,
    fontWeight: fontWeightBold,
    color: palette.primary
  },
  h2: {
    fontSize: fontSize.large,
    fontWeight: fontWeightBold,
    color: palette.primary
  },

  // Search Bar
  searchBarInner: {
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: palette.surface
  },
  searchBarInputTextStyle: {
    height: 40
  },
  searchBarCancelTitleStyle: {
    color: palette.secondary
  },
  searchBarSuggestionItemTextStyle: {
    color: palette.secondary
  }
});
