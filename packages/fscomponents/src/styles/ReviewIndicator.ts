import {
  ImageStyle,
  Platform,
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
    fontSize: 18,
    width: 18,
    color: '#333132',
    textAlign: 'center',
    fontFamily: 'Arial',
    // includeFontPadding is not a valid property for web/ios
    ...Platform.select({
      android: {
        includeFontPadding: false
      }
    })
  },
  emptyStar: {
    color: '#e0e1e2'
  },
  halfStarContainer: {
    width: 18,
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
