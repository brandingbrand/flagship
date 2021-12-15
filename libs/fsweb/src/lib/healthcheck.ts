import * as express from 'express';
const hostPackageJSON: any = require('../../../package.json');

export const healthCheck = (app: express.Express, env?: any): void => {
  if (env?.noHealthCheck !== false) {
    app.get('/health_check', (req: express.Request, res: express.Response) => {
      res.send(hostPackageJSON.name);
    });
  }
};
