import * as express from 'express';
import * as cors from 'cors';

export const addCors = (app: express.Express, apiConfig?: any): void => {
  if (apiConfig?.corsOptions) {
    app.use(cors(apiConfig.corsOptions));
  }
};
