import * as ReactNative from '@callstack/repack';
import LoadablePlugin from '@loadable/webpack-plugin';
import getReactWebpackConfig from '@nrwl/react/plugins/webpack';
import type { WebWebpackExecutorOptions } from '@nrwl/web/src/executors/webpack/webpack.impl';
import SentryCliPlugin from '@sentry/webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { existsSync } from 'fs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { join, parse } from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import type { PackageJson } from 'type-fest';
import { DefinePlugin, ProvidePlugin } from 'webpack';
import type { Configuration, WebpackPluginInstance } from 'webpack';

import type {
  BuildEnvironment,
  GetWebpackConfig,
  ProgrammaticEnvironment,
  ServeEnvironment,
} from './types';

/* eslint-disable @typescript-eslint/no-require-imports, node/global-require,
node/prefer-global/process, @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
-- Hack to get nx to auto generate the package.json so that these versions stay in sync */
const _loadDeps = (): void => {
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
  require('@sentry/webpack-plugin');
};
/* eslint-enable @typescript-eslint/no-require-imports, node/global-require,
node/prefer-global/process, @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
*/

const webAliases = {
  'react-native-svg': 'svgs',
  'react-native-webview': 'react-native-web-webview',
  'react-native': 'react-native-web',
  'react-native-linear-gradient': 'react-native-web-linear-gradient',
  'react-native-web/dist/exports/DatePickerIOS': '@react-native-community/datetimepicker',
  'react-native-web/dist/exports/PickerIOS': 'react-native-web/dist/exports/Picker',
  'react-native-web/dist/exports/ProgressBarAndroid': 'react-native-web/dist/exports/ProgressBar',
  'react-native-web/dist/exports/ProgressViewIOS':
    'react-native-web/dist/modules/UnimplementedView',
  'react-native-web/dist/exports/SegmentedControlIOS':
    'react-native-web/dist/modules/UnimplementedView',
};

const webLoaders = (
  isServer: boolean,
  options?: ProgrammaticEnvironment['options'] | WebWebpackExecutorOptions
) => [
  ...(options === undefined ||
  !('reactNativeImageLoader' in options) ||
  options.reactNativeImageLoader !== false
    ? [
        {
          test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('react-native-web-image-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
            scalings: { '@2x': 2, '@3x': 3 },
          },
        },
      ]
    : []),
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
          modules: {
            auto: true,
            localIdentName: '[name]_[local]_[hash:base64:5]',
            mode: 'local',
            exportLocalsConvention: 'camelCase',
            exportOnlyLocals: isServer,
          },
        },
      },
    ],
  },
  ...(!(options && 'html' in options) || options.html !== false
    ? [
        {
          test: /postMock.html$/,
          use: {
            loader: require.resolve('file-loader'),
            options: {
              name: '[name].[ext]',
            },
          },
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
      ]
    : []),
];

const reactNativeWebBabelPlugins = [
  [
    'module:babel-plugin-react-native-web',
    {
      commonjs: false,
    },
  ],
];

const getOptions = (
  environment: BuildEnvironment | ProgrammaticEnvironment | ServeEnvironment | undefined
):
  | ProgrammaticEnvironment['options']
  | (WebWebpackExecutorOptions & { target?: string })
  | undefined => {
  if (environment) {
    if ('options' in environment) {
      return environment.options;
    }

    if ('buildOptions' in environment) {
      return environment.buildOptions;
    }
  }

  return undefined;
};

const getOptimization = (
  isProd: boolean,
  isServer: boolean,
  options: ProgrammaticEnvironment['options'] | WebWebpackExecutorOptions | undefined,
  reactConfig: Configuration
): Configuration['optimization'] | undefined => {
  if (isProd || isServer) {
    const shouldKeepClassNames = options && 'keepNames' in options ? options.keepNames : false;
    const otherMinimizers =
      reactConfig.optimization?.minimizer?.filter((plugin) => !(plugin instanceof TerserPlugin)) ??
      [];

    return {
      ...reactConfig.optimization,
      minimize: true,
      minimizer: [
        ...otherMinimizers,
        new TerserPlugin({
          extractComments: !isServer,
          terserOptions: {
            mangle: true,
            compress: true,
            // eslint-disable-next-line @typescript-eslint/naming-convention -- External API
            keep_fnames: shouldKeepClassNames,
            // eslint-disable-next-line @typescript-eslint/naming-convention  -- External API
            keep_classnames: shouldKeepClassNames,
          },
        }),
      ],
    };
  }

  return reactConfig.optimization;
};

