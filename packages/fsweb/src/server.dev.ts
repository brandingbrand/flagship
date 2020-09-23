import { exec } from 'child_process';
import * as path from 'path';
import * as express from 'express';
import { addProxy } from './lib/proxy';
import { healthCheck } from './lib/healthcheck';

const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const envPath = process.env.ENV_PATH || 'env';
const envFile = process.env.ENV || 'env';
const rootDir = '../../';

const env = require(
  path.resolve(__dirname, rootDir, envPath, envFile)
);

const app = express();

if (addProxy(app, env, () => {
  healthCheck(app, env);

  app.get('/dev-mode-welcome', (req, res) => {
    res.send(`
        <style>body { font-family: sans-serif; }</style>
        <p>Dev mode is running on <strong>http://${hostname}:${port}</strong>
        proxying</p>
        <p>You can override this by specifying env variables: ENV, HOST, PORT.
        e.g. 'HOST=0.0.0.0 npm run start-web-dev' to accept user from another device</p>
        <p>Env configs:</p>
        <pre>${JSON.stringify(env, null, 2)}</pre>
    `);
  });
})) {
  app.listen(port, hostname, () => {
    if (!env.dataSource.apiConfig.silent) {
      exec(`open http://${hostname}:${port}/dev-mode-welcome`);
    }
    console.info(`Proxy listening on port ${port}`);
  }).on('error', err => {
    console.error(err);
  });
}
