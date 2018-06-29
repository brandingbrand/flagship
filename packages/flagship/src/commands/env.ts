import { createEnvIndex } from '../lib/env';

export const command = 'env';
export const describe = 'create project env index file';
export const handler = createEnvIndex;
