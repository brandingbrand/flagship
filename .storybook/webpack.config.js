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
    include: path.resolve('node_modules/tcomb-form-native/'),
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

  // Disable __DEV__ mode (this is traditionally set by react-native)
  config.plugins.push(new webpack.DefinePlugin({
    __DEV__: false
  }));

  return config;
};
