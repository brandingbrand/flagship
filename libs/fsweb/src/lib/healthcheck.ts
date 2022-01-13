import * as express from 'express';
import { readFileSync } from 'fs';

const hostPackageJSON = JSON.parse(readFileSync('../../../package.json', 'utf-8'));

export const healthCheck = (app: express.Express, env?: any): void => {
  if (env?.noHealthCheck !== false) {
    app.get('/health_check', (req: express.Request, res: express.Response) => {
      res.send(hostPackageJSON.name);
    });
  }
};
