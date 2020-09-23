import * as express from 'express';
import * as proxy from 'http-proxy-middleware';
import * as url from 'url';
import * as path from 'path';
import { addCors } from './cors';
import { demandwareProxyConfig } from './demandware';

const proxyConfigPath = process.env.PROXY_CONFIG_PATH || 'proxy';
const rootDir = '../../../';
const proxyConfigFile = require(
  path.resolve(__dirname, rootDir, proxyConfigPath, 'config')
);

const proxyBaseConfig: Partial<proxy.Options> = {
  changeOrigin: true,
  xfwd: true,
  logLevel: 'silent'
};

// Returns true if a proxy was set up
export const addProxy = (app: express.Express, env: any, preProxy?: () => void): boolean => {
  if (env.dataSource && env.dataSource.enableProxy) {
    if (!env.dataSource.apiConfig) {
      console.error('"apiConfig" is required for proxy configuration');
    } else {
      const apiConfig = env.dataSource.apiConfig;
      let proxyConfig = {
        ...proxyBaseConfig,
        ...proxyConfigFile
      };

      addCors(app, apiConfig);

      if (env.dataSource.type === 'commercecloud') {
        proxyConfig = {
          ...demandwareProxyConfig,
          ...proxyConfig
        };
      }

      const endpoint = apiConfig.endpoint;

      if (endpoint) {
        const upstream = url.parse(endpoint);
        const upstreamTarget = url.format({
          protocol: upstream.protocol,
          host: upstream.host
        });

        if (upstream.path) {
          const upstreamPath = upstream.path;
          // If there's anything that needs to be done before attaching the proxy,
          // like adding middleware that only should be attached if there is a proxy running,
          // it should happen in this function
          if (preProxy) {
            preProxy();
          }
          app.use(
            upstreamPath,
            proxy.createProxyMiddleware({
              target: upstreamTarget,
              pathRewrite: (path, _req) => {
                return path.replace(endpoint, upstreamPath);
              },
              ...proxyConfig
            })
          );
          return true;
        }
      } else {
        console.error('"endpoint" key is required for Proxy Configuration');
      }
    }
  }
  return false;
};
