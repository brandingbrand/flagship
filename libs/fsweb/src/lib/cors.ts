import express from 'express';
import cors from 'cors';

export const addCors = (app: express.Express, apiConfig?: any): void => {
  if (apiConfig?.corsOptions) {
    app.use(cors(apiConfig.corsOptions));
  }
};
