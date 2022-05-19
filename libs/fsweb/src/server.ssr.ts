import express from 'express';
import path from 'path';

import { healthCheck } from './lib/healthcheck';
import { addProxy } from './lib/proxy';

let ssr;

try {
  ssr = require('../ssr-build/attachSSR').default;
} catch (error) {
  console.error('SSR could not be loaded', error);
}

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
const envPath = process.env.ENV_PATH || 'env';
const envFile = process.env.ENV || 'env';
const buildPath = process.env.BUILD_PATH || 'web-compiled';
const rootDir = '../../';

const env = require(path.resolve(__dirname, rootDir, envPath, envFile));

const app = express();

app.use((req, res, next) => {
  // Exclude index.html and '/' so SSR can run on it
  if (!['/index.html', '/'].includes(req.path)) {
    express.static(path.resolve(__dirname, rootDir, buildPath))(req, res, next);
    return;
  }
  next();
});

healthCheck(app, env);

addProxy(app, env);

if (ssr) {
  ssr(app);
}

app
  .listen(port, () => {
    console.info(`Proxy listening on port ${port}`);
  })
  .on('error', (err) => {
    console.error(err);
  });
