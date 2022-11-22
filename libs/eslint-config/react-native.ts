import base from './base';
import { OFF, PROJECT_BY_PROJECT, WARN } from './utils';

export = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: './react.js',
  plugins: ['react-native'],
  rules: {
    // plugin:eslint ***********************************************************
    // rules URL: https://github.com/eslint/eslint/tree/master/docs/rules
    // React Native has many overlapping exports ie `StyleSheet`, `Text`, etc.
    // Because of this we have to disable checking builtin globals altogether
    // perhaps at a future date this can be reenabled and we can shift to
    // an adapter library for react-native that does not have such overlap
    'no-redeclare': [WARN, { builtinGlobals: false }],

    // plugin:react-native ******************************************************************
    // rules URL: https://github.com/intellicode/eslint-plugin-react-native#list-of-supported-rules
    'react-native/no-color-literals': WARN,
    'react-native/no-inline-styles': WARN,
    'react-native/no-raw-text': OFF(PROJECT_BY_PROJECT),
    'react-native/no-single-element-style-arrays': WARN,
    'react-native/no-unused-styles': WARN,
    'react-native/sort-styles': WARN,
    'react-native/split-platform-components': WARN,

    // plugin:@typescript-eslint ***********************************************
    // rules URL: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
    '@typescript-eslint/no-restricted-imports': [
      WARN,
      {
        ...base.rules['no-restricted-imports'][1],
        patterns: [
          {
            group: ['*.css'],
            message: 'CSS Modules are not allowed in React Native',
          },
        ],
      },
    ],
  },
};
