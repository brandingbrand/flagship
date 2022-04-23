import restrictedGlobals from 'confusing-browser-globals';

import {
  BUGGY,
  CODE_FORMATTING,
  ERROR,
  ES2021,
  LARGE_PERFORMANCE_COST,
  NOT_VALUABLE,
  OFF,
  PROJECT_BY_PROJECT,
  SUCCESSOR,
  TYPESCRIPT,
  UNKNOWN,
  WARN,
} from './utils';

export = {
  env: { es6: true },
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      impliedStrict: true,
    },
    sourceType: 'module',
  },
  settings: {
    'jsdoc': {
      mode: 'closure',
    },
    'import/cache': {
      lifetime: '60',
    },
    'import/extensions': ['.ts', '.tsx', '.js', '.jsx'],
    'import/ignore': ['\\.(scss|less|css)$', '\\.(png|jpg|svg)$'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  plugins: [
    'compat',
    'eslint-comments',
    'fp',
    'import',
    'jsdoc',
    'no-secrets',
    'prefer-arrow',
    'sonarjs',
    'security',
    'sort-destructure-keys',
    'ternary',
    'unicorn',
  ],
  rules: {
    // plugin:eslint ***********************************************************
    // rules URL: https://github.com/eslint/eslint/tree/master/docs/rules

    // Possible Errors
    'for-direction': WARN,
    'getter-return': WARN,
    'no-async-promise-executor': WARN,
    'no-await-in-loop': OFF(
      'While in many cases you do want to avoid await in loops, there are cases where order matters in which this does not apply.'
    ),
    'no-compare-neg-zero': WARN,
    'no-cond-assign': WARN,
    'no-console': [WARN, { allow: ['warn', 'error'] }],
    'no-constant-condition': WARN,
    'no-control-regex': WARN,
    'no-debugger': WARN,
    'no-dupe-args': WARN,
    'no-dupe-keys': WARN,
    'no-duplicate-case': WARN,
    'no-empty': [WARN, { allowEmptyCatch: true }],
    'no-empty-character-class': WARN,
    'no-ex-assign': WARN,
    'no-extra-boolean-cast': WARN,
    'no-func-assign': WARN,
    'no-import-assign': WARN,
    'no-inner-declarations': BUGGY(
      'unknown',
      "doesn't play nice with namespaces https://github.com/typescript-eslint/typescript-eslint/issues/239"
    ),
    'no-invalid-regexp': WARN,
    'no-irregular-whitespace': WARN,
    'no-loss-of-precision': WARN,
    'no-misleading-character-class': WARN,
    'no-obj-calls': WARN,
    'no-promise-executor-return': WARN,
    'no-prototype-builtins': WARN,
    'no-regex-spaces': WARN,
    'no-setter-return': WARN,
    'no-sparse-arrays': WARN,
    'no-template-curly-in-string': WARN,
    'no-unreachable': WARN,
    'no-unreachable-loop': WARN,
    'no-unsafe-finally': WARN,
    'no-unsafe-negation': WARN,
    'no-unsafe-optional-chaining': WARN,
    'no-useless-backreference': WARN,
    'require-atomic-updates': WARN,
    'use-isnan': WARN,
    'valid-typeof': WARN,

    // Best Practices
    'accessor-pairs': WARN,
    'array-callback-return': [WARN, { allowImplicit: true }],
    'block-scoped-var': WARN,
    'class-methods-use-this': OFF(
      'Some frameworks (angular) require methods for templates to reference'
    ),
    'complexity': [WARN, { max: 50 }],
    'consistent-return': WARN,
    'curly': [WARN, 'multi-line'],
    'default-case': [WARN, { commentPattern: '^no default$' }],
    'default-case-last': WARN,
    'default-param-last': WARN,
    'dot-notation': WARN,
    'eqeqeq': [WARN, 'always'],
    'grouped-accessor-pairs': WARN,
    'guard-for-in': WARN,
    'max-classes-per-file': [WARN, 1],
    'no-alert': WARN,
    'no-caller': WARN,
    'no-case-declarations': WARN,
    'no-constructor-return': ERROR,
    'no-constant-binary-expression': WARN,
    'no-div-regex': WARN,
    'no-duplicate-imports': WARN,
    'no-else-return': WARN,
    'no-empty-function': [
      WARN,
      {
        allow: ['arrowFunctions', 'functions', 'methods'],
      },
    ],
    'no-empty-pattern': WARN,
    'no-eq-null': WARN,
    'no-eval': WARN,
    'no-extend-native': WARN,
    'no-extra-bind': WARN,
    'no-extra-label': WARN,
    'no-fallthrough': SUCCESSOR('tsc:noFallthroughCasesInSwitch'),
    'no-global-assign': [ERROR, { exceptions: [] }],
    'no-implicit-coercion': WARN,
    'no-implicit-globals': WARN,
    'no-implied-eval': ERROR, // WOW. Just wow.
    'no-invalid-this': WARN,
    'no-iterator': WARN,
    'no-labels': [WARN, { allowLoop: false, allowSwitch: false }],
    'no-lone-blocks': WARN,
    'no-loop-func': WARN,
    'no-magic-numbers': BUGGY('unknown', 'sounds good in theory, but works poorly in practice'),
    'no-multi-str': WARN,
    'no-new': WARN,
    'no-new-func': WARN,
    'no-new-wrappers': WARN,
    'no-nonoctal-decimal-escape': WARN,
    'no-octal': WARN,
    'no-octal-escape': WARN,
    'no-param-reassign': WARN,
    'no-proto': WARN,
    'no-redeclare': WARN,
    'no-restricted-properties': [
      WARN,
      {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated',
      },
      {
        object: 'global',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      },
      {
        object: 'self',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      },
      {
        object: 'window',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      },
      {
        object: 'global',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      },
      {
        object: 'self',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      },
      {
        object: 'window',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      },
      {
        property: '__defineGetter__',
        message: 'Please use Object.defineProperty instead.',
      },
      {
        property: '__defineSetter__',
        message: 'Please use Object.defineProperty instead.',
      },
      {
        object: 'Math',
        property: 'pow',
        message: 'Use the exponentiation operator (**) instead.',
      },
    ],
    'no-return-assign': WARN,
    'no-return-await': WARN,
    'no-script-url': WARN,
    'no-self-assign': WARN,
    'no-self-compare': WARN,
    'no-sequences': WARN,
    'no-throw-literal': WARN,
    'no-unmodified-loop-condition': WARN,
    'no-unused-expressions': WARN,
    'no-unused-labels': WARN,
    'no-unused-private-class-members': WARN,
    'no-useless-call': WARN,
    'no-useless-catch': WARN,
    'no-useless-concat': WARN,
    'no-useless-escape': WARN,
    'no-useless-return': WARN,
    'no-void': OFF(
      'The void operator has meaningful uses such as showing the intent to eat the result of a promise'
    ),
    'no-warning-comments': SUCCESSOR('unicorn/expiring-todo-comments'),
    'no-with': WARN,
    'prefer-named-capture-group': OFF(PROJECT_BY_PROJECT),
    'prefer-object-has-own': SUCCESSOR('unicorn/prefer-object-has-own'),
    'prefer-promise-reject-errors': WARN,
    'prefer-regex-literals': WARN,
    'radix': WARN,
    'require-await': WARN,
    'require-unicode-regexp': OFF(PROJECT_BY_PROJECT),
    'vars-on-top': WARN,
    'yoda': OFF('not needed because `no-cond-assign` covers this error'),

    // Strict Mode
    'strict': [WARN, 'safe'],

    // Variables
    'init-declarations': OFF(
      "I don't have a super strong feeling on this one since the presence of TypeScript kinda forces you to init declarations anyway"
    ),
    'no-delete-var': WARN,
    'no-label-var': WARN,
    'no-restricted-globals': [WARN, ...restrictedGlobals],
    'no-shadow': WARN,
    'no-shadow-restricted-names': WARN,
    'no-undef': ERROR,
    'no-undef-init': WARN,
    'no-undefined': OFF(
      "I look forward to a world where the problem that necessitates this rule's existence doesn't exist anymore.  Although shadowing `undefined` is super nasty, the utility of this language primitive is too strong to disable outright."
    ),
    'no-unused-vars': [WARN, { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
    'no-use-before-define': WARN,

    // Stylistic Issues
    'camelcase': WARN,
    'capitalized-comments': OFF(
      'the reality is that to many things exist in comments that should not be bound by rules (compiler directives, jsDoc, type information, etc.)'
    ),
    'consistent-this': [WARN, 'self'],
    'func-name-matching': WARN,
    'func-names': UNKNOWN, // still thinking about the implications of this one
    'func-style': [WARN, 'declaration', { allowArrowFunctions: true }],

    'id-denylist': OFF(PROJECT_BY_PROJECT),
    'id-length': [
      WARN,
      {
        min: 2,
        exceptions: [
          'a',
          'b', // commonly used in general purpose comparator functions where (definitionally, since the functions are general purpose) no better name can be given
          '_', // often used to indicate an intentionally unused variable as well as for underscore/lodash/ramda/scoreunder/etc.
          'i',
          'j', // iterators
        ],
        properties: 'never', // sometimes there are properties in existing data (i.e. 3rd party data) you are trying to map to that you simply can't control.
      },
    ],
    'id-match': SUCCESSOR('@typescript-eslint/naming-convention'),
    'lines-between-class-members': [WARN, 'always', { exceptAfterSingleLine: true }],
    'max-depth': [WARN, 7],

    'max-lines': [WARN, { max: 1000 }],
    'max-lines-per-function': [
      WARN,
      {
        max: 150,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: false,
      },
    ],
    'max-nested-callbacks': WARN,
    'max-params': [WARN, { max: 9 }], // the reason for this precaution is that many libraries (both in terms of the typescript types and the implementations themselves) that seem magical suddenly become very un-magical and break horribly when you get into a large number of arguments because the authors have (often silently) decided that they don't want to actually support variadic arguments for realz while at the same time appear like they do.  For example: https://github.com/ramda/ramda/blob/v0.26.1/source/internal/_arity.js is a function almost every ramda call passes through.  Keep an eye on https://github.com/Microsoft/TypeScript/issues/5453.
    'max-statements': [WARN, { max: 30 }],
    'max-statements-per-line': [WARN, { max: 2 }],
    'multiline-comment-style': OFF(
      'The programmer should be free to comment code how they like (that is to say, almost never).'
    ),

    'new-cap': OFF('`new` should, these days, basically not be used'),
    'no-array-constructor': WARN,
    'no-bitwise': WARN,
    'no-continue': OFF("Shouldn't be using labels. This encourages labels."),
    'no-inline-comments': OFF('inline comments === good.'),
    'no-lonely-if': WARN,
    'no-mixed-operators': [
      WARN,
      {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: false,
      },
    ],
    'no-multi-assign': WARN,
    'no-negated-condition': OFF(
      'when checking for falsy conditions in ternaries negative conditions feel more natural'
    ),
    'no-nested-ternary': SUCCESSOR('unicorn/no-nested-ternary'),
    'no-new-object': WARN,
    'no-plusplus': WARN,
    'no-restricted-syntax': OFF(PROJECT_BY_PROJECT),

    'no-ternary': OFF(
      "ternaries are more complex, yes, but it's a level of complexity I think is more than acceptable in the context of the kinds of functional programming use cases this config is intended for."
    ),

    'no-underscore-dangle': OFF("it has a legitimate semantic meaning that's widely used."),
    'no-unneeded-ternary': WARN,
    'one-var': [WARN, 'never'],
    'operator-assignment': WARN, // clarity comes at the cost of disallowing terseness.
    'prefer-exponentiation-operator': WARN,
    'prefer-object-spread': WARN,
    'sort-keys': OFF(
      'There are too many use cases where the order of keys should not be alphabetical'
    ),
    'sort-vars': WARN, // multiple declaration is turned off anyway.
    'spaced-comment': [
      WARN,
      'always',
      {
        exceptions: ['/', '*', '-', '* '], // for ASCII art :)
        markers: [
          '/', // for TypeScript directives, doxygen, vsdoc, etc. (which use `///`)
          '?', // for Quokka
        ],
      },
    ],

    // Disabled due to overlap with code formatters, eg Prettier
    'lines-around-comment': OFF(CODE_FORMATTING),
    'max-len': OFF(CODE_FORMATTING),
    'no-confusing-arrow': OFF(CODE_FORMATTING),
    'no-tabs': OFF(CODE_FORMATTING),
    'no-unexpected-multiline': OFF(CODE_FORMATTING),
    'quotes': OFF(CODE_FORMATTING),

    'array-bracket-newline': OFF(CODE_FORMATTING),
    'array-bracket-spacing': OFF(CODE_FORMATTING),
    'array-element-newline': OFF(CODE_FORMATTING),
    'arrow-parens': OFF(CODE_FORMATTING),
    'arrow-spacing': OFF(CODE_FORMATTING),
    'block-spacing': OFF(CODE_FORMATTING),
    'brace-style': OFF(CODE_FORMATTING),
    'comma-dangle': OFF(CODE_FORMATTING),
    'comma-spacing': OFF(CODE_FORMATTING),
    'comma-style': OFF(CODE_FORMATTING),
    'computed-property-spacing': OFF(CODE_FORMATTING),
    'dot-location': OFF(CODE_FORMATTING),
    'eol-last': OFF(CODE_FORMATTING),
    'func-call-spacing': OFF(CODE_FORMATTING),
    'function-call-argument-newline': OFF(CODE_FORMATTING),
    'function-paren-newline': OFF(CODE_FORMATTING),
    'generator-star': OFF(CODE_FORMATTING),
    'generator-star-spacing': OFF(CODE_FORMATTING),
    'implicit-arrow-linebreak': OFF(CODE_FORMATTING),
    'indent': OFF(CODE_FORMATTING),
    'jsx-quotes': OFF(CODE_FORMATTING),
    'key-spacing': OFF(CODE_FORMATTING),
    'keyword-spacing': OFF(CODE_FORMATTING),
    'line-comment-position': OFF(CODE_FORMATTING),
    'linebreak-style': OFF(CODE_FORMATTING),
    'multiline-ternary': OFF(CODE_FORMATTING),
    'newline-per-chained-call': OFF(CODE_FORMATTING),
    'new-parens': OFF(CODE_FORMATTING),
    'no-arrow-condition': OFF(CODE_FORMATTING),
    'no-comma-dangle': OFF(CODE_FORMATTING),
    'no-extra-parens': OFF(CODE_FORMATTING),
    'no-extra-semi': OFF(CODE_FORMATTING),
    'no-floating-decimal': OFF(CODE_FORMATTING),
    'no-mixed-spaces-and-tabs': OFF(CODE_FORMATTING),
    'no-multi-spaces': OFF(CODE_FORMATTING),
    'no-multiple-empty-lines': OFF(CODE_FORMATTING),
    'no-reserved-keys': OFF(CODE_FORMATTING),
    'no-space-before-semi': OFF(CODE_FORMATTING),
    'no-trailing-spaces': OFF(CODE_FORMATTING),
    'no-whitespace-before-property': OFF(CODE_FORMATTING),
    'no-wrap-func': OFF(CODE_FORMATTING),
    'nonblock-statement-body-position': OFF(CODE_FORMATTING),
    'object-curly-newline': OFF(CODE_FORMATTING),
    'object-curly-spacing': OFF(CODE_FORMATTING),
    'object-property-newline': OFF(CODE_FORMATTING),
    'one-var-declaration-per-line': OFF(CODE_FORMATTING),
    'operator-linebreak': OFF(CODE_FORMATTING),
    'padded-blocks': OFF(CODE_FORMATTING),
    'padding-line-between-statements': OFF(CODE_FORMATTING),
    'quote-props': OFF(CODE_FORMATTING),
    'rest-spread-spacing': OFF(CODE_FORMATTING),
    'semi': OFF(CODE_FORMATTING),
    'semi-spacing': OFF(CODE_FORMATTING),
    'semi-style': OFF(CODE_FORMATTING),
    'space-after-function-name': OFF(CODE_FORMATTING),
    'space-after-keywords': OFF(CODE_FORMATTING),
    'space-before-blocks': OFF(CODE_FORMATTING),
    'space-before-function-paren': OFF(CODE_FORMATTING),
    'space-before-function-parentheses': OFF(CODE_FORMATTING),
    'space-before-keywords': OFF(CODE_FORMATTING),
    'space-in-brackets': OFF(CODE_FORMATTING),
    'space-in-parens': OFF(CODE_FORMATTING),
    'space-infix-ops': OFF(CODE_FORMATTING),
    'space-return-throw-case': OFF(CODE_FORMATTING),
    'space-unary-ops': OFF(CODE_FORMATTING),
    'space-unary-word-ops': OFF(CODE_FORMATTING),
    'switch-colon-spacing': OFF(CODE_FORMATTING),
    'template-curly-spacing': OFF(CODE_FORMATTING),
    'template-tag-spacing': OFF(CODE_FORMATTING),
    'unicode-bom': OFF(CODE_FORMATTING),
    'wrap-iife': OFF(CODE_FORMATTING),
    'wrap-regex': OFF(CODE_FORMATTING),
    'yield-star-spacing': OFF(CODE_FORMATTING),

    // ECMAScript 6
    'arrow-body-style': [WARN, 'as-needed'],
    'constructor-super': WARN,
    'no-class-assign': WARN,
    'no-const-assign': WARN,
    'no-dupe-class-members': WARN,
    'no-dupe-else-if': WARN,
    'no-new-symbol': WARN,
    'no-restricted-exports': OFF(PROJECT_BY_PROJECT),
    'no-restricted-imports': [
      WARN,
      {
        paths: [
          {
            name: 'lodash',
            message: 'Please use brandingbrand utilities.',
          },
          {
            name: 'lodash-es',
            message: 'Please use brandingbrand utilities.',
          },
          {
            name: 'fp-ts',
            message: 'Please use brandingbrand utilities.',
          },
          {
            name: 'styled-components',
            message: 'Styled components has a large type checking cost.',
          },
        ],
      },
    ],
    'no-this-before-super': WARN,
    'no-useless-computed-key': WARN,
    'no-useless-constructor': WARN,
    'no-useless-rename': WARN,
    'no-var': WARN,
    'object-shorthand': [WARN, 'always'],
    'prefer-arrow-callback': WARN,
    'prefer-const': WARN,
    'prefer-destructuring': WARN,
    'prefer-numeric-literals': WARN,
    'prefer-rest-params': WARN,
    'prefer-spread': WARN,
    'prefer-template': WARN,
    'require-yield': WARN,
    'symbol-description': WARN,

    // plugin:compat ***********************************************************
    // rules URL: https://github.com/amilajack/eslint-plugin-compat
    'compat/compat': OFF(PROJECT_BY_PROJECT),

    // plugin:eslint-comments **************************************************
    // rules URL: https://github.com/mysticatea/eslint-plugin-eslint-comments/tree/master/docs/rules
    'eslint-comments/disable-enable-pair': WARN,
    'eslint-comments/no-aggregating-enable': WARN,
    'eslint-comments/no-duplicate-disable': WARN,
    'eslint-comments/no-unlimited-disable': WARN,
    'eslint-comments/no-unused-disable': WARN,
    'eslint-comments/no-unused-enable': WARN,
    'eslint-comments/no-restricted-disable': OFF(PROJECT_BY_PROJECT),
    'eslint-comments/no-use': OFF("Exceptions exist.  It's javascript, after all."),
    'eslint-comments/require-description': [WARN, { ignore: ['eslint-enable'] }],

    // plugin:fp ***************************************************************
    // rules URL: https://github.com/jfmengels/eslint-plugin-fp#rules
    'fp/no-arguments': WARN,
    'fp/no-class': OFF(),
    'fp/no-delete': WARN,
    'fp/no-events': WARN,
    'fp/no-get-set': OFF(),
    'fp/no-let': OFF(),
    'fp/no-loops': OFF(),
    'fp/no-mutating-assign': WARN,
    'fp/no-mutating-methods': OFF(),
    'fp/no-mutation': OFF(),
    'fp/no-nil': OFF(),
    'fp/no-proxy': OFF(),
    'fp/no-rest-parameters': OFF(),
    'fp/no-this': OFF(),
    'fp/no-throw': OFF(),
    'fp/no-unused-expression': OFF(),
    'fp/no-valueof-field': OFF(),

    // plugin:import ***********************************************************
    // rules URL: https://github.com/benmosher/eslint-plugin-import#rules

    // Static analysis
    'import/no-unresolved': [WARN, { amd: true, commonjs: true }],
    'import/default': WARN,
    'import/named': WARN,
    'import/namespace': WARN,
    'import/no-absolute-path': WARN,
    'import/no-cycle': WARN,
    'import/no-dynamic-require': WARN,
    'import/no-internal-modules': OFF(PROJECT_BY_PROJECT),
    'import/no-relative-parent-imports': OFF(NOT_VALUABLE),
    'import/no-restricted-paths': OFF(PROJECT_BY_PROJECT),
    'import/no-self-import': OFF(LARGE_PERFORMANCE_COST),
    'import/no-unused-modules': WARN,
    'import/no-useless-path-segments': OFF(LARGE_PERFORMANCE_COST),
    'import/no-webpack-loader-syntax': WARN,

    // Helpful warnings
    'import/export': WARN,
    'import/no-deprecated': WARN,
    'import/no-extraneous-dependencies': OFF(
      "This rule doesn't play nice with monorepos, unfortunately"
    ),
    'import/no-mutable-exports': WARN,
    'import/no-named-as-default': OFF(LARGE_PERFORMANCE_COST),
    'import/no-named-as-default-member': WARN,

    // Module systems
    'import/no-amd': WARN,
    'import/no-commonjs': WARN,
    'import/no-nodejs-modules': OFF(),
    'import/unambiguous': BUGGY(
      'eslint-plugin-import:v2.21.1',
      "seems that this doesn't work with TypeScript (`d.ts`) definition files or ts files that only export TypeScript types."
    ),

    // Stylistic
    'import/dynamic-import-chunkname': OFF(
      "It is nice to have the option to define a chunk name, but it shouldn't be required"
    ),
    'import/exports-last': OFF("I see no reason exports can't be sprinkled throughout the file"),
    'import/extensions': OFF(PROJECT_BY_PROJECT),
    'import/group-exports': OFF(
      `tooling should easily answer the question of "what's exported from this module".  no need to do anything the IDE does for you.`
    ),
    'import/max-dependencies': [WARN, { max: 40 }], // I _almost_ want to turn this rule off(), but setting it to a high number with a lighter infraction (a WARN) seems better.
    'import/no-anonymous-default-export': WARN, // since I've opted to not disallow default exports entirely, it seems at least good to make them annoying to use.
    'import/no-default-export': OFF(
      'Unfortunately some systems (e.g. Gatsby) hinge on usage of default exports.'
    ),
    'import/no-named-default': WARN,
    'import/no-named-export': OFF(),
    'import/no-namespace': OFF(
      "typescript uses namespace imports - I'm not otherwise sure what the motivation for turning this off would be"
    ),
    'import/no-unassigned-import': OFF(
      'there just seem to be too may places where this has to be done'
    ),
    'import/prefer-default-export': OFF(
      'named exports are better (for one reason, because TypeScript can automatically import a named resource)'
    ),

    // plugin:jsdoc ************************************************************
    // rules URL: https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules
    'jsdoc/check-access': WARN,
    'jsdoc/check-alignment': WARN,
    'jsdoc/check-examples': OFF('https://github.com/eslint/eslint/issues/14745'),
    'jsdoc/check-indentation': OFF(),
    'jsdoc/check-line-alignment': WARN,
    'jsdoc/check-param-names': WARN,
    'jsdoc/check-property-names': WARN,
    'jsdoc/check-syntax': WARN,
    'jsdoc/check-tag-names': [
      WARN,
      {
        definedTags: [
          'usageNotes',
          'publicApi',
          'internal',
          /**
           * TypeScript Schema JSON directives
           *
           * @see https://github.com/YousefED/typescript-json-schema/blob/master/api.md
           */
          '$id',
          '$ref',
          'additionalProperties',
          'chance',
          'examples',
          'ignore',
          'important',
          'items',
          'minimum',
          'minItems',
          'maximum',
          'maxItems',
          'nullable',
          'title',
          'TJS-ignore',
          'TJS-type',
          'TJS-format',
          'TJS-hide',
          'TJS-minimum',
          'TJS-pattern',
        ],
      },
    ],
    'jsdoc/check-types': WARN,
    'jsdoc/check-values': WARN,
    'jsdoc/empty-tags': WARN,
    'jsdoc/implements-on-classes': WARN,
    'jsdoc/match-name': OFF(),
    'jsdoc/match-description': OFF(),
    'jsdoc/multiline-blocks': WARN,
    'jsdoc/newline-after-description': WARN,
    'jsdoc/no-bad-blocks': WARN,
    'jsdoc/no-defaults': WARN,
    'jsdoc/no-missing-syntax': OFF(PROJECT_BY_PROJECT),
    'jsdoc/no-multi-asterisks': WARN,
    'jsdoc/no-restricted-syntax': OFF(PROJECT_BY_PROJECT),
    'jsdoc/no-types': OFF(),
    'jsdoc/no-undefined-types': WARN,
    'jsdoc/require-asterisk-prefix': WARN,
    'jsdoc/require-description': WARN,
    'jsdoc/require-description-complete-sentence': OFF(),
    'jsdoc/require-example': OFF(),
    'jsdoc/require-file-overview': OFF(),
    'jsdoc/require-hyphen-before-param-description': OFF(),
    'jsdoc/require-jsdoc': WARN,
    'jsdoc/require-param': WARN,
    'jsdoc/require-param-description': WARN,
    'jsdoc/require-param-name': WARN,
    'jsdoc/require-param-type': WARN,
    'jsdoc/require-property': WARN,
    'jsdoc/require-property-description': WARN,
    'jsdoc/require-property-name': WARN,
    'jsdoc/require-property-type': WARN,
    'jsdoc/require-returns': WARN,
    'jsdoc/require-returns-check': WARN,
    'jsdoc/require-returns-description': WARN,
    'jsdoc/require-returns-type': WARN,
    'jsdoc/require-throws': WARN,
    'jsdoc/require-yields': WARN,
    'jsdoc/require-yields-check': WARN,
    'jsdoc/sort-tags': WARN,
    'jsdoc/tag-lines': WARN,
    'jsdoc/valid-types': WARN,

    // plugin:prefer-arrow *****************************************************
    // rules URL: https://github.com/TristonJ/eslint-plugin-prefer-arrow#configuration
    'prefer-arrow/prefer-arrow-functions': [
      WARN,
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        // eslint-disable-next-line unicorn/no-keyword-prefix -- Externally Defined
        classPropertiesAllowed: false,
      },
    ],

    // plugin:no-secrets *******************************************************
    // rules URL: https://github.com/nickdeis/eslint-plugin-no-secrets
    'no-secrets/no-secrets': [WARN, { tolerance: 6 }],

    // plugin:sonarjs ************************************************************
    // rules URL: https://github.com/SonarSource/eslint-plugin-sonarjs#rules
    'sonarjs/cognitive-complexity': WARN,
    'sonarjs/elseif-without-else': OFF('this conflicts with no-else-return'),
    'sonarjs/max-switch-cases': WARN,
    'sonarjs/no-all-duplicated-branches': WARN,
    'sonarjs/no-collapsible-if': WARN,
    'sonarjs/no-collection-size-mischeck': WARN,
    'sonarjs/no-duplicate-string': [WARN, 9],
    'sonarjs/no-duplicated-branches': WARN,
    'sonarjs/no-element-overwrite': WARN,
    'sonarjs/no-empty-collection': WARN,
    'sonarjs/non-existent-operator': WARN,
    'sonarjs/no-gratuitous-expressions': WARN,
    'sonarjs/no-extra-arguments': WARN,
    'sonarjs/no-identical-conditions': WARN,
    'sonarjs/no-identical-functions': WARN,
    'sonarjs/no-identical-expressions': WARN,
    'sonarjs/no-inverted-boolean-check': WARN,
    'sonarjs/no-ignored-return': WARN,
    'sonarjs/no-nested-switch': WARN,
    'sonarjs/no-nested-template-literals': WARN,
    'sonarjs/no-one-iteration-loop': WARN,
    'sonarjs/no-redundant-boolean': WARN,
    'sonarjs/no-redundant-jump': WARN,
    'sonarjs/no-same-line-conditional': WARN,
    'sonarjs/no-small-switch': WARN,
    'sonarjs/no-unused-collection': WARN,
    'sonarjs/no-use-of-empty-return-value': WARN,
    'sonarjs/no-useless-catch': WARN,
    'sonarjs/prefer-immediate-return': WARN,
    'sonarjs/prefer-object-literal': WARN,
    'sonarjs/prefer-single-boolean-return': WARN,
    'sonarjs/prefer-while': WARN,

    // plugin:security *********************************************************
    // rules URL: https://github.com/nodesecurity/eslint-plugin-security#rules
    'security/detect-unsafe-regex': SUCCESSOR('unicorn/no-unsafe-regex'),
    'security/detect-disable-mustache-escape': WARN,
    'security/detect-eval-with-expression': WARN,
    'security/detect-non-literal-regexp': WARN,
    'security/detect-non-literal-require': WARN,
    'security/detect-object-injection': BUGGY(
      'unknown',
      'Unable to determine the difference between user provided data and derived keys'
    ),
    'security/detect-possible-timing-attacks': WARN,
    'security/detect-pseudoRandomBytes': OFF(),
    'security/detect-buffer-noassert': OFF(),
    'security/detect-child-process': OFF(),
    'security/detect-new-buffer': OFF(),
    'security/detect-no-csrf-before-method-override': OFF(),
    'security/detect-non-literal-fs-filename': OFF(),

    // plugin:sort-destructure-keys *********************************************
    // rules URL: https://github.com/mthadley/eslint-plugin-sort-destructure-keys
    'sort-destructure-keys/sort-destructure-keys': WARN,

    // plugin:ternary **********************************************************
    // rules URL: https://github.com/grayedfox/eslint-plugin-ternary#rules
    'ternary/no-dupe': WARN,
    'ternary/no-unreachable': BUGGY('eslint-plugin-ternary@1.0.3', 'Invalidly detects duplicates'),
    'ternary/nesting': SUCCESSOR('unicorn/no-nested-ternary'),

    // plugin:unicorn **********************************************************
    // rules URL: https://github.com/sindresorhus/eslint-plugin-unicorn#rules
    'unicorn/better-regex': WARN,
    'unicorn/catch-error-name': WARN,
    'unicorn/consistent-destructuring': WARN,
    'unicorn/consistent-function-scoping': [WARN, { checkArrowFunctions: false }],
    'unicorn/custom-error-definition': OFF(
      'There are a few conventions for building errors and this only covers one of them making its usefulness limited'
    ),
    'unicorn/error-message': WARN,
    'unicorn/escape-case': WARN,
    'unicorn/expiring-todo-comments': [WARN, { allowWarningComments: false }],
    'unicorn/explicit-length-check': WARN,
    'unicorn/filename-case': WARN,
    'unicorn/import-index': WARN,
    'unicorn/import-style': OFF(NOT_VALUABLE),
    'unicorn/new-for-builtins': WARN,
    'unicorn/no-abusive-eslint-disable': WARN,
    'unicorn/no-array-callback-reference': OFF(TYPESCRIPT),
    'unicorn/no-array-for-each': WARN,
    'unicorn/no-array-push-push': WARN,
    'unicorn/no-array-method-this-argument': WARN,
    'unicorn/no-array-reduce': WARN,
    'unicorn/no-await-expression-member': WARN,
    'unicorn/no-console-spaces': WARN,
    'unicorn/no-document-cookie': WARN,
    'unicorn/no-empty-file': WARN,
    'unicorn/no-for-loop': WARN,
    'unicorn/no-hex-escape': WARN,
    'unicorn/no-instanceof-array': WARN,
    'unicorn/no-invalid-remove-event-listener': WARN,
    'unicorn/no-keyword-prefix': WARN,
    'unicorn/no-lonely-if': WARN,
    'unicorn/no-new-array': WARN,
    'unicorn/no-new-buffer': WARN,
    'unicorn/no-null': OFF('null is often times used by third party libraries like such as an ORM'),
    'unicorn/no-object-as-default-parameter': WARN,
    'unicorn/no-process-exit': WARN,
    'unicorn/no-static-only-class': WARN,
    'unicorn/no-thenable': WARN,
    'unicorn/no-this-assignment': WARN,
    'unicorn/no-unreadable-array-destructuring': WARN,
    'unicorn/no-unreadable-iife': WARN,
    'unicorn/no-unsafe-regex': WARN,
    'unicorn/no-unused-properties': WARN,
    'unicorn/no-useless-fallback-in-spread': WARN,
    'unicorn/no-useless-length-check': WARN,
    'unicorn/no-useless-promise-resolve-reject': WARN,
    'unicorn/no-useless-spread': WARN,
    'unicorn/no-useless-switch-case': WARN,
    'unicorn/no-useless-undefined': OFF(
      'While this is a good idea for consistency, it conflicts with `consistent-return` which I think is more important'
    ),
    'unicorn/no-zero-fractions': WARN,
    'unicorn/numeric-separators-style': WARN,
    'unicorn/prefer-at': OFF(PROJECT_BY_PROJECT),
    'unicorn/prefer-add-event-listener': WARN,
    'unicorn/prefer-array-find': WARN,
    'unicorn/prefer-array-flat': WARN,
    'unicorn/prefer-array-flat-map': WARN,
    'unicorn/prefer-array-index-of': WARN,
    'unicorn/prefer-array-some': WARN,
    'unicorn/prefer-code-point': WARN,
    'unicorn/prefer-date-now': WARN,
    'unicorn/prefer-default-parameters': WARN,
    'unicorn/prefer-dom-node-append': WARN,
    'unicorn/prefer-dom-node-dataset': WARN,
    'unicorn/prefer-dom-node-remove': WARN,
    'unicorn/prefer-dom-node-text-content': WARN,
    'unicorn/prefer-export-from': WARN,
    'unicorn/prefer-includes': WARN,
    'unicorn/prefer-json-parse-buffer': WARN,
    'unicorn/prefer-keyboard-event-key': WARN,
    'unicorn/prefer-math-trunc': WARN,
    'unicorn/prefer-modern-dom-apis': WARN,
    'unicorn/prefer-modern-math-apis': WARN,
    'unicorn/prefer-module': WARN,
    'unicorn/prefer-native-coercion-functions': WARN,
    'unicorn/prefer-negative-index': WARN,
    'unicorn/prefer-node-protocol': OFF(
      'This requires a `@types/node` update upstream to support this'
    ),
    'unicorn/prefer-number-properties': WARN,
    'unicorn/prefer-object-from-entries': WARN,
    'unicorn/prefer-object-has-own': WARN,
    'unicorn/prefer-optional-catch-binding': WARN,
    'unicorn/prefer-prototype-methods': WARN,
    'unicorn/prefer-query-selector': WARN,
    'unicorn/prefer-reflect-apply': WARN,
    'unicorn/prefer-regexp-test': WARN,
    'unicorn/prefer-set-has': WARN,
    'unicorn/prefer-spread': WARN,
    'unicorn/prefer-string-replace-all': OFF(ES2021),
    'unicorn/prefer-string-slice': WARN,
    'unicorn/prefer-string-starts-ends-with': WARN,
    'unicorn/prefer-string-trim-start-end': WARN,
    'unicorn/prefer-switch': WARN,
    'unicorn/prefer-ternary': WARN,
    'unicorn/prefer-top-level-await': OFF(PROJECT_BY_PROJECT),
    'unicorn/prefer-type-error': WARN,
    'unicorn/prevent-abbreviations': OFF(PROJECT_BY_PROJECT),
    'unicorn/relative-url-style': WARN,
    'unicorn/require-array-join-separator': WARN,
    'unicorn/require-number-to-fixed-digits-argument': WARN,
    'unicorn/require-post-message-target-origin': WARN,
    'unicorn/string-content': OFF(),
    'unicorn/template-indent': WARN,
    'unicorn/text-encoding-identifier-case': WARN,
    'unicorn/throw-new-error': WARN,

    // Disabled due to overlap with code formatters, eg Prettier
    'unicorn/empty-brace-spaces': OFF(CODE_FORMATTING),
    'unicorn/no-nested-ternary': OFF(CODE_FORMATTING),
    'unicorn/number-literal-case': OFF(CODE_FORMATTING),
  },
};
