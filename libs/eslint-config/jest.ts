import { NOT_VALUABLE, OFF, SUCCESSOR, WARN } from './utils';

export = {
  extends: './node.js',
  env: {
    'es6': true,
    'jest': true,
    'jest/globals': true,
    'node': true,
  },
  plugins: ['jest', 'jest-dom', 'jest-formatting'],
  rules: {
    // plugin:eslint ***********************************************************
    // rules URL: https://github.com/eslint/eslint/tree/master/docs/rules
    'max-statements': OFF(NOT_VALUABLE),
    'max-classes-per-file': OFF(NOT_VALUABLE),
    'max-lines-per-function': OFF(NOT_VALUABLE),

    // plugin:@typescript-eslint ***********************************************
    // rules URL: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin

    '@typescript-eslint/explicit-function-return-type': OFF(NOT_VALUABLE),
    '@typescript-eslint/no-non-null-assertion': OFF(NOT_VALUABLE),
    '@typescript-eslint/unbound-method': SUCCESSOR('jest/unbound-method'),

    // plugin:fp ***************************************************************
    // rules URL: https://github.com/jfmengels/eslint-plugin-fp#rules
    'fp/no-mutation': OFF(NOT_VALUABLE),

    // plugin:sonarjs ************************************************************
    // rules URL: https://github.com/SonarSource/eslint-plugin-sonarjs#rules
    'sonarjs/no-identical-functions': OFF(NOT_VALUABLE),
    'sonarjs/no-duplicate-string': OFF(NOT_VALUABLE),

    // plugin:jest *************************************************************
    // rules URL: https://github.com/jest-community/eslint-plugin-jest#rules
    'jest/consistent-test-it': [WARN, { fn: 'it' }],
    'jest/expect-expect': [
      WARN,
      { assertFunctionNames: ['expect', 'spectator.expectOne', 'spectator.expectConcurrent'] },
    ],
    'jest/max-nested-describe': WARN,
    'jest/no-alias-methods': WARN,
    'jest/no-commented-out-tests': WARN,
    'jest/no-conditional-expect': WARN,
    'jest/no-conditional-in-test': WARN,
    'jest/no-deprecated-functions': WARN,
    'jest/no-disabled-tests': OFF('I think having the ability to use .skip is legitimate'),
    'jest/no-done-callback': OFF(
      'Having a `done()` callback can be useful when working with rxjs and other async interfaces that are not promises'
    ),
    'jest/no-duplicate-hooks': WARN,
    'jest/no-export': WARN,
    'jest/no-focused-tests': WARN,
    'jest/no-hooks': OFF(NOT_VALUABLE),
    'jest/no-identical-title': WARN,
    'jest/no-if': WARN,
    'jest/no-interpolation-in-snapshots': WARN,
    'jest/no-jasmine-globals': WARN,
    'jest/no-jest-import': WARN,
    'jest/no-large-snapshots': WARN,
    'jest/no-mocks-import': WARN,
    'jest/no-restricted-matchers': [
      WARN,
      {
        resolves:
          'use `expect(await promise)` instead. Jest allows you to test a promise resolve value using `await expect().resolves`. For consistency and readability this rule bans `expect().resolves` in favor of `expect(await promise)`.',
        toBeFalsy:
          'Checking if a value is simply falsy does not test very much as there are many cases where this could be true.',
        toBeTruthy:
          'Checking if a value is simply truthy does not test very much as there are many cases where this could be true.',
        toMatchSnapshot:
          'Use `toMatchInlineSnapshot()` instead in order to make snapshot tests more manageable and reviewable by writing the snapshots inline in the test file.',
        toThrowErrorMatchingSnapshot:
          'Use `toThrowErrorMatchingInlineSnapshot()` instead in order to make snapshot tests more manageable and reviewable by writing the snapshots inline in the test file.',
      },
    ],
    'jest/no-standalone-expect': WARN,
    'jest/no-test-prefixes': WARN,
    'jest/no-test-return-statement': WARN,
    'jest/prefer-called-with': WARN,
    'jest/prefer-comparison-matcher': WARN,
    'jest/prefer-expect-assertions': OFF(NOT_VALUABLE),
    'jest/prefer-expect-resolves': WARN,
    'jest/prefer-equality-matcher': WARN,
    'jest/prefer-hooks-on-top': WARN,
    'jest/prefer-lowercase-title': [WARN, { ignoreTopLevelDescribe: true }],
    'jest/prefer-snapshot-hint': WARN,
    'jest/prefer-spy-on': WARN,
    'jest/prefer-strict-equal': WARN,
    'jest/prefer-to-be': WARN,
    'jest/prefer-to-contain': WARN,
    'jest/prefer-to-have-length': WARN,
    'jest/prefer-todo': WARN,
    'jest/require-hook': WARN,
    'jest/require-to-throw-message': WARN,
    'jest/require-top-level-describe': WARN,
    'jest/unbound-method': WARN,
    'jest/valid-describe-callback': WARN,
    'jest/valid-expect': WARN,
    'jest/valid-expect-in-promise': WARN,
    'jest/valid-title': WARN,

    // plugin:jest-dom *******************************************************
    // rules URL: https://github.com/testing-library/eslint-plugin-jest-dom#supported-rules
    'jest-dom/prefer-checked': WARN,
    'jest-dom/prefer-empty': WARN,
    'jest-dom/prefer-enabled-disabled': WARN,
    'jest-dom/prefer-focus': WARN,
    'jest-dom/prefer-in-document': WARN,
    'jest-dom/prefer-required': WARN,
    'jest-dom/prefer-to-have-attribute': WARN,
    'jest-dom/prefer-to-have-class': WARN,
    'jest-dom/prefer-to-have-style': WARN,
    'jest-dom/prefer-to-have-text-content': WARN,
    'jest-dom/prefer-to-have-value': WARN,

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
  },
};
