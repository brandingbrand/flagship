import { OFF } from './utils';

export = {
  plugins: ['rxjs'],
  rules: {
    'rxjs/no-ignored-error': OFF(),
    'rxjs/no-ignored-subscribe': OFF(),
  },
};
