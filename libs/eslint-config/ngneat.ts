import { WARN } from './utils';

export = {
  plugins: ['@ngneat/reactive-forms'],
  rules: {
    // plugin:"@ngneat/reactive-forms" *****************************************
    // rules URL: https://github.com/ngneat/reactive-forms/blob/master/projects/ngneat/eslint-plugin-reactive-forms/docs/rules/no-angular-forms-imports.md
    '@ngneat/reactive-forms/no-angular-forms-imports': WARN,
  },
};
