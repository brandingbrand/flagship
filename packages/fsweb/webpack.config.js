const webpack = require('webpack');
const path = require("path");
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

const globalConfig = {
  optimization: {
    concatenateModules: false
  },
  bail: true,
  cache: true,
  devtool: 'none',
  entry: {
    main: [
      'babel-polyfill',
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
      'react-native-svg': 'svgs'
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
                loader: require.resolve("ts-loader"),
                options: {
                  configFile: 'tsconfig/tsconfig.storybook.json'
                }
              }
            ]
          },
          {
            test: /\.m?jsx?$/,
            include: [
              /node_modules\/react-native-/,
              /node_modules\/tcomb-form-native/,
              /packages\/fs/
            ],
            exclude: /node_modules\/react-native-web\//,
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
  plugins: []
};

module.exports = function(env, options) {
  // add our environment specific config to the webpack config based on mode
  if (options && options.mode === 'production') {
    !options.json && console.log('Webpacking for Production');
    globalConfig.mode = 'production';
    globalConfig.output.filename = 'static/js/bundle.[contenthash:8].js';
    globalConfig.plugins = globalConfig.plugins.concat([
      new ExtractTextPlugin({
        filename: 'static/css/[name].[hash:8].css'
      }),
      new webpack.DefinePlugin({
        __DEV__: env.enableDev ? true : false,
        __DEFAULT_ENV__: JSON.stringify(env.defaultEnvName)
      }),
      new UglifyJsPlugin({
        test: /.m?[jt]sx?/,
        parallel: 4,
        extractComments: () => false,
        uglifyOptions: {
          mangle: true,
          compress: true
        }
      }),
      new ManifestPlugin({
        fileName: 'asset-manifest.json'
      }),
      // Generate a service worker script that will precache, and keep up to date,
      // the HTML & assets that are part of the Webpack build.
      new SWPrecacheWebpackPlugin({
        // By default, a cache-busting query parameter is appended to requests
        // used to populate the caches, to ensure the responses are fresh.
        // If a URL is already hashed by Webpack, then there is no concern
        // about it being stale, and the cache-busting can be skipped.
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        // 4Mb cache limit per file
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        filename: 'service-worker.js',
        logger(message) {
          if (message.indexOf('Total precache size is') === 0) {
            // This message occurs for every build and is a bit too noisy.
            return;
          }
          if (message.indexOf('Skipping static resource') === 0) {
            // This message obscures real errors so we ignore it.
            // https://github.com/facebookincubator/create-react-app/issues/2612
            return;
          }
          console.log(message);
        },
        minify: true,
        // For unknown URLs, fallback to the index page
        navigateFallback: '/index.html',
        // Ignores URLs starting from /__ (useful for Firebase):
        // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
        navigateFallbackWhitelist: [/^(?!\/__).*/],
        // Don't precache sourcemaps (they're large) and build asset manifest:
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
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
    ]);
  } else {
    (!options || !options.json) && console.log('Webpacking for Development');
    globalConfig.serve = {
      content: "./dev-server",
      add: (app, middleware, options) => {
        app.use(convert(history()));
      }
    }
    globalConfig.mode = 'development';
    globalConfig.plugins = globalConfig.plugins.concat([
      new ExtractTextPlugin({
        filename: 'static/css/bundle.css'
      }),
      new webpack.DefinePlugin({
        __DEV__: true
      })
    ]);
  }

  return globalConfig;
}
