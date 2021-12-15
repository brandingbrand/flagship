module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    [
      '@babel/preset-env',
      {
        exclude: ['transform-typeof-symbol'],
        modules: false,
        targets: {
          browsers: ['last 2 versions', 'ie >= 11'],
        },
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
  plugins: ['react-native-web'],
};
