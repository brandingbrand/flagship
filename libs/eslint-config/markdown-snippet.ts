import { MARKDOWN, OFF } from './utils';

export = {
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    // plugin:eslint ***********************************************************
    // rules URL: https://github.com/eslint/eslint/tree/master/docs/rules
    'no-undef': OFF(MARKDOWN),
    'no-unused-expressions': OFF(MARKDOWN),
    'no-unused-vars': OFF(MARKDOWN),

    // plugin:@typescript-eslint ***********************************************
    // rules URL: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin

    // Type Checking is not available in markdown
    '@typescript-eslint/dot-notation': OFF(MARKDOWN),
    '@typescript-eslint/no-implied-eval': OFF(MARKDOWN),
    '@typescript-eslint/no-throw-literal': OFF(MARKDOWN),
    '@typescript-eslint/require-await': OFF(MARKDOWN),
    '@typescript-eslint/return-await': OFF(MARKDOWN),
    '@typescript-eslint/await-thenable': OFF(MARKDOWN),
    '@typescript-eslint/no-base-to-string': OFF(MARKDOWN),
    '@typescript-eslint/no-floating-promises': OFF(MARKDOWN),
    '@typescript-eslint/no-misused-promises': OFF(MARKDOWN),
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': OFF(MARKDOWN),
    '@typescript-eslint/no-unnecessary-condition': OFF(MARKDOWN),
    '@typescript-eslint/no-unnecessary-qualifier': OFF(MARKDOWN),
    '@typescript-eslint/no-unnecessary-type-arguments': OFF(MARKDOWN),
    '@typescript-eslint/no-unnecessary-type-assertion': OFF(MARKDOWN),
    '@typescript-eslint/prefer-includes': OFF(MARKDOWN),
    '@typescript-eslint/prefer-nullish-coalescing': OFF(MARKDOWN),
    '@typescript-eslint/prefer-readonly': OFF(MARKDOWN),
    '@typescript-eslint/prefer-readonly-parameter-types': OFF(MARKDOWN),
    '@typescript-eslint/prefer-reduce-type-parameter': OFF(MARKDOWN),
    '@typescript-eslint/prefer-regexp-exec': OFF(MARKDOWN),
    '@typescript-eslint/prefer-string-starts-ends-with': OFF(MARKDOWN),
    '@typescript-eslint/promise-function-async': OFF(MARKDOWN),
    '@typescript-eslint/require-array-sort-compare': OFF(MARKDOWN),
    '@typescript-eslint/restrict-plus-operands': OFF(MARKDOWN),
    '@typescript-eslint/strict-boolean-expressions': OFF(MARKDOWN),
    '@typescript-eslint/switch-exhaustiveness-check': OFF(MARKDOWN),
    '@typescript-eslint/unbound-method': OFF(MARKDOWN),

    // plugin:unicorn **********************************************************
    // rules URL: https://github.com/sindresorhus/eslint-plugin-unicorn#rules
    'unicorn/filename-case': OFF(MARKDOWN),
  },
};
