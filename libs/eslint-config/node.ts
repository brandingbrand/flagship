import { BUGGY, NOT_RELEVANT, NOT_VALUABLE, OFF, TYPESCRIPT, WARN } from './utils';

export = {
  env: { es6: true, node: true },
  plugins: ['node'],
  rules: {
    // plugin:compat ***********************************************************
    // rules URL: https://github.com/amilajack/eslint-plugin-compat
    'compat/compat': OFF(NOT_RELEVANT),

    // plugin:node *************************************************************
    // rules URL: https://github.com/mysticatea/eslint-plugin-node#-rules

    // Possible Errors
    'node/handle-callback-err': OFF(NOT_VALUABLE),
    'node/no-callback-literal': WARN,
    'node/no-exports-assign': WARN,
    'node/no-extraneous-import': BUGGY(
      'eslint-plugin-node:v11.1.0',
      "Doesn't work well with Monorepos"
    ),
    'node/no-extraneous-require': BUGGY(
      'eslint-plugin-node:v11.1.0',
      "Doesn't work well with Monorepos"
    ),
    'node/no-missing-import': BUGGY('eslint-plugin-node:v11.1.0', 'TypeScript support is missing'),
    'node/no-missing-require': BUGGY('eslint-plugin-node:v11.1.0', 'TypeScript support is missing'),
    'node/no-new-require': WARN,
    'node/no-path-concat': WARN,
    'node/no-process-exit': WARN,
    'node/no-unpublished-bin': WARN,
    'node/no-unpublished-import': BUGGY('eslint-plugin-node:v11.1.0', 'Is not aware of build'),
    'node/no-unpublished-require': BUGGY(
      'eslint-plugin-node:v11.1.0',
      "Doesn't work with monorepos"
    ),
    'node/no-unsupported-features/es-builtins': OFF(TYPESCRIPT),
    'node/no-unsupported-features/es-syntax': OFF(TYPESCRIPT),
    'node/no-unsupported-features/node-builtins': OFF(TYPESCRIPT),
    'node/process-exit-as-throw': WARN,
    'node/shebang': WARN,

    // Best Practices
    'node/no-deprecated-api': WARN,

    // Stylistic Issues
    'node/callback-return': OFF(NOT_VALUABLE),
    'node/exports-style': WARN,
    'node/file-extension-in-import': OFF(NOT_VALUABLE),
    'node/global-require': WARN,
    'node/no-mixed-requires': WARN,
    'node/no-process-env': OFF(NOT_VALUABLE),
    'node/no-restricted-import': [WARN, ['left-pad']],
    'node/no-restricted-require': [WARN, ['left-pad']],
    'node/no-sync': OFF(NOT_VALUABLE),
    'node/prefer-global/buffer': WARN,
    'node/prefer-global/console': WARN,
    'node/prefer-global/process': WARN,
    'node/prefer-global/text-decoder': WARN,
    'node/prefer-global/text-encoder': WARN,
    'node/prefer-global/url': WARN,
    'node/prefer-global/url-search-params': WARN,
    'node/prefer-promises/dns': WARN,
    'node/prefer-promises/fs': WARN,

    // plugin:security *********************************************************
    // rules URL: https://github.com/nodesecurity/eslint-plugin-security
    'security/detect-buffer-noassert': WARN,
    'security/detect-child-process': WARN,
    'security/detect-no-csrf-before-method-override': WARN,
    'security/detect-non-literal-fs-filename': WARN,

    // plugin:unicorn **********************************************************
    // rules URL: https://github.com/sindresorhus/eslint-plugin-unicorn#rules
    'unicorn/prefer-module': OFF('`module` is often times required in commonjs'),
  },
};
