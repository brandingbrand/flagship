const webpack = require('webpack');
const path = require("path");

module.exports = ({ config, env }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve("babel-loader"),
        options: {
          cacheDirectory: true
        }
      },
      {
        loader: require.resolve("ts-loader"),
        options: {
          configFile: 'tsconfig/tsconfig.storybook.json'
        }
      }
    ]
  });

  config.module.rules.push({
    test: /\.jsx?$/,
    include: [
      path.resolve('node_modules/@brandingbrand/tcomb-form-native/'),
      path.resolve('node_modules/@react-native-community/picker'),
      path.resolve('node_modules/react-native-picker-select'),
      path.resolve('node_modules/@adobe/react-native-acpcore'),
      path.resolve('node_modules/@adobe/react-native-acpanalytics')
    ],
    loader: require.resolve('babel-loader'),
    options: {
      cacheDirectory: true
    }
  });

  config.resolve.extensions = [
    '.web.js',
    '.js',
    '.ios.js',
    '.android.js',
    '.json',
    '.web.jsx',
    '.jsx',
    '.web.ts',
    '.ts',
    '.web.tsx',
    '.tsx'
  ];

  config.resolve.alias["react-native"] = "react-native-web";
  config.resolve.alias['react-native-web/dist/exports/DatePickerIOS'] = '@react-native-community/datetimepicker';
  config.resolve.alias['react-native-web/dist/exports/PickerIOS'] = 'react-native-web/dist/exports/Picker';
  config.resolve.alias['react-native-web/dist/exports/ProgressBarAndroid'] = 'react-native-web/dist/exports/ProgressBar';
  config.resolve.alias['react-native-web/dist/exports/ProgressViewIOS'] = 'react-native-web/dist/modules/UnimplementedView';
  config.resolve.alias['react-native-web/dist/exports/SegmentedControlIOS'] = 'react-native-web/dist/modules/UnimplementedView';
  config.resolve.alias['react-native-web/dist/exports/WebView'] = 'react-native-web-webview';

  // Disable __DEV__ mode (this is traditionally set by react-native)
  config.plugins.push(new webpack.DefinePlugin({
    __DEV__: false
  }));

  return config;
};
