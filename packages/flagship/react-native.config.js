module.exports = {
  platforms: {
    ios: null,
    android: null
  },
  dependencies: {
    'react-native-video': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-video/android-exoplayer',
        }
      }
    }
  }
};
