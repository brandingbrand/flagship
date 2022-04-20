import { WARN } from './utils';

export = {
  plugins: ['fp-ts'],
  rules: {
    // plugin:fp-ts ************************************************************
    // rules URL: https://github.com/buildo/eslint-plugin-fp-ts#list-of-supported-rules
    'fp-ts/no-lib-imports': WARN,
    'fp-ts/no-pipeable': WARN,
    'fp-ts/no-module-imports': [WARN, { allowTypes: true }],
    'fp-ts/no-redundant-flow': WARN,
    'fp-ts/prefer-traverse': WARN,
    'fp-ts/prefer-chain': WARN,
    'fp-ts/prefer-bimap': WARN,
    'fp-ts/no-discarded-pure-expression': WARN,
  },
};
