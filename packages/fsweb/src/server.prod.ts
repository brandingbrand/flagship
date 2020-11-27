import * as path from 'path';
import * as express from 'express';
import { addProxy } from './lib/proxy';
import { healthCheck } from './lib/healthcheck';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const envPath = process.env.ENV_PATH || 'env';
const envFile = process.env.ENV || 'env';
const buildPath = process.env.BUILD_PATH || 'web-compiled';
const rootDir = '../../';

const env = require(
  path.resolve(__dirname, rootDir, envPath, envFile)
);

const app = express();

app.use(
  express.static(path.resolve(__dirname, rootDir, buildPath))
);

healthCheck(app, env);

addProxy(app, env);

app.listen(port, () => {
  console.info(`Proxy listening on port ${port}`);
}).on('error', err => {
  console.error(err);
});
