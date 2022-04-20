import { OFF, PROJECT_BY_PROJECT, WARN } from './utils';

export = {
  parser: '@angular-eslint/template-parser',
  plugins: ['@angular-eslint/template'],
  rules: {
    // plugin:@angular-eslint/template *****************************************
    // rules URL: https://github.com/angular-eslint/angular-eslint#status-of-codelyzer-rules-conversion
    '@angular-eslint/template/accessibility-alt-text': WARN,
    '@angular-eslint/template/accessibility-label-for': WARN,
    '@angular-eslint/template/accessibility-label-has-associated-control': WARN,
    '@angular-eslint/template/banana-in-box': WARN,
    '@angular-eslint/template/cyclomatic-complexity': WARN,
    '@angular-eslint/template/click-events-have-key-events': WARN,
    '@angular-eslint/template/eqeqeq': WARN,
    '@angular-eslint/template/no-any': WARN,
    '@angular-eslint/template/no-autofocus': WARN,
    '@angular-eslint/template/no-call-expression': WARN,
    '@angular-eslint/template/no-duplicate-attributes': WARN,
    '@angular-eslint/template/no-negated-async': WARN,
    '@angular-eslint/template/no-positive-tabindex': WARN,
    '@angular-eslint/template/no-distracting-elements': WARN,
    '@angular-eslint/template/accessibility-elements-content': WARN,
    '@angular-eslint/template/i18n': OFF(PROJECT_BY_PROJECT),
    '@angular-eslint/template/mouse-events-have-key-events': WARN,
    '@angular-eslint/template/accessibility-valid-aria': WARN,
    '@angular-eslint/template/accessibility-table-scope': WARN,
    '@angular-eslint/template/conditional-complexity': WARN,
    '@angular-eslint/template/use-track-by-function': WARN,
  },
};
