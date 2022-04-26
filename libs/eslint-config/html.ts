import { CODE_FORMATTING, OFF } from './utils';

export = {
  extends: './javascript.js',
  env: {
    browser: true,
  },
  settings: {
    'html/report-bad-indent': OFF(CODE_FORMATTING),
  },
  plugins: ['html'],
};
