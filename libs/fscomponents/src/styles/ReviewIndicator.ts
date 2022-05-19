import { Platform, StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  emptyStar: {
    color: '#e0e1e2',
  },
  halfStarContainer: {
    flexDirection: 'row',
    width: 18,
  },
  star: {
    color: '#333132',
    fontSize: 18,
    textAlign: 'center',
    width: 18,
    // includeFontPadding is not a valid property for web/ios
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },
  starHalfLeft: {
    left: 0,
    position: 'absolute',
  },
  starHalfLeftWrap: {
    flex: 1,
    overflow: 'hidden',
    zIndex: 1,
  },
  starHalfRight: {
    left: 0,
    marginLeft: -10,
    position: 'absolute',
  },
  starHalfRightWrap: {
    flex: 1,
    overflow: 'hidden',
    zIndex: 1,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
