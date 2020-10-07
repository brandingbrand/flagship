import * as path from 'path';
import * as express from 'express';
import { addProxy } from './lib/proxy';
import { healthCheck } from './lib/healthcheck';

let ssr;

try {
  ssr = require('../ssr-build/attachSSR').default;
} catch (e) {
  console.error('SSR could not be loaded', e);
}

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const envPath = process.env.ENV_PATH || 'env';
const envFile = process.env.ENV || 'env';
const buildPath = process.env.BUILD_PATH || 'web-compiled';
const rootDir = '../../';

const env = require(
  path.resolve(__dirname, rootDir, envPath, envFile)
);

const app = express();

app.use((req, res, next) => {
  // Exclude index.html and '/' so SSR can run on it
  if (['/index.html', '/'].indexOf(req.path) === -1) {
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

app.listen(port, () => {
  console.info(`Proxy listening on port ${port}`);
}).on('error', err => {
  console.error(err);
});