const getResolve = (
  reactConfig: Configuration,
  alias:
    | Array<{ alias: string[] | string | false; name: string; onlyModule?: boolean | undefined }>
    | Record<string, string[] | string | false>
    | undefined,
  platform: string,
  isServer: boolean
) => ({
  ...reactConfig.resolve,
  alias,
  exportsFields: ['exports'],
  /**
   * `getResolveOptions` returns additional resolution configuration for React Native.
   * If it's removed, you won't be able to use `<file>.<platform>.<ext>` (eg: `file.ios.js`)
   * convention and some 3rd-party libraries that specify `react-native` field
   * in their `package.json` might not work correctly.
   */
  ...ReactNative.getResolveOptions(platform),
  ...(platform === 'web'
    ? {
        mainFields: isServer ? ['module', 'main'] : ['browser', 'module', 'main'],
        aliasFields: isServer ? ['module', 'main'] : ['browser', 'module', 'main'],
        extensions: [
          ...(isServer ? ['.server.js', '.server.ts', '.server.jsx', '.server.tsx'] : []),
          '.web.js',
          '.web.jsx',
          '.web.ts',
          '.web.tsx',
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json',
          // TODO: Remove tcomb-form
          // Workaround for tcomb-form
          '.ios.js',
          '.ios.jsx',
        ],
      }
    : {}),
});

