import base from './base';
import {
  BUGGY,
  CODE_FORMATTING,
  ERROR,
  OFF,
  SUCCESSOR,
  TYPESCRIPT,
  TYPESCRIPT_EXTENDED,
  WARN,
} from './utils';

export = {
  extends: './base.js',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // plugin:eslint ***********************************************************
    // rules URL: https://github.com/eslint/eslint/tree/master/docs/rules

    // Disabled because TypeScript inherently checks
    'strict': [ERROR, 'never'],

    'constructor-super': OFF(TYPESCRIPT),
    'getter-return': OFF(TYPESCRIPT),
    'no-const-assign': OFF(TYPESCRIPT),
    'no-dupe-args': OFF(TYPESCRIPT),
    'no-dupe-keys': OFF(TYPESCRIPT),
    'no-func-assign': OFF(TYPESCRIPT),
    'no-new-symbol': OFF(TYPESCRIPT),
    'no-obj-calls': OFF(TYPESCRIPT),
    'no-this-before-super': OFF(TYPESCRIPT),
    'no-undef': OFF(TYPESCRIPT),
    'no-unreachable': OFF(TYPESCRIPT),
    'no-unsafe-negation': OFF(TYPESCRIPT),
    'valid-typeof': OFF(TYPESCRIPT),

    // Disabled because @typescript-eslint extends the rule
    'brace-style': OFF(TYPESCRIPT_EXTENDED),
    'camelcase': SUCCESSOR('@typescript-eslint/naming-convention'),
    'default-param-last': OFF(TYPESCRIPT_EXTENDED),
    'dot-notation': OFF(TYPESCRIPT_EXTENDED),
    'init-declarations': OFF(TYPESCRIPT_EXTENDED),
    'no-dupe-class-members': OFF(TYPESCRIPT_EXTENDED),
    'no-extra-parens': OFF(TYPESCRIPT_EXTENDED),
    'no-extra-semi': OFF(TYPESCRIPT_EXTENDED),
    'no-loss-of-precision': OFF(TYPESCRIPT_EXTENDED),
    'no-empty-function': OFF(TYPESCRIPT_EXTENDED),
    'no-implied-eval': OFF(TYPESCRIPT_EXTENDED),
    'no-invalid-this': OFF(TYPESCRIPT_EXTENDED),
    'no-loop-func': OFF(TYPESCRIPT_EXTENDED),
    'no-magic-numbers': OFF(TYPESCRIPT_EXTENDED),
    'no-redeclare': OFF(TYPESCRIPT_EXTENDED),
    'no-shadow': OFF(TYPESCRIPT_EXTENDED),
    'no-throw-literal': OFF(TYPESCRIPT_EXTENDED),
    'no-unused-expressions': OFF(TYPESCRIPT_EXTENDED),
    'no-unused-vars': OFF(TYPESCRIPT_EXTENDED),
    'no-use-before-define': OFF(TYPESCRIPT_EXTENDED),
    'comma-dangle': OFF(TYPESCRIPT_EXTENDED),
    'comma-spacing': OFF(TYPESCRIPT_EXTENDED),
    'func-call-spacing': OFF(TYPESCRIPT_EXTENDED),
    'indent': OFF(TYPESCRIPT_EXTENDED),
    'keyword-spacing': OFF(TYPESCRIPT_EXTENDED),
    'lines-between-class-members': OFF(TYPESCRIPT_EXTENDED),
    'no-array-constructor': OFF(TYPESCRIPT_EXTENDED),
    'no-duplicate-imports': SUCCESSOR('@typescript-eslint/no-duplicate-imports'),
    'no-restricted-imports': OFF(TYPESCRIPT_EXTENDED),
    'no-useless-constructor': OFF(TYPESCRIPT_EXTENDED),
    'object-curly-spacing': OFF(TYPESCRIPT_EXTENDED),
    'padding-line-between-statements': OFF(TYPESCRIPT_EXTENDED),
    'quotes': OFF(TYPESCRIPT_EXTENDED),
    'require-await': OFF(TYPESCRIPT_EXTENDED),
    'semi': OFF(TYPESCRIPT_EXTENDED),
    'space-before-blocks': OFF(TYPESCRIPT_EXTENDED),
    'space-before-function-paren': OFF(TYPESCRIPT_EXTENDED),
    'space-infix-ops': OFF(TYPESCRIPT_EXTENDED),

    // plugin:import ***********************************************************
    // rules URL: https://github.com/benmosher/eslint-plugin-import#rules
    'import/named': OFF(TYPESCRIPT),
    'import/namespace': OFF(TYPESCRIPT),
    'import/default': OFF(TYPESCRIPT),
    'import/no-named-as-default-member': OFF(TYPESCRIPT),
    'import/no-unresolved': OFF(TYPESCRIPT),

    // plugin:jsdoc ************************************************************
    // rules URL: https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules
    'jsdoc/no-types': WARN,
    'jsdoc/no-undefined-types': OFF(TYPESCRIPT),
    'jsdoc/require-param-type': OFF(TYPESCRIPT),
    'jsdoc/require-returns-type': OFF(TYPESCRIPT),

    // plugin:@typescript-eslint ***********************************************
    // rules URL: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin

    // extension rules
    '@typescript-eslint/brace-style': base.rules['brace-style'],
    '@typescript-eslint/comma-dangle': base.rules['comma-dangle'],
    '@typescript-eslint/comma-spacing': base.rules['comma-spacing'],
    '@typescript-eslint/default-param-last': base.rules['default-param-last'],
    '@typescript-eslint/dot-notation': base.rules['dot-notation'],
    '@typescript-eslint/func-call-spacing': base.rules['func-call-spacing'],
    '@typescript-eslint/indent': base.rules.indent,
    '@typescript-eslint/init-declarations': base.rules['init-declarations'],
    '@typescript-eslint/keyword-spacing': base.rules['keyword-spacing'],
    '@typescript-eslint/lines-between-class-members': base.rules['lines-between-class-members'],
    '@typescript-eslint/no-array-constructor': base.rules['no-array-constructor'],
    '@typescript-eslint/no-dupe-class-members': OFF(TYPESCRIPT),
    '@typescript-eslint/no-duplicate-imports': base.rules['no-duplicate-imports'],
    '@typescript-eslint/no-empty-function': base.rules['no-empty-function'],
    '@typescript-eslint/no-extra-parens': base.rules['no-extra-parens'],
    '@typescript-eslint/no-extra-semi': base.rules['no-extra-semi'],
    '@typescript-eslint/no-implied-eval': base.rules['no-implied-eval'],
    '@typescript-eslint/no-invalid-this': base.rules['no-invalid-this'],
    '@typescript-eslint/no-loop-func': base.rules['no-loop-func'],
    '@typescript-eslint/no-loss-of-precision': base.rules['no-loss-of-precision'],
    '@typescript-eslint/no-magic-numbers': base.rules['no-magic-numbers'],
    '@typescript-eslint/no-redeclare': base.rules['no-redeclare'],
    '@typescript-eslint/no-restricted-imports': base.rules['no-restricted-imports'],
    '@typescript-eslint/no-shadow': base.rules['no-shadow'],
    '@typescript-eslint/no-throw-literal': base.rules['no-throw-literal'],
    '@typescript-eslint/no-unused-expressions': base.rules['no-unused-expressions'],
    '@typescript-eslint/no-unused-vars': base.rules['no-unused-vars'],
    '@typescript-eslint/no-use-before-define': base.rules['no-use-before-define'],
    '@typescript-eslint/no-useless-constructor': base.rules['no-useless-constructor'],
    '@typescript-eslint/object-curly-spacing': base.rules['object-curly-spacing'],
    '@typescript-eslint/padding-line-between-statements':
      base.rules['padding-line-between-statements'],
    '@typescript-eslint/quotes': base.rules.quotes,
    '@typescript-eslint/require-await': base.rules['require-await'],
    '@typescript-eslint/return-await': base.rules['no-return-await'],
    '@typescript-eslint/semi': base.rules.semi,
    '@typescript-eslint/space-before-blocks': base.rules['space-before-blocks'],
    '@typescript-eslint/space-before-function-paren': base.rules['space-before-function-paren'],
    '@typescript-eslint/space-infix-ops': base.rules['space-infix-ops'],

    // Possible Errors
    '@typescript-eslint/adjacent-overload-signatures': WARN,
    '@typescript-eslint/array-type': [WARN, { default: 'array-simple' }],
    '@typescript-eslint/await-thenable': WARN,
    '@typescript-eslint/ban-ts-comment': [
      WARN,
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
      },
    ],
    '@typescript-eslint/ban-tslint-comment': WARN,
    '@typescript-eslint/ban-types': BUGGY(
      '@typescript-eslint/eslint-plugin:^4.20.0',
      "It would be nice to ban certain types, however there doesn't appear to be an option to disable the default disabled types"
    ),
    '@typescript-eslint/class-literal-property-style': WARN,
    '@typescript-eslint/consistent-indexed-object-style': WARN,
    '@typescript-eslint/consistent-type-assertions': [
      WARN,
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'allow-as-parameter',
      },
    ],
    '@typescript-eslint/consistent-type-definitions': [WARN, 'interface'],
    '@typescript-eslint/consistent-type-exports': WARN,
    '@typescript-eslint/consistent-type-imports': [
      WARN,
      { prefer: 'type-imports', disallowTypeAnnotations: true },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      WARN,
      {
        allowExpressions: true,
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
        allowDirectConstAssertionInArrowFunctions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'warn',
      {
        accessibility: 'explicit',
        overrides: {
          accessors: 'explicit',
          constructors: 'no-public',
          methods: 'explicit',
          properties: 'explicit',
          parameterProperties: 'explicit',
        },
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': OFF(
      'I prefer to rely on type inference as much as possible.'
    ),
    '@typescript-eslint/member-delimiter-style': OFF(CODE_FORMATTING),
    '@typescript-eslint/member-ordering': [
      WARN,
      {
        default: [
          'signature',

          'private-static-field',
          'private-static-method',
          'protected-static-field',
          'protected-static-method',
          'public-static-field',
          'public-static-method',

          'private-constructor',
          'protected-constructor',
          'public-constructor',

          'private-decorated-field',
          'protected-decorated-field',
          'public-decorated-field',
          'private-instance-field',
          'protected-instance-field',
          'public-instance-field',
          'private-abstract-field',
          'protected-abstract-field',
          'public-abstract-field',

          'private-method',
          'protected-method',
          'public-method',
        ],
      },
    ],
    '@typescript-eslint/method-signature-style': WARN, // I use strictFunctionTypes, and thus anything that gets me more contravariant is my friend
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: ['memberLike'],
        format: ['camelCase', 'PascalCase'],
        /**
         * Using leading underscores to denote private members is an
         * anti-pattern. This provides the illusion of privacy despite
         * in many cases external systems being built on top of that
         * implementation.
         *
         * In TypeScript we have member access modifiers in classes
         * which can provide design time privacy, and for true privacy
         * ES2019 Private Members can be leveraged.
         *
         * @see https://www.hyrumslaw.com
         */
        leadingUnderscore: 'forbid',
      },
      {
        selector: ['variableLike'],
        format: ['camelCase'],
        /**
         * Using leading underscores to denote private variables is an
         * anti-pattern. This provides the illusion of privacy despite
         * in many cases external systems being built on top of that
         * implementation.
         *
         * Use symbols, reflection or other true private mechanism to
         * ensure true privacy.
         *
         * @see https://www.hyrumslaw.com
         */
        leadingUnderscore: 'forbid',
      },
      {
        selector: ['parameter'],
        format: ['camelCase'],
        /**
         * A leading underscore when used with a parameter denotes
         * that the parameter is not used internally by the function
         *
         * This is often times used to build functions that follow
         * a certain interface for interoperability despite a specific
         * implementation not needing all the parameters provided.
         */
        leadingUnderscore: 'allow',
      },
      {
        selector: ['variable'],
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
        /**
         * Using leading underscores to denote private variables is an
         * anti-pattern. This provides the illusion of privacy despite
         * in many cases external systems being built on top of that
         * implementation.
         *
         * Use symbols, reflection or other true private mechanism to
         * ensure true privacy.
         *
         * @see https://www.hyrumslaw.com
         */
        leadingUnderscore: 'forbid',
      },
      {
        selector: ['variable'],
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        /**
         * Using leading underscores to denote private variables is an
         * anti-pattern. This provides the illusion of privacy despite
         * in many cases external systems being built on top of that
         * implementation.
         *
         * Use symbols, reflection or other true private mechanism to
         * ensure true privacy.
         *
         * @see https://www.hyrumslaw.com
         */
        leadingUnderscore: 'forbid',
      },
      {
        selector: ['function'],
        format: ['camelCase'],
        /**
         * Using leading underscores to denote private variables is an
         * anti-pattern. This provides the illusion of privacy despite
         * in many cases external systems being built on top of that
         * implementation.
         *
         * Use symbols, reflection or other true private mechanism to
         * ensure true privacy.
         *
         * @see https://www.hyrumslaw.com
         */
        leadingUnderscore: 'forbid',
      },
      {
        selector: ['typeParameter'],
        format: ['PascalCase'],
        custom: {
          regex: '^([A-Z][a-z](([A-Z]|[a-z])*[a-z])?)?([A-Z]|Type)$',
          match: true,
        },
        /**
         * Unlike parameters, type parameters are either inferred or
         * explicitly defined. They cannot be defined such that they
         * are compatible with an interface.
         *
         * To that end, there is no valid use case for an unused type
         * parameter
         */
        leadingUnderscore: 'forbid',
      },
      {
        selector: ['interface'],
        format: ['PascalCase'],
        /**
         * Using leading underscores to denote private interfaces is an
         * anti-pattern. This provides the illusion of privacy despite
         * in many cases external systems being built on top of that
         * implementation.
         *
         * Use `@internal` jsdocs and exclusive exports to keep
         * an interface internal to a specific library
         *
         * @see https://www.hyrumslaw.com
         */
        leadingUnderscore: 'forbid',
      },
      {
        selector: ['variable'],
        modifiers: ['destructured'],
        format: ['camelCase'],
        /**
         * A leading underscore when used with a destructured property denotes
         * that the parameter is explicitly being thrown away
         *
         * This is often times used to remove a specific value from from an
         * object with the rest of the properties being collected in a rest
         * variable
         */
        leadingUnderscore: 'allow',
      },
    ],
    '@typescript-eslint/no-base-to-string': WARN,
    '@typescript-eslint/no-confusing-non-null-assertion': WARN,
    '@typescript-eslint/no-confusing-void-expression': WARN,
    '@typescript-eslint/no-dynamic-delete': WARN,
    '@typescript-eslint/no-empty-interface': OFF(
      'Often has legitimate use when mocking out an API or showing intent'
    ),
    '@typescript-eslint/no-explicit-any': [WARN, { fixToUnknown: true }],
    '@typescript-eslint/no-extra-non-null-assertion': WARN, // I really love that this rule had to be made.  `thing!!!!!!!!!!!!!!!.shutUpTypeScript()`, lol.
    '@typescript-eslint/no-extraneous-class': [
      WARN,
      { allowWithDecorator: true, allowConstructorOnly: true },
    ],
    '@typescript-eslint/no-floating-promises': WARN,
    '@typescript-eslint/no-for-in-array': WARN,
    '@typescript-eslint/no-implicit-any-catch': SUCCESSOR('tsconfig.compilerOptions.strict'),
    '@typescript-eslint/no-inferrable-types': WARN,
    '@typescript-eslint/no-invalid-void-type': WARN,
    '@typescript-eslint/no-meaningless-void-operator': WARN,
    '@typescript-eslint/no-misused-new': ERROR,
    '@typescript-eslint/no-misused-promises': WARN,
    '@typescript-eslint/no-namespace': [WARN, { allowDeclarations: true }],
    '@typescript-eslint/no-non-null-asserted-optional-chain': WARN,
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': WARN,
    '@typescript-eslint/no-non-null-assertion': WARN, // I'll quote a friend (who is a better programmer than I am) about the non null assertion: "I wish I never learned of its existence."  Indeed, I view this character as a member of the same family as `any` and `@ts-ignore`.
    '@typescript-eslint/no-parameter-properties': OFF(
      'Parameter properties help clean up constructors and are particularly useful with dependency injection'
    ),
    '@typescript-eslint/no-redundant-type-constituents': WARN,
    '@typescript-eslint/no-require-imports': WARN,
    '@typescript-eslint/no-this-alias': WARN,
    '@typescript-eslint/no-type-alias': OFF(
      'The absence of Opaque types in TypeScript is the only remaining feature I miss from FlowType.  Until such a thing is implemented some day (and we seem to get closer every major release) I will continue to use aliases for primitive types.'
    ),
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': WARN,
    '@typescript-eslint/no-unnecessary-condition': WARN,
    '@typescript-eslint/no-unnecessary-qualifier': WARN,
    '@typescript-eslint/no-unnecessary-type-arguments': WARN,
    '@typescript-eslint/no-unnecessary-type-assertion': WARN,
    '@typescript-eslint/no-unnecessary-type-constraint': WARN,
    '@typescript-eslint/no-unsafe-assignment': WARN,
    '@typescript-eslint/no-unsafe-call': WARN,
    '@typescript-eslint/no-unsafe-member-access': WARN,
    '@typescript-eslint/no-unsafe-return': WARN,
    '@typescript-eslint/no-unsafe-argument': WARN,
    '@typescript-eslint/no-useless-empty-export': WARN,
    '@typescript-eslint/non-nullable-type-assertion-style': OFF(
      'using non-null assertions cancels the benefits of the strict null-checking mode..'
    ),
    '@typescript-eslint/no-var-requires': WARN,
    '@typescript-eslint/prefer-as-const': WARN,
    '@typescript-eslint/prefer-enum-initializers': WARN,
    '@typescript-eslint/prefer-for-of': SUCCESSOR('unicorn/no-for-loop'),
    '@typescript-eslint/prefer-function-type': OFF(
      'Certain abstractions read clearer when documented by interfaces, even those with only one call signature.'
    ),
    '@typescript-eslint/prefer-includes': WARN,
    '@typescript-eslint/prefer-literal-enum-member': WARN,
    '@typescript-eslint/prefer-namespace-keyword': OFF(),
    '@typescript-eslint/prefer-nullish-coalescing': WARN,
    '@typescript-eslint/prefer-optional-chain': WARN,
    '@typescript-eslint/prefer-readonly': WARN, // abiding by this rule will ease transition to the private methods proposal https://github.com/tc39/proposal-private-methods which, because it's at stage 3, will be in the language
    '@typescript-eslint/prefer-readonly-parameter-types': OFF(
      'While using parameters should never be modified and making them readonly helps with this, some third party interfaces are not easily made readonly'
    ),
    '@typescript-eslint/prefer-reduce-type-parameter': WARN,
    '@typescript-eslint/prefer-regexp-exec': WARN,
    '@typescript-eslint/prefer-return-this-type': WARN,
    '@typescript-eslint/prefer-string-starts-ends-with': WARN,
    '@typescript-eslint/prefer-ts-expect-error': WARN,
    '@typescript-eslint/promise-function-async': WARN,
    '@typescript-eslint/require-array-sort-compare': [WARN, { ignoreStringArrays: true }],
    '@typescript-eslint/restrict-plus-operands': [WARN, { checkCompoundAssignments: true }],
    '@typescript-eslint/restrict-template-expressions': BUGGY(
      '@typescript-eslint:v2.9.0',
      'seems to have a lot of false positives with the null coalescing operator'
    ), // WARN,
    '@typescript-eslint/sort-type-union-intersection-members': WARN,
    '@typescript-eslint/strict-boolean-expressions': WARN,
    '@typescript-eslint/switch-exhaustiveness-check': WARN,
    '@typescript-eslint/triple-slash-reference': WARN,
    '@typescript-eslint/type-annotation-spacing': OFF(CODE_FORMATTING),
    '@typescript-eslint/typedef': OFF('type inference is your friend... use it.'),
    '@typescript-eslint/unbound-method': [
      WARN,
      {
        ignoreStatic: true,
      },
    ],
    '@typescript-eslint/unified-signatures': WARN,
  },
};
