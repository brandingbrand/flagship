import { ES2021, JAVASCRIPT, OFF, WARN } from './utils';

export = {
  extends: './base.js',
  rules: {
    // plugin:eslint ***********************************************************
    // rules URL: https://github.com/eslint/eslint/tree/master/docs/rules
    'prefer-module': OFF('Many tools written in node do not support esm or other formats'),

    // plugin:fp ***************************************************************
    // rules URL: https://github.com/jfmengels/eslint-plugin-fp#rules
    'fp/no-mutation': [WARN, { allowThis: true, commonjs: true }],

    // plugin:import ***********************************************************
    // rules URL: https://github.com/benmosher/eslint-plugin-import#rules
    'import/named': OFF(JAVASCRIPT),
    'import/no-commonjs': OFF('Many tools written in node do not support esm or other formats'),
    'import/unambiguous': OFF(JAVASCRIPT),

    // plugin:node *************************************************************
    // rules URL: https://github.com/mysticatea/eslint-plugin-node#-rules
    'node/no-unsupported-features/es-builtins': WARN,
    'node/no-unsupported-features/es-syntax': WARN,
    'node/no-unsupported-features/node-builtins': WARN,
    'node/global-require': OFF(JAVASCRIPT),

    // plugin:unicorn **********************************************************
    // rules URL: https://github.com/sindresorhus/eslint-plugin-unicorn#rules
    'unicorn/numeric-separators-style': OFF(ES2021),
  },
};
