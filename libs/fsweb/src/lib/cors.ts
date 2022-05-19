import cors from 'cors';
import type express from 'express';

export const addCors = (app: express.Express, apiConfig?: any): void => {
  if (apiConfig?.corsOptions) {
    app.use(cors(apiConfig.corsOptions));
  }
};
