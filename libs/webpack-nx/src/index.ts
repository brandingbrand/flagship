import type { WebWebpackExecutorOptions } from '@nrwl/web/src/executors/webpack/webpack.impl';

import { Configuration, DefinePlugin, ProvidePlugin } from 'webpack';
import getReactWebpackConfig from '@nrwl/react/plugins/webpack';

import * as ReactNative from '@callstack/repack';
import TerserPlugin from 'terser-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { TsconfigPathsPlugin } from '@nrwl/web/src/utils/webpack/plugins/tsconfig-paths/tsconfig-paths.plugin';

import { join } from 'path';

/**
 * This is ha hack to get nx to auto generate the package.json so that
 * these versions stay in sync
 */
const _loadDeps = () => {
  require('babel-loader');
  require('css-loader');
  require('file-loader');
  require('react-native-web-image-loader');
  require('ts-loader');
  require('https-browserify');
  require('stream-http');
  require('buffer');
  require('babel-plugin-react-native-web');
  require('react-native-web');
  require('react-native-web-linear-gradient');
  require('svgs');
  require('@react-native-community/datetimepicker');
  require('react-native-web-webview');
  require('process');
};

interface ProgrammaticEnvironment {
  options: Partial<WebWebpackExecutorOptions> & { forkTsCheck?: boolean; esm?: boolean };
}

interface BuildEnvironment {
  configuration: string;
  options: WebWebpackExecutorOptions;
}

interface ServeEnvironment {
  configuration: string;
  buildOptions: WebWebpackExecutorOptions;
}

type GetWebpackConfig = (
  config: Configuration,
  env?: BuildEnvironment | ProgrammaticEnvironment | ServeEnvironment,
  platform?: string
) => Configuration;

const webAliases = {
  'react-native-svg': 'svgs',
  'react-native': 'react-native-web',
  'react-native-linear-gradient': 'react-native-web-linear-gradient',
  'react-native-web/dist/exports/DatePickerIOS': '@react-native-community/datetimepicker',
  'react-native-web/dist/exports/PickerIOS': 'react-native-web/dist/exports/Picker',
  'react-native-web/dist/exports/ProgressBarAndroid': 'react-native-web/dist/exports/ProgressBar',
  'react-native-web/dist/exports/ProgressViewIOS':
    'react-native-web/dist/modules/UnimplementedView',
  'react-native-web/dist/exports/SegmentedControlIOS':
    'react-native-web/dist/modules/UnimplementedView',
  'react-native-web/dist/exports/WebView': 'react-native-web-webview',
};

const webLoaders = [
  {
    test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('react-native-web-image-loader'),
    options: {
      name: 'static/media/[name].[hash:8].[ext]',
      scalings: { '@2x': 2, '@3x': 3 },
    },
  },
  {
    test: /\.css$/,
    sideEffects: true,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
          sourceMap: true,
        },
      },
    ],
  },
  {
    loader: require.resolve('file-loader'),
    // Exclude `js` files to keep "css" loader working as it injects
    // it's runtime that would otherwise processed through "file" loader.
    // Also exclude `html` and `json` extensions so they get processed
    // by webpacks internal loaders.
    exclude: [/\.m?js$/, /\.html$/, /\.json$/],
    options: {
      name: 'static/media/[name].[hash:8].[ext]',
    },
  },
];

const webBabelPlugins = [
  [
    'module:babel-plugin-react-native-web',
    {
      commonjs: false,
    },
  ],
];

