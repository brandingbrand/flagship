import * as path from 'path';
import * as express from 'express';
import * as https from 'https';
import * as fs from 'fs';
import { addProxy } from './lib/proxy';
import { healthCheck } from './lib/healthcheck';

let ssr;

try {
  ssr = require('../ssr-build/attachSSR').default;
} catch (e) {
  console.error('SSR could not be loaded', e);
}

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const sslPort = process.env.SSLPORT ? parseInt(process.env.SSLPORT, 10) : undefined;
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

  if (!sslPort) {
    return;
  }

  // listen for SSL connections on SSLPORT if defined
  const inUseError = (port: number) => {
    return (e: any) => {
      if (e.code === 'EADDRINUSE') {
        console.error(`${e.code}: Looks like port ${port} is in use`);
      }

      process.exit(-1);
    };
  };
  const disableNagle = (socket: any) => socket.setNoDelay(true);
  const sslOptions = {
    key : fs.readFileSync(__dirname + '/../certs/cert.key'),
    cert: fs.readFileSync(__dirname + '/../certs/cert.pem')
  };
  const secureServer = https.createServer(sslOptions, app);
  secureServer.on('connection', disableNagle);

  secureServer.on('error', inUseError(sslPort));
  secureServer.listen(sslPort, () => {
    console.info(`Proxy listening on SSL port ${sslPort}`);
  });
}).on('error', err => {
  console.error(err);
});
