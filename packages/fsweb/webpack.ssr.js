const webpack = require('webpack');
const path = require("path");
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ModuleReplaceWebpackPlugin = require('module-replace-webpack-plugin');
const FileLoader = require.resolve('file-loader');

const BabelPluginTransformImports = require('babel-plugin-transform-imports');
const BabelPluginReactNativeWeb = require('babel-plugin-react-native-web');
const BabelPluginProposalClassProperties = require('@babel/plugin-proposal-class-properties');

let webConfig;

try {
  webConfig = require('./config.web.json');
} catch (exception) {
  console.warn('Cannot find web config');
}

const ssrConfig = {
  optimization: {
    concatenateModules: false
  },
  bail: true,
  cache: true,
  devtool: 'none',
  entry: {
    attachSSR: [
      '@babel/polyfill',
      '../dist/ssr.js'
    ]
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'ssr-build'),
    library: 'flagship',
    libraryTarget: 'commonjs2',
    filename: '[name].js',
    devtoolModuleFilenameTemplate:
      info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },
  resolve: {
    extensions: [
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
    ],
    alias: {
      'react-native': 'react-native-web',
      'react-native-svg': 'svgs',
      'react-native-web/dist/exports/DatePickerIOS': '@react-native-community/datetimepicker',
      'react-native-web/dist/exports/PickerIOS': 'react-native-web/dist/exports/Picker',
      'react-native-web/dist/exports/ProgressBarAndroid': 'react-native-web/dist/exports/ProgressBar',
      'react-native-web/dist/exports/ProgressViewIOS': 'react-native-web/dist/modules/UnimplementedView',
      'react-native-web/dist/exports/SegmentedControlIOS': 'react-native-web/dist/modules/UnimplementedView',
      'react-native-web/dist/exports/WebView': 'react-native-web-webview',
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
      'localStorage': path.resolve(__dirname, './polyfills/localStorage'),
      'navigator': path.resolve(__dirname, './polyfills/navigator'),
      'window': path.resolve(__dirname, './polyfills/window'),
      'document': path.resolve(__dirname, './polyfills/document'),
      'requestAnimationFrame': path.resolve(__dirname, './polyfills/requestAnimationFrame')
    },
    modules: [
      path.resolve('./node_modules'),
      path.resolve('../node_modules'),
      path.resolve('../../../packages/../node_modules')
    ]
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js)$/,
            exclude: [
              /node_modules\/react-id-swiper/
            ],
            use: [
              {
                loader: require.resolve("babel-loader"),
                options: {
                  cacheDirectory: true,
                  presets: [
                    ["@babel/preset-env", {
                      "targets": {
                        "node": "current"
                      },
                      modules: false
                    }]
                  ],
                  plugins: [
                    [BabelPluginTransformImports, {
                      'lodash-es': {
                        transform: 'lodash-es/${member}',
                        preventFullImport: true
                      }
                    }],
                    [BabelPluginReactNativeWeb, {
                      commonjs: false
                    }]
                  ]
                }
              }
            ]
          },
          {
            test: /\.m?jsx?$/,
            include: [
              /node_modules\/react-native-/,
              /node_modules\/tcomb-form-native/,
              /packages\/fs/,
              /node_modules\/@brandingbrand\/fs/,
              /node_modules\/@brandingbrand\/react-native-/,
              /node_modules\/@react-native-community\//
            ],
            exclude: /node_modules\/react-native-web\//,
            use: [
              'cache-loader',
              {
                loader: require.resolve("babel-loader"),
                options: {
                  cacheDirectory: true,
                  presets: [
                    ["@babel/preset-env", {
                        modules: false
                    }]
                  ],
                  plugins: [
                    [BabelPluginTransformImports, {
                      'lodash-es': {
                        transform: 'lodash-es/${member}',
                        preventFullImport: true
                      }
                    }],
                    [BabelPluginReactNativeWeb, {
                      commonjs: false
                    }],
                    [BabelPluginProposalClassProperties]
                  ]
                }
              }
            ]
          },
          {
            test: /\.css$/,
            sideEffects: true,
            loader: ExtractTextPlugin.extract({
              fallback: require.resolve('style-loader'),
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    sourceMap: true
                  }
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    // Necessary for external CSS imports to work
                    // https://github.com/facebookincubator/create-react-app/issues/2677
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      autoprefixer({
                        browsers: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9' // React doesn't support IE8 anyway
                        ],
                        flexbox: 'no-2009'
                      })
                    ]
                  }
                }
              ]
            })
          },
          {
            loader: FileLoader,
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.m?js$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // Stub out global variables that are not known to node.js
    new webpack.ProvidePlugin({
      localStorage: 'localStorage',
      navigator: 'navigator',
      window: 'window',
      document: 'document',
      requestAnimationFrame: ['requestAnimationFrame', 'requestAnimationFrame']
    }),
    // Stub out sweetalert which is a web-only library implemented by the
    // Alert component in fscomponents
    new ModuleReplaceWebpackPlugin({
      modules: [{
        test: /sweetalert/,
        replace: './polyfills/sweetalert.js'
      }]
    }),
    new ExtractTextPlugin({
      filename: 'static/css/bundle.css'
    })
  ]
};

module.exports = function(env, options) {
  const defaultEnv = JSON.stringify(
    (env && env.defaultEnvName) ||
    (webConfig && webConfig.defaultEnvName) ||
    'prod'
  );

  let definitionPluginOptions = {
    __DEV__: env && env.enableDev ? true : false,
    __DEFAULT_ENV__: JSON.stringify((env && env.defaultEnvName) || 'prod')
  };
  const ReactNativeWebImageLoader = require.resolve('react-native-web-image-loader');
  !options.json && console.log('Webpacking for Production');
  ssrConfig.mode = 'production';
  definitionPluginOptions = {
    ...definitionPluginOptions,
    __DEV__: env && env.enableDev ? true : false
  };

  ssrConfig.module.rules[0].oneOf.unshift({
    test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: ReactNativeWebImageLoader,
    options: {
      name: 'shop-assets/media/[name].[ext]',
      scalings: { '@2x': 2, '@3x': 3 }
    }
  });

  ssrConfig.plugins.push(new webpack.DefinePlugin({
    ...definitionPluginOptions,
    __GROUPBY_PROXY__: JSON.stringify([])
  }));
  return ssrConfig;
};