// eslint-disable-next-line complexity
const getFlagshipWebpackConfig: GetWebpackConfig = (config, environment, platform = 'web') => {
  const prod = config.mode === 'production';
  process.env.BABEL_ENV = config.mode;

  const reactConfig = (getReactWebpackConfig as GetWebpackConfig)(
    { ...config, module: { ...config.module, rules: [...(config.module?.rules ?? [])] } },
    environment
  );

  const options =
    environment &&
    ('options' in environment
      ? environment.options
      : 'buildOptions' in environment
      ? environment.buildOptions
      : undefined);

  const forkTsCheck =
    options && 'forkTsCheck' in options
      ? options.forkTsCheck
      : !!reactConfig.plugins?.find((plugin) => plugin instanceof ForkTsCheckerWebpackPlugin) ||
        options?.buildLibsFromSource;

  const resolve = {
    ...reactConfig.resolve,
    exportsFields: ['exports'],
    /**
     * `getResolveOptions` returns additional resolution configuration for React Native.
     * If it's removed, you won't be able to use `<file>.<platform>.<ext>` (eg: `file.ios.js`)
     * convention and some 3rd-party libraries that specify `react-native` field
     * in their `package.json` might not work correctly.
     */
    ...ReactNative.getResolveOptions(platform),
    ...(platform === 'web' ? { alias: { ...reactConfig.resolve?.alias, ...webAliases } } : {}),
    fallback: {
      // TODO: remove @apidevtools/json-schema-ref-parser
      // required for @apidevtools/json-schema-ref-parser
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      buffer: require.resolve('buffer/'),
    },
    ...(platform === 'web'
      ? {
          mainFields: ['browser', 'module', 'main'],
          aliasFields: ['browser', 'module', 'main'],
          extensions: [
            '.web.js',
            '.js',
            '.json',
            '.web.jsx',
            '.jsx',
            '.web.ts',
            '.ts',
            '.web.tsx',
            '.tsx',
            // TODO: Remove tcomb-form
            // Workaround for tcomb-form
            '.ios.js',
            '.ios.jsx',
          ],
        }
      : {}),
  };

  const typeScriptLoaders = [
    {
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          [
            'module:metro-react-native-babel-preset',
            options && 'esm' in options && options.esm
              ? {
                  disableImportExportTransform: true,
                  unstable_transformProfile: 'hermes-stable',
                }
              : {},
          ],
        ],
        plugins: [...(platform === 'web' ? webBabelPlugins : [])],
      },
    },
    {
      loader: require.resolve('ts-loader'),
      options: {
        configFile: options?.tsConfig,
        transpileOnly: forkTsCheck,
      },
    },
  ];

  const flagshipConfig: Configuration = {
    ...reactConfig,
    resolve: {
      ...resolve,
      ...(resolve.plugins?.find((plugin) => plugin instanceof TsconfigPathsPlugin) ||
      options?.buildLibsFromSource === false
        ? {}
        : {
            plugins: [
              ...(resolve.plugins ?? []),
              new TsconfigPathsPlugin({
                mainFields: resolve.mainFields,
                configFile: options?.tsConfig,
              }),
            ],
          }),
    },
    optimization: prod
      ? {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                mangle: true,
                compress: true,
              },
            }),
          ],
          ...reactConfig.optimization,
        }
      : reactConfig.optimization,

    module: {
      ...reactConfig.module,
      rules: [
        {
          oneOf: [
            // TODO: Fix side effects on `init.util` scripts
            // It is not fully working when using options.esm.
            // ---
            {
              test: /fallback-init\.util\.(ts|tsx)$/,
              exclude: /node_modules/,
              sideEffects: true,
              use: typeScriptLoaders,
            },
            {
              test: /init\.util\.(ts|tsx)$/,
              exclude: /node_modules/,
              sideEffects: true,
              use: typeScriptLoaders,
            },
            {
              test: /environments([/\\])+.*([/\\])+\.(ts|tsx)$/,
              exclude: /node_modules/,
              sideEffects: true,
              use: typeScriptLoaders,
            },
            // ---

            {
              test: /\.(ts|tsx)$/,
              exclude: /node_modules/,
              use: typeScriptLoaders,
            },

            /**
             * This rule will process all React Native related dependencies with Babel.
             * If you have a 3rd-party dependency that you need to transpile, you can add it to the
             * `include` list.
             *
             * You can also enable persistent caching with `cacheDirectory` - please refer to:
             * https://github.com/babel/babel-loader#options
             */
            {
              test: /\.m?[jt]sx?$/,
              include: [
                /node_modules([/\\])+react/,
                /node_modules([/\\])+@react-native/,
                /node_modules([/\\])+@brandingbrand([/\\])+tcomb-form-native/,
                /node_modules([/\\])+@brandingbrand([/\\])+fs/,
                /node_modules([/\\])+@brandingbrand([/\\])+react-native-/,
                /node_modules([/\\])+@adobe([/\\])+react-native-acpcore/,
                /node_modules([/\\])+@adobe([/\\])+react-native-acpanalytics/,
                /node_modules([/\\])+react-native-/,
                /node_modules([/\\])+@react-navigation/,
                /node_modules([/\\])+@react-native-community/,
                /node_modules([/\\])+@expo/,
                /node_modules([/\\])+pretty-format/,
                /node_modules([/\\])+metro/,
                /node_modules([/\\])+abort-controller/,
                /node_modules([/\\])+@callstack[/\\]repack/,
                /node_modules([/\\])+svgs/,
              ],
              exclude: [/node_modules([/\\])+react-native-web([/\\])+/],
              use: [
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    presets: [
                      [
                        'module:metro-react-native-babel-preset',
                        options && 'esm' in options && options.esm
                          ? {
                              disableImportExportTransform: true,
                              unstable_transformProfile: 'hermes-stable',
                            }
                          : {},
                      ],
                    ],
                    plugins: [...(platform === 'web' ? webBabelPlugins : [])],
                  },
                },
              ],
            },
            ...(platform === 'web' ? webLoaders : []),
          ],
        },
      ],
    },
    plugins: [
      ...(reactConfig.plugins ?? []).filter(
        (plugin) => forkTsCheck || !(plugin instanceof ForkTsCheckerWebpackPlugin)
      ),
      new ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
      new DefinePlugin({
        __DEV__: !prod,
        __VERSION__: options?.root
          ? `"${require(join(options.root, 'package.json')).version}"`
          : '"0.0.0"',
        __DEFAULT_ENV__: undefined,
      }),
    ],
    node: {
      global: true,
    },
    stats: {
      ...(typeof reactConfig.stats === 'object' ? reactConfig.stats : {}),
      ...(forkTsCheck ? { warningsFilter: /export .* was not found in/ } : {}),
    },
  };

  return flagshipConfig;
};

export = getFlagshipWebpackConfig;