// eslint-disable-next-line max-lines-per-function
const getFlagshipWebpackConfig: GetWebpackConfig = (config, environment, platform = 'web') => {
  const isProd = config.mode === 'production';
  process.env.BABEL_ENV = config.mode;

  const reactConfig = (getReactWebpackConfig as unknown as GetWebpackConfig)({
    ...config,
    module: { ...config.module, rules: [...(config.module?.rules ?? [])] },
  });

  const options = getOptions(environment);

  const isServer = typeof options === 'object' && 'server' in options && options.server === true;

  const shouldForkTsCheck =
    options && 'forkTsCheck' in options
      ? options.forkTsCheck
      : Boolean(
          reactConfig.plugins?.find((plugin) => plugin instanceof ForkTsCheckerWebpackPlugin)
        ) || options?.buildLibsFromSource;

  const alias =
    platform === 'web'
      ? {
          ...webAliases,
          ...(typeof reactConfig.resolve?.alias === 'object' &&
          !Array.isArray(reactConfig.resolve.alias)
            ? reactConfig.resolve.alias
            : {}),
        }
      : reactConfig.resolve?.alias;

  const resolve = getResolve(reactConfig, alias, platform, isServer);

  const webBabelPlugins =
    !Array.isArray(alias) && alias?.['react-native'] === webAliases['react-native']
      ? reactNativeWebBabelPlugins
      : [];

  const babelPlugins = platform === 'web' ? webBabelPlugins : [];

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
        plugins: babelPlugins,
      },
    },
    {
      loader: require.resolve('ts-loader'),
      options: {
        configFile: options?.tsConfig,
        transpileOnly:
          options && 'transpileOnly' in options ? options.transpileOnly : shouldForkTsCheck,
      },
    },
  ];

  const optimization: Configuration['optimization'] = getOptimization(
    isProd,
    isServer,
    options,
    reactConfig
  );

  if (typeof reactConfig.entry === 'object' && !Array.isArray(reactConfig.entry)) {
    for (const [key, value] of Object.entries(reactConfig.entry)) {
      if (typeof value === 'string') {
        const file = parse(value);
        const platformSpecificEntry = join(file.dir, `${file.name}.${platform}${file.ext}`);

        if (existsSync(platformSpecificEntry)) {
          reactConfig.entry[key] = platformSpecificEntry;
        }
      }
    }
  }

  // Allow per-app Sentry configs. NX_TASK_TARGET_PROJECT is generated automatically and is the name
  // of the project being built. For Create, for example, the envs should be
  // CREATE_SENTRY_ORGANIZATION, CREATE_SENTRY_PROJECT, and CREATE_SENTRY_TOKEN
  const envPrefix: string = (process.env.NX_TASK_TARGET_PROJECT ?? '').toUpperCase();
  const sentryOrganization = process.env[`${envPrefix}_SENTRY_ORGANIZATION`];
  const sentryProject = process.env[`${envPrefix}_SENTRY_PROJECT`];
  const sentryToken = process.env[`${envPrefix}_SENTRY_TOKEN`];

  const isDemo =
    typeof environment === 'object' &&
    'configuration' in environment &&
    environment.configuration === 'demo';

  const packageJson =
    options?.root !== undefined
      ? (require(join(options.root, 'package.json')) as PackageJson)
      : undefined;

  const javaScriptEntry =
    typeof reactConfig.output?.filename === 'string' ? reactConfig.output.filename : undefined;

  const flagshipConfig: Configuration = {
    ...reactConfig,
    output: isServer ? config.output : reactConfig.output,
    target: options?.target ?? 'web',
    resolve: {
      ...resolve,
      plugins: [
        ...(resolve.plugins?.filter((plugin) => !(plugin instanceof TsconfigPathsPlugin)) ?? []),
        new TsconfigPathsPlugin({
          extensions: resolve.extensions,
          mainFields: resolve.mainFields,
          configFile: options?.tsConfig,
        }) as never, // TODO: Remove never type when 'tsconfig-paths-webpack-plugin' types fixed
      ],
    },
    optimization,

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
                    plugins: babelPlugins,
                  },
                },
              ],
            },
            ...(platform === 'web' ? webLoaders(isServer, options) : []),
          ],
        },
      ],
    },
    plugins: [
      ...(reactConfig.plugins ?? []).filter(
        (plugin) =>
          !(plugin instanceof ForkTsCheckerWebpackPlugin) &&
          !(plugin instanceof MiniCssExtractPlugin)
      ),
      ...(platform === 'web'
        ? [new MiniCssExtractPlugin({ filename: '[name].[hash:8].css' })]
        : []),
      ...(shouldForkTsCheck === true
        ? [
            new ForkTsCheckerWebpackPlugin({
              async: false,
              typescript: {
                configFile: options?.tsConfig,
                memoryLimit: 8192,
              },
            }),
          ]
        : []),
      ...(isServer
        ? []
        : [
            new ProvidePlugin({
              process: 'process/browser',
              Buffer: ['buffer', 'Buffer'],
            }),
          ]),
      new DefinePlugin({
        /* eslint-disable @typescript-eslint/naming-convention -- Global definitions */
        __DEV__: !isProd || isDemo,
        __VERSION__: packageJson?.version !== undefined ? `"${packageJson.version}"` : '"0.0.0"',
        __DEFAULT_ENV__: undefined,
        __BASE_NAME__:
          packageJson?.homepage !== undefined ? `"${packageJson.homepage}"` : `undefined`,
        ...(isProd ? { __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })' } : {}),
        /* eslint-enable */
      }),
      ...(isProd && Boolean(sentryOrganization) && Boolean(sentryProject) && Boolean(sentryToken)
        ? [
            new SentryCliPlugin({
              include: config.output?.path ?? '.',
              org: sentryOrganization,
              project: sentryProject,
              authToken: sentryToken,
            }) as unknown as WebpackPluginInstance,
          ]
        : []),

      ...(options && 'loadableComponentStats' in options && options.loadableComponentStats === true
        ? [
            new LoadablePlugin({
              filename: javaScriptEntry
                ?.replace('[name].[contenthash:20]', 'loadable-stats')
                .replace('[name]', 'loadable-stats')
                .replace('main', 'loadable-stats')
                .replace(/js$/, 'json'),
            }) as unknown as WebpackPluginInstance,
          ]
        : []),
    ],
    node: {
      global: true,
    },
    stats: {
      ...(typeof reactConfig.stats === 'object' ? reactConfig.stats : {}),
      ...(shouldForkTsCheck ? { warningsFilter: /export .* was not found in/ } : {}),
    },
  };

  return flagshipConfig;
};

export = getFlagshipWebpackConfig;
