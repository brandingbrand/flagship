const path = require('path');
const express = require('express');
const Proxy = require('./proxy');
const { demandwareProxyConfig } = require("./lib");

const envPath = process.env.ENV_PATH || 'env';
const envFile = process.env.ENV || 'env';
const proxyConfigPath = process.env.PROXY_CONFIG_PATH || 'proxy'
const buildPath = process.env.BUILD_PATH || 'web-compiled';
const rootDir = '../../'

const env = require(
  path.resolve(__dirname, rootDir, envPath, envFile)
);

const proxyConfigFile = require(
  path.resolve(__dirname, rootDir, proxyConfigPath, 'config')
)

const port = process.env.PORT || 3000;

if (env && env.dataSource && env.dataSource.enableProxy) {
  if(!env.dataSource.apiConfig) {
    throw new Error('"apiConfig" is required for proxy configuration')
  }

  const apiConfig = env.dataSource.apiConfig;
  let proxyConfig = proxyConfigFile || {};

  if (env.dataSource.type === 'commercecloud') {
    proxyConfig = {
      ...demandwareProxyConfig,
      ...proxyConfig
    }
  }

  const build = path.resolve(__dirname, rootDir, buildPath);

  const proxy = new Proxy(apiConfig, proxyConfig)
    .initProxy(build);

  if (!proxy) {
    return;
  }

  proxy.listen(port, error => {
    if (error) {
      console.error(error);
    } else {
      console.info(`Proxy listening on port ${port}`);
    }
  });
}
