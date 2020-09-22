const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');

const Proxy = require('./proxy');
const { demandwareProxyConfig } = require('./lib');

const port = process.env.PORT || 3000;
const hostname = process.env.HOST || 'localhost';
const envPath = process.env.ENV_PATH || 'env';
const proxyConfigPath = process.env.PROXY_CONFIG_PATH || 'proxy'

const rootDir = '../../';

const env = require(
  path.resolve(__dirname, rootDir, envPath, 'env')
);

if (env && env.dataSource && env.dataSource.enableProxy) {
  if(!env.dataSource.apiConfig) {
    throw new Error('"apiConfig" is required for proxy configuration')
  }

  let proxyCustomConfig;
  const proxyCustomConfigRootPath = path.resolve(__dirname, rootDir, proxyConfigPath, 'config');
  if (fs.existsSync(proxyCustomConfigRootPath)) {
    proxyCustomConfig = require(proxyCustomConfigRootPath) || {};
  } else {
    proxyCustomConfig = {}
  }

  const apiConfig = env.dataSource.apiConfig;

  if (env.dataSource.type === 'commercecloud') {
    proxyConfig = {
      ...demandwareProxyConfig,
      ...proxyCustomConfig
    }
  }

  const proxy = new Proxy(apiConfig, proxyCustomConfig)
    .initProxy();

  if (!proxy) {
    return;
  }

  proxy.get('/dev-mode-welcome', (req, res) => {
    res.send(`
        <style>body { font-family: sans-serif; }</style>
        <p>Dev mode is running on <strong>http://${hostname}:${port}</strong>
        proxying</p>
        <p>You can override this by specifying env variables: ENV, HOST, PORT. 
        e.g. 'HOST=0.0.0.0 npm run start-web-dev' to accept user from another device</p>
        <p>Env configs:</p>
        <pre>${JSON.stringify(env, null, 2)}</pre>
    `)
  });

  proxy.listen(port, hostname, error => {
    if (error) {
      console.error(error);
    } else {
      if (!env.dataSource.apiConfig.silent) {
        exec(`open http://${hostname}:${port}/dev-mode-welcome`);
      }
      console.info(`Proxy listening on port ${port}`);
    }
  });
}