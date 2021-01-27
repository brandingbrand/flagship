import { FSApp } from '../fsapp/FSApp';
import * as FSAppTypes from '../types';
import type { default as expressRoot, Express, NextFunction, Request, Response } from 'express';
import type { default as helmetRoot, HelmetData } from 'react-helmet';
import type { default as cookieParserRoot } from 'cookie-parser';
import fs from 'fs-extra';
import path from 'path';
import pathToRegexp, { Key } from 'path-to-regexp';
// tslint:disable:no-submodule-imports - submodule import is required here
import ReactDOMServer from 'react-dom/server';
import { inspect } from 'util';
import { pathForScreen } from './helpers';
import { Store } from 'redux';

// Load all these as soft dependencies
let express: typeof expressRoot | undefined;
let Helmet: typeof helmetRoot | undefined;
let cookieParser: typeof cookieParserRoot | undefined;

try {
  express = require('express');
} catch (e) {
  console.warn(
    'express must be added to your project'
    + ' to enable server-side rendering'
  );
}

try {
  Helmet = require('react-helmet').default;
  if (Helmet) {
    Helmet.canUseDOM = false;
  }
} catch (e) {
  console.warn(
    'react-helmet must be added to your project'
    + ' to enable server-side rendering'
  );
}

try {
  cookieParser = require('cookie-parser');
} catch (e) {
  console.warn(
    'cookie-parser must be added to your project'
    + ' to enable server-side rendering'
  );
}

export interface SSROptions {
  // The html to render the application into.
  // default: load from ../web-compiled/index.html
  overrideHTML?: string;
  // Whether to run SSR for /
  // default: true
  renderRoot?: boolean;
}

export interface InitResponse {
  flagship: FSApp;
  config: FSAppTypes.AppConfigType;
}

const sanitizeString = (inputString: string): string => {
  let decodedString = decodeURIComponent(inputString).replace(/_/g, ' ') || '';
  decodedString = decodedString.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return decodedString;
};

async function initApp(
  appConfig: FSAppTypes.AppConfigType,
  preInit?: (config: FSAppTypes.AppConfigType) => Promise<FSAppTypes.AppConfigType>
): Promise<InitResponse> {
  let cloneConfig = { ...appConfig };

  if (preInit) {
    cloneConfig = await preInit(cloneConfig);
  }
  const flagship = new FSApp(cloneConfig);

  await flagship.initApp();

  return {
    flagship,
    config: cloneConfig
  };
}

const _global: any = global;
_global.IS_SERVER_SIDE = true;

declare const BUNDLE_TIMESTAMP: string;

async function renderApp(
  baseHTML: string,
  res: Response,
  flagshipApp: InitResponse,
  cache: boolean,
  req?: Request
): Promise<void> {
  const { flagship, config } = flagshipApp;
  const updatedConfig = {
    ...config,
    initialState: await flagship.updatedInitialState(cache)
  };
  flagship.getReduxStore(updatedConfig.initialState).then((reduxStore: Store) => {
    // prerender the app
    const ssApp = flagship.getApp(updatedConfig, reduxStore);
    if (ssApp) {
      const { element, getStyleElement } = ssApp;

      // first the element
      const html = ReactDOMServer.renderToString(element);
      let helmet: HelmetData | Record<string, string> = {
        title: '',
        meta: '',
        link: ''
      };

      if (Helmet) {
        helmet = Helmet.renderStatic();
      }

      // then the styles (optionally include a nonce if your CSP policy requires it)
      const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

      const state = JSON.stringify(updatedConfig.initialState);

      const variables = JSON.stringify(updatedConfig.variables || {});

      const document = baseHTML.replace(/<head>/, `<head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${css}
        <script>
          var initialState = ${state};
          var variables = ${variables};
        </script>
      `).replace(/\<div id="root"\>/, `<div id="root">
        ${html}
      `);

      res.send(document);
    } else {
      res.status(500).send('There was an issue loading the React app.');
    }
  }).catch((e: Error) => {
    console.error(e);
    res.status(500).send(e.toString());
  });
}

