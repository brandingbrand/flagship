const webpack = require('webpack');
const path = require("path");
const autoprefixer = require('autoprefixer');
const TerserJsPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const escapedSep = '\\' + path.sep;

let webConfig;

try {
  webConfig = require('./config.web.json')
} catch (exception) {
  console.warn('Cannot find web config');
}

const globalConfig = {
  optimization: {
    concatenateModules: false
  },
  bail: true,
  cache: true,
  devtool: 'none',
  entry: {
    main: [
      '@babel/polyfill',
      '../src/index.web.ts'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    pathinfo: true,
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '/',
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
      '@react-native-community/async-storage': 'react-native-web/dist/exports/AsyncStorage/index.js'
    },
    modules: [
      path.resolve('./node_modules'),
      path.resolve('../node_modules'),
      path.resolve('../../../node_modules')
    ]
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('react-native-web-image-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
              scalings: { '@2x': 2, '@3x': 3 }
            }
          },
          {
            test: /\.(ts|tsx)$/,
            use: [
              {
                loader: require.resolve("babel-loader"),
                options: {
                  cacheDirectory: true
                }
              },
              {
                loader: require.resolve("ts-loader")
              }
            ]
          },
          {
            test: /\.m?jsx?$/,
            include: [
              new RegExp('node_modules' + escapedSep + 'react-native-'),
              new RegExp('node_modules' + escapedSep + 'tcomb-form-native'),
              new RegExp('packages' + escapedSep + 'fs'),
              new RegExp('node_modules' + escapedSep + '@brandingbrand' + escapedSep + 'fs'),
              new RegExp('node_modules' + escapedSep + '@brandingbrand' + escapedSep + 'react-native-')
            ],
            exclude: new RegExp('node_modules' + escapedSep + 'react-native-web' + escapedSep),
            use: [
              'cache-loader',
              {
                loader: require.resolve("babel-loader"),
                options: {
                  cacheDirectory: true
                }
              }
            ]
          },
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
              fallback: require.resolve('style-loader'),
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true,
                    minimize: {
                      discardComments: {
                        removeAll: true
                      }
                    }
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
            loader: require.resolve('file-loader'),
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
    new CopyPlugin([
      {from: './build', to: '.'}
    ])
  ]
};

module.exports = function(env, options) {
  const defaultEnv = JSON.stringify(
    (env && env.defaultEnvName) ||
    (webConfig && webConfig.defaultEnvName) ||
    'prod'
  );

  // add our environment specific config to the webpack config based on mode
  if (options && options.mode === 'production') {
    !options.json && console.log('Webpacking for Production');
    globalConfig.mode = 'production';
    globalConfig.output.filename = 'static/js/bundle.[hash:8].js';
    globalConfig.optimization = {
      minimize: true,
      minimizer: [
        new TerserJsPlugin({
          test: /.m?[jt]sx?/,
          parallel: 4,
          terserOptions: {
            mangle: true,
            compress: true,
            output: {
              beautify: false,
              comments: false
            }
          }
        })
      ]
    };
    globalConfig.plugins = globalConfig.plugins.concat([
      new ExtractTextPlugin({
        filename: 'static/css/[name].[hash:8].css'
      }),
      new webpack.DefinePlugin({
        __DEV__: env && env.enableDev ? true : false,
        __DEFAULT_ENV__: defaultEnv
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, 'public', 'index.html'),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      }),
      new ManifestPlugin({
        fileName: 'asset-manifest.json'
      }),
      // Generate a service worker script that will precache, and keep up to date,
      // the HTML & assets that are part of the Webpack build.
      new GenerateSW({
        // 4Mb cache limit per file
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // For unknown URLs, fallback to root page
        navigateFallback: '/index.html',
        // Ignores URLs starting from /__ (useful for Firebase):
        // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
        navigateFallbackWhitelist: [/^(?!\/__).*/],
        // Don't precache sourcemaps (they're large), typings, and build asset manifest:
        exclude: [/\.d\.ts$/, /\.map$/, /asset-manifest\.json$/],
        globPatterns: [
          '/static/**/*.{js,css,html}',
          '/index.html',
          '/favicon.ico',
          '/manifest.json',
          '/web-icon.png',
          '/web-icon@512.png'
        ]
      }),
    ]);
  } else {
    (!options || !options.json) && console.log('Webpacking for Development');
    globalConfig.devServer = {
      contentBase: path.join(__dirname, 'dev-server'),
      historyApiFallback: true,
      port: 8080
    };
    globalConfig.mode = 'development';
    globalConfig.plugins = globalConfig.plugins.concat([
      new ExtractTextPlugin({
        filename: 'static/css/bundle.css'
      }),
      new webpack.DefinePlugin({
        __DEV__: true,
        __DEFAULT_ENV__: defaultEnv
      })
    ]);
  }

  return globalConfig;
}
