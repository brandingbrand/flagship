import base from './base';
import { NOT_VALUABLE, OFF, SUCCESSOR, WARN } from './utils';

export = {
  extends: './node.js',
  env: {
    'es6': true,
    'node': true,
    'mocha': true,
    'cypress/globals': true,
  },
  plugins: ['chai-friendly', 'cypress', 'jest-formatting', 'mocha'],
  rules: {
    // plugin:eslint ***********************************************************
    // rules URL: https://github.com/eslint/eslint/tree/master/docs/rules
    'no-unused-expressions': SUCCESSOR('chai-friendly/no-unused-expressions'),
    'max-statements': OFF(NOT_VALUABLE),
    'max-classes-per-file': OFF(NOT_VALUABLE),
    'max-lines-per-function': OFF(NOT_VALUABLE),

    // plugin:@typescript-eslint ***********************************************
    // rules URL: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin

    '@typescript-eslint/unbound-method': OFF(NOT_VALUABLE),

    // plugin:fp ***************************************************************
    // rules URL: https://github.com/jfmengels/eslint-plugin-fp#rules
    'fp/no-mutation': OFF(NOT_VALUABLE),

    // plugin:sonarjs ************************************************************
    // rules URL: https://github.com/SonarSource/eslint-plugin-sonarjs#rules
    'sonarjs/no-identical-functions': OFF(NOT_VALUABLE),

    // plugin:chai-friendly ****************************************************
    // rules URL: https://github.com/ihordiachenko/eslint-plugin-chai-friendly#usage
    'chai-friendly/no-unused-expressions': base.rules['no-unused-expressions'],

    // plugin:cypress **********************************************************
    // rules URL: https://github.com/cypress-io/eslint-plugin-cypress#rules
    'cypress/no-assigning-return-values': WARN,
    'cypress/no-unnecessary-waiting': WARN,
    'cypress/no-async-tests': WARN,
    'cypress/no-force': WARN,
    'cypress/assertion-before-screenshot': WARN,
    'cypress/require-data-selectors': WARN,

    // plugin:jest-formatting **************************************************
    // rules URL: https://github.com/dangreenisrael/eslint-plugin-jest-formatting#rule-documentation
    'jest-formatting/padding-around-after-all-blocks': WARN,
    'jest-formatting/padding-around-after-each-blocks': WARN,
    'jest-formatting/padding-around-before-all-blocks': WARN,
    'jest-formatting/padding-around-before-each-blocks': WARN,
    'jest-formatting/padding-around-describe-blocks': WARN,
    'jest-formatting/padding-around-expect-groups': WARN,
    'jest-formatting/padding-around-test-blocks': WARN,
    'jest-formatting/padding-around-all': SUCCESSOR('jest-formatting (all _other_ rules)'),

    // plugin:mocha ************************************************************
    // rules URL: https://github.com/lo1tuma/eslint-plugin-mocha/tree/master/docs/rules#rules
    'mocha/handle-done-callback': WARN,
    'mocha/max-top-level-suites': [WARN, { limit: 1 }],
    'mocha/no-async-describe': WARN,
    'mocha/no-exclusive-tests': WARN,
    'mocha/no-exports': WARN,
    'mocha/no-global-tests': WARN,
    'mocha/no-hooks': OFF(NOT_VALUABLE),
    'mocha/no-hooks-for-single-case': WARN,
    'mocha/no-identical-title': WARN,
    'mocha/no-mocha-arrows': OFF(NOT_VALUABLE),
    'mocha/no-nested-tests': WARN,
    'mocha/no-pending-tests': WARN,
    'mocha/no-return-and-callback': WARN,
    'mocha/no-return-from-async': OFF(NOT_VALUABLE),
    'mocha/no-setup-in-describe': WARN,
    'mocha/no-sibling-hooks': WARN,
    'mocha/no-skipped-tests': OFF(NOT_VALUABLE),
    'mocha/no-synchronous-tests': OFF(NOT_VALUABLE),
    'mocha/no-top-level-hooks': WARN,
    'mocha/prefer-arrow-callback': OFF(NOT_VALUABLE),
    'mocha/valid-suite-description': WARN,
    'mocha/valid-test-description': WARN,
  },
};
