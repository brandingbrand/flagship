import { BUGGY, OFF } from './utils';

export = {
  rules: {
    // plugin:rxjs **************************************************************
    // rules URL: https://github.com/cartant/eslint-plugin-rxjs
    'rxjs/finnish': BUGGY(
      'eslint-plugin-rxjs@3.3.7',
      'False positives on nativescript code observables'
    ),

    // plugin:unicorn **********************************************************
    // rules URL: https://github.com/sindresorhus/eslint-plugin-unicorn#rules
    'unicorn/prefer-module': OFF(
      'Nativescript requires module.id for relative templates and stylesheets in angular'
    ),
  },
};
