const express = require('express');
const proxy = require('http-proxy-middleware');
const url = require('url');
const cors = require('cors');

class Proxy {
  app = express();
  apiConfig;
  hostPackageJSON = require('../package.json');
  proxyConfig = {}
  proxyBaseConfig = {
    changeOrigin: true,
    xfwd: true,
    logLevel: 'silent'
  }

  constructor(apiConfig, proxyConfig) {
    this.apiConfig = apiConfig;

    if (!this.apiConfig.noHealthCheck) {
      this.initHealthCheck()
    }

    if (this.apiConfig.corsOptions) {
      this.app.use(cors(this.apiConfig.corsOptions));
    }

    if (proxyConfig && typeof proxyConfig === 'object') {
      this.proxyConfig = {
        ...this.proxyBaseConfig,
        ...proxyConfig
      }
    }
  }

  initHealthCheck() {
    this.app.get('/health_check', (
      req,
      res
    ) => res.send(this.hostPackageJSON.name));
  }

  initProxy(buildPath) {
    const endpoint = this.apiConfig.endpoint;
    if (!endpoint) {
      throw new Error('"proxyEndpoint" key is required for Proxy Configuration');
    }

    const upstream = url.parse(endpoint);
    const upstreamTarget = url.format({
      protocol: upstream.protocol,
      host: upstream.host
    });

    this.app.use(
      upstream.path,
      proxy.createProxyMiddleware({
        target: upstreamTarget,
        pathRewrite: function(path, _req) {
          return path.replace(endpoint, upstream.path);
        },
        ...this.proxyConfig
      })
    );

    if (buildPath) {
      this.app.use(
        express.static(buildPath)
      )
    }

    return this.app;
  }
}


module.exports = Proxy;
