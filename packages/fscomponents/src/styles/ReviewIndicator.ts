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
    flexDirection: 'row'
  },
  star: {
    fontSize: 20,
    width: 20,
    height: 24,
    color: '#ffd351',
    textAlign: 'center',
    fontFamily: 'Arial'
  },
  halfStarContainer: {
    width: 20,
    height: 24,
    flexDirection: 'row'
  },
  starHalfLeft: {
    position: 'absolute',
    left: 0
  },
  starHalfRight: {
    position: 'absolute',
    left: 0,
    marginLeft: -10
  },
  starHalfLeftWrap: {
    flex: 1,
    overflow: 'hidden',
    zIndex: 1
  },
  starHalfRightWrap: {
    flex: 1,
    overflow: 'hidden',
    zIndex: 1
  }
});
