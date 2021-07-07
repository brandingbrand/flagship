import {
  ImageStyle,
  RegisteredStyle,
  StyleSheet,
  TextStyle,
  ViewStyle
} from 'react-native';
export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  container: {},
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 10,
    height: 44
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  rightButton: {
    padding: 10
  },
  searchIcon: {
    width: 30,
    height: 25,
    opacity: 0.2,
    marginLeft: 10
  },
  searchIconFocused: {
    opacity: 1
  },
  locateButton: {},
  locateIcon: {
    height: 25,
    width: 25,
    marginRight: 10
  },
  clearIconWrapper: {
    position: 'absolute',
    right: 0
  }
});