async function flagshipPreinit(
  req: Request,
  config: FSAppTypes.AppConfigType,
  pageState?: (data: FSAppTypes.SSRData, req: Request) => Promise<FSAppTypes.SSRData>
): Promise<FSAppTypes.AppConfigType> {
  let ssrData: FSAppTypes.SSRData = {
    initialState: {
      ...config.initialState
    },
    variables: {}
  };

  if (pageState) {
    ssrData = await pageState(ssrData, req);
  }

  // Clone appConfig so we have a per-request instance. This way we can load
  // request-specific information into appConfig.initialState.
  return {
    ...config,
    webRouterProps: {
      ...config.webRouterProps,
      location: req.url
    },
    ...ssrData,
    location: {
      pathname: req.path,
      search: req.url.split('?')[1] || '',
      hash: '',
      state: {}
    }
  };
}

export const attachSSR = (
  app: Express,
  appConfig: FSAppTypes.AppConfigType,
  options?: SSROptions
) => {
  const baseHTML = options?.overrideHTML ||
    fs.readFileSync(path.resolve('..', 'web-compiled', 'index.html')).toString();

  if (cookieParser) {
    app.use(cookieParser());
  }
  if (express) {
    app.use(express.json());
  }

  initApp(
    appConfig,
    async (config: FSAppTypes.AppConfigType): Promise<FSAppTypes.AppConfigType> => {
      return {
        ...config,
        serverSide: true,
        webRouterType: 'static',
        webRouterProps: {
          context: {}
        }
      };
    }).then((flagshipApp: InitResponse) => {
      const { flagship, config } = flagshipApp;

      if (express) {
        app.use('/static', express.static('./ssr-build/static'));
      }

      Object.keys(config.screens).forEach(key => {
        const screen = config.screens[key];
        const path = pathForScreen(screen, key);
        const keys: Key[] = [];
        const regex = pathToRegexp(path, keys);
        app.get(regex, (req: Request, res: Response, next: NextFunction) => {
          if (screen.instantNext) {
            next();
            return;
          }
          flagshipPreinit(req, config, screen.loadInitialData)
            .then(async (pageConfig: FSAppTypes.AppConfigType) => {
              if (screen.shouldNext) {
                if (await screen.shouldNext({
                  initialState: pageConfig.initialState,
                  variables: pageConfig.variables
                }, req)) {
                  next();
                  return;
                }
              }
              if (screen.cache !== undefined) {
                res.set('Cache-Control', 'max-age=' + screen.cache);
              }
              renderApp(
                baseHTML,
                res,
                {
                  flagship,
                  config: {
                    ...pageConfig,
                    uncachedData: screen.cache ? undefined : pageConfig.uncachedData
                  }
                },
                !!screen.cache,
                req
              ).catch(handleRequestError(req, res));
            })
            .catch(handleRequestError(req, res));
        });
      });

      if (options?.renderRoot !== false) {
        app.get('/', (req: Request, res: Response) => {
          flagshipPreinit(req, config)
            .then((pageConfig: FSAppTypes.AppConfigType) => {
              renderApp(
                baseHTML,
                res,
                {
                  flagship,
                  config: pageConfig
                },
                false,
                req
              ).catch(handleRequestError(req, res));
            })
            .catch(handleRequestError(req, res));
        });
      }
    }).catch((e: any) => {
      // There was an error initializing the SSR React App
      console.error(e);
    });
};

function handleRequestError(req: Request, res: Response): (e: any) => void {
  return (e: any) => {
    const debugMode = req.cookies.debug === 'on';

    if (!debugMode && !req.cookies.errorRetry) {
      res.cookie('errorRetry', '1', { maxAge: 10000 });

      res.redirect(307, req.originalUrl);
      return;
    } else {
      const statusCode = debugMode ? 200 : 500;
      let errorString = `<h2>We're sorry, an error has occurred.</h2><br />`;
      const inspectError = inspect(e, {depth: 5});
      const sanitizedError = sanitizeString(inspectError);

      errorString += `<pre> ${sanitizedError} </pre>`;

      if (e && e.code === 'ECONNRESET' && !debugMode && req.cookies.errorRetry !== '2') {
        res.cookie('errorRetry', '2', { maxAge: 10000 });
        errorString += `
          <script>
            window.location.reload();
          </script>
        `;
      } else {
        res.clearCookie('errorRetry');
      }

      res.status(statusCode).send(errorString);
      return;
    }
  };
}
