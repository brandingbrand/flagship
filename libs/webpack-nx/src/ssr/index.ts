import path from 'path';
import { ProvidePlugin } from 'webpack';

import getFlagshipWebpackConfig from '..';
import type { GetWebpackConfig } from '../types';

const getServerSideRenderingConfig: GetWebpackConfig = (config, env) =>
  getFlagshipWebpackConfig(
    {
      ...config,
      output: {
        path: config.output?.path,
        filename: '[name].js',
        library: {
          type: 'commonjs2',
          export: 'default',
        },
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          [path.join(require.resolve('sweetalert'))]: path.resolve(
            __dirname,
            './polyfills/sweetalert.polyfill.js'
          ),
          [path.join(require.resolve('react-native-web-webview'), '..', `postMock.html$`)]:
            path.resolve(__dirname, './polyfills/post-mock.polyfill.js'),
          [path.join(
            require.resolve('react-native-web'),
            '..',
            '..',
            'modules',
            'ImageLoader',
            'index.js$'
          )]: path.resolve(__dirname, './polyfills/image-loader.polyfill.js'),
          [path.join(
            require.resolve('react-native-web'),
            '..',
            '..',
            'cjs',
            'modules',
            'ImageLoader',
            'index.js$'
          )]: path.resolve(__dirname, './polyfills/image-loader.polyfill.js'),
        },
      },
      plugins: [
        ...(config.plugins ?? []),
        new ProvidePlugin({
          console: path.resolve(__dirname, './polyfills/console.polyfill.js'),
          document: path.resolve(__dirname, './polyfills/document.polyfill.js'),
          localStorage: path.resolve(__dirname, './polyfills/local-storage.polyfill.js'),
          navigator: path.resolve(__dirname, './polyfills/navigator.polyfill.js'),
          window: path.resolve(__dirname, './polyfills/window.polyfill.js'),
          location: path.resolve(__dirname, './polyfills/location.polyfill.js'),
          requestAnimationFrame: path.resolve(
            __dirname,
            './polyfills/request-animation-frame.polyfill.js'
          ),
        }),
      ],
    },
    {
      ...env,
      options: {
        ...(env && 'options' in env ? env.options : {}),
        forkTsCheck: false,
        esm: false,
        keepNames: true,
        loadableComponentStats: true,
        server: true,
        target: 'node',
        html: false,
      },
    },
    'web'
  );

export = getServerSideRenderingConfig;
