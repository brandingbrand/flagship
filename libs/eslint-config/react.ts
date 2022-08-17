import {
  CODE_FORMATTING,
  ERROR,
  LARGE_PERFORMANCE_COST,
  NOT_VALUABLE,
  OFF,
  PROJECT_BY_PROJECT,
  SUCCESSOR,
  TYPESCRIPT,
  WARN,
} from './utils';

export = {
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['jsx-a11y', 'react', 'react-hooks', 'react-perf', 'react-redux'],
  rules: {
    // plugin:jsx-a11y *********************************************************
    // rules URL: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#supported-rules
    'jsx-a11y/accessible-emoji': WARN,
    'jsx-a11y/alt-text': WARN,
    'jsx-a11y/anchor-has-content': WARN,
    'jsx-a11y/anchor-is-valid': [
      WARN,
      {
        aspects: ['noHref', 'invalidHref'],
      },
    ],
    'jsx-a11y/aria-activedescendant-has-tabindex': WARN,
    'jsx-a11y/aria-props': WARN,
    'jsx-a11y/aria-proptypes': WARN,
    'jsx-a11y/aria-role': [WARN, { ignoreNonDOM: true }],
    'jsx-a11y/aria-unsupported-elements': WARN,
    'jsx-a11y/autocomplete-valid': WARN,
    'jsx-a11y/click-events-have-key-events': WARN,
    'jsx-a11y/control-has-associated-label': [
      OFF(),
      {
        ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
        ignoreRoles: [
          'grid',
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'row',
          'tablist',
          'toolbar',
          'tree',
          'treegrid',
        ],
        includeRoles: ['alert', 'dialog'],
      },
    ],
    'jsx-a11y/heading-has-content': WARN,
    'jsx-a11y/html-has-lang': WARN,
    'jsx-a11y/iframe-has-title': WARN,
    'jsx-a11y/img-redundant-alt': WARN,
    'jsx-a11y/interactive-supports-focus': [
      WARN,
      {
        tabbable: [
          'button',
          'checkbox',
          'link',
          'progressbar',
          'searchbox',
          'slider',
          'spinbutton',
          'switch',
          'textbox',
        ],
      },
    ],
    'jsx-a11y/label-has-associated-control': WARN,
    'jsx-a11y/label-has-for': OFF(),
    'jsx-a11y/lang': WARN,
    'jsx-a11y/media-has-caption': WARN,
    'jsx-a11y/mouse-events-have-key-events': WARN,
    'jsx-a11y/no-access-key': WARN,
    'jsx-a11y/no-autofocus': WARN,
    'jsx-a11y/no-distracting-elements': WARN,
    'jsx-a11y/no-interactive-element-to-noninteractive-role': WARN,
    'jsx-a11y/no-noninteractive-element-interactions': [
      WARN,
      {
        body: ['onError', 'onLoad'],
        iframe: ['onError', 'onLoad'],
        img: ['onError', 'onLoad'],
      },
    ],
    'jsx-a11y/no-noninteractive-element-to-interactive-role': WARN,
    'jsx-a11y/no-noninteractive-tabindex': WARN,
    'jsx-a11y/no-redundant-roles': WARN,
    'jsx-a11y/no-static-element-interactions': WARN,
    'jsx-a11y/role-has-required-aria-props': WARN,
    'jsx-a11y/role-supports-aria-props': WARN,
    'jsx-a11y/scope': WARN,
    'jsx-a11y/tabindex-no-positive': ERROR,

    // plugin:react ************************************************************
    // rules URL: https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
    'react/boolean-prop-naming': [
      OFF(LARGE_PERFORMANCE_COST),
      { rule: '^(is|should|has|can|did|will)[A-Z]([A-Za-z0-9]?)+' },
    ],
    'react/button-has-type': WARN,
    'react/default-props-match-prop-types': OFF('#ProptypesAreDead'),
    // TODO (@wSedlacek) [eslint-plugin-react@>=7.31.0]: Enable after discussion
    'react/destructuring-assignment': [
      OFF(LARGE_PERFORMANCE_COST),
      'always',
      { destructureInSignature: 'always' },
    ],
    'react/display-name': OFF(
      'The problem with this rule is that errors on stateless functional components called as functions (not components) e.g. `renderThings(props)` and not `<RenderThings {...props} />`.'
    ),
    'react/forbid-component-props': OFF(PROJECT_BY_PROJECT),
    'react/forbid-dom-props': OFF(PROJECT_BY_PROJECT),
    'react/forbid-elements': OFF(PROJECT_BY_PROJECT),
    'react/forbid-foreign-prop-types': [WARN, { allowInPropTypes: true }],
    'react/forbid-prop-types': OFF(TYPESCRIPT),
    'react/function-component-definition': [
      WARN,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/hook-use-state': WARN,
    'react/iframe-missing-sandbox': WARN,
    'react/no-access-state-in-setstate': WARN,
    'react/no-adjacent-inline-elements': OFF(NOT_VALUABLE),
    'react/no-array-index-key': WARN,
    'react/no-arrow-function-lifecycle': WARN,
    'react/no-children-prop': WARN,
    'react/no-danger': WARN,
    'react/no-danger-with-children': WARN,
    'react/no-deprecated': WARN,
    'react/no-did-mount-set-state': [WARN, 'disallow-in-func'],
    'react/no-did-update-set-state': [WARN, 'disallow-in-func'],
    'react/no-direct-mutation-state': WARN,
    'react/no-find-dom-node': WARN,
    'react/no-is-mounted': WARN,
    'react/no-invalid-html-attribute': WARN,
    'react/no-namespace': WARN,
    'react/no-multi-comp': OFF(
      "I find this pattern useful. It's one of those things that needs to be left up to discretion."
    ),
    'react/no-redundant-should-component-update': WARN,
    'react/no-render-return-value': WARN,
    'react/no-set-state': OFF(
      "While enabling this rule should be most project's goal, it's not always ideal (for fast and frequently updating UI, for example) to go through redux for _every_ single thing."
    ),
    'react/no-string-refs': WARN,
    'react/no-this-in-sfc': WARN,
    'react/no-typos': ERROR,
    'react/no-unescaped-entities': WARN,
    'react/no-unstable-nested-components': WARN,
    'react/no-unknown-property': WARN,
    'react/no-unsafe': WARN,
    'react/no-unused-class-component-methods': WARN,
    'react/no-unused-prop-types': WARN,
    'react/no-unused-state': WARN,
    'react/no-will-update-set-state': [WARN, 'disallow-in-func'],
    'react/prefer-es6-class': WARN,
    'react/prefer-exact-props': OFF(TYPESCRIPT),
    'react/prefer-read-only-props': WARN,
    'react/prefer-stateless-function': WARN,
    'react/prop-types': OFF(TYPESCRIPT),
    'react/react-in-jsx-scope': WARN,
    'react/require-default-props': OFF(TYPESCRIPT),
    'react/require-optimization': OFF(
      "This rule makes sense if you weren't depending on redux and things like reselect and re-reselect like I often do."
    ),
    'react/require-render-return': ERROR,
    'react/self-closing-comp': WARN,
    'react/sort-comp': OFF('Now that hooks are a thing this is far less useful than it used to be'),
    'react/sort-prop-types': WARN, // TypeScript handles this
    'react/state-in-constructor': [WARN, 'never'],
    'react/static-property-placement': WARN,
    'react/style-prop-object': WARN,
    'react/void-dom-elements-no-children': WARN,

    // JSX rules
    'react/jsx-boolean-value': WARN,
    'react/jsx-curly-brace-presence': WARN,
    'react/jsx-filename-extension': [WARN, { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-fragments': [WARN, 'element'], // I don't find it a bad thing to import `Fragment`.  at least that way it's crystal-clear what the author intended.  In a few years if it's super common to use the shorthand I could be persuaded to switch camps.  also the thing about fragments not being able to have a key or attribute when using the shorthand sways my opinion.
    'react/jsx-handler-names': WARN,
    'react/jsx-key': WARN,
    'react/jsx-max-depth': [WARN, { max: 15 }], // this is almost useless, but not completely so I set it to a somewhat absurd maximum.  Using things like styled-components and styletron increases the jsx depth quite a bit (necessarily) in complex layouts.
    'react/jsx-no-bind': [WARN, { ignoreRefs: true }],
    'react/jsx-no-comment-textnodes': WARN,
    'react/jsx-no-constructed-context-values': WARN, // sure.. I guess..
    'react/jsx-no-duplicate-props': WARN,
    'react/jsx-no-leaked-render': WARN,
    'react/jsx-no-literals': OFF(
      "yeah... this rule shouldn't exist - we should just fix the syntax highlighters."
    ),
    'react/jsx-no-script-url': WARN,
    'react/jsx-no-target-blank': WARN,
    'react/jsx-no-undef': ERROR,
    'react/jsx-no-useless-fragment': WARN,
    'react/jsx-pascal-case': WARN,
    'react/jsx-props-no-spreading': [WARN, { custom: 'ignore' }], // I firmly believe that (except in rare cases) this behavior is the source of many bugs (that I have seen) and should require an explanation (i.e. when this rule is disabled) every time.
    'react/jsx-sort-default-props': WARN,
    'react/jsx-sort-props': WARN, // hate me if you wish.  the goal of this project is for the code to be as consistent as possible.  also this is now auto-fixable which is cool.
    'react/jsx-uses-react': SUCCESSOR('no-unused-vars'),
    'react/jsx-uses-vars': SUCCESSOR('no-unused-vars'),

    // Disabled due to overlap with code formatters, eg Prettier
    'react/jsx-child-element-spacing': OFF(CODE_FORMATTING),
    'react/jsx-closing-bracket-location': OFF(CODE_FORMATTING),
    'react/jsx-closing-tag-location': OFF(CODE_FORMATTING),
    'react/jsx-curly-newline': OFF(CODE_FORMATTING),
    'react/jsx-curly-spacing': OFF(CODE_FORMATTING),
    'react/jsx-equals-spacing': OFF(CODE_FORMATTING),
    'react/jsx-first-prop-new-line': OFF(CODE_FORMATTING),
    'react/jsx-indent': OFF(CODE_FORMATTING),
    'react/jsx-indent-props': OFF(CODE_FORMATTING),
    'react/jsx-max-props-per-line': OFF(CODE_FORMATTING),
    'react/jsx-newline': OFF(CODE_FORMATTING),
    'react/jsx-one-expression-per-line': OFF(CODE_FORMATTING),
    'react/jsx-props-no-multi-spaces': OFF(CODE_FORMATTING),
    'react/jsx-tag-spacing': OFF(CODE_FORMATTING),
    'react/jsx-wrap-multilines': OFF(CODE_FORMATTING),

    // plugin:react-hooks ******************************************************
    // rules URL: https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks
    'react-hooks/exhaustive-deps': WARN, // Checks effect dependencies
    // TODO (@wSedlacek) [2022-12-31]: Enforce the rules of hooks as an error
    'react-hooks/rules-of-hooks': WARN, // Checks rules of Hooks

    // plugin:react-perf *******************************************************
    // rules URL: https://github.com/cvazac/eslint-plugin-react-perf#list-of-supported-rules
    'react-perf/jsx-no-new-object-as-prop': WARN,
    'react-perf/jsx-no-new-array-as-prop': WARN,
    'react-perf/jsx-no-new-function-as-prop': SUCCESSOR('react/jsx-no-bind'),
    'react-perf/jsx-no-jsx-as-prop': WARN,

    // plugin:react-redux ******************************************************
    // rules URL: https://github.com/DianaSuvorova/eslint-plugin-react-redux#supported-rules
    'react-redux/connect-prefer-minimum-two-arguments': OFF(),
    'react-redux/connect-prefer-named-arguments': WARN,
    'react-redux/mapDispatchToProps-prefer-parameters-names': WARN,
    'react-redux/mapDispatchToProps-prefer-shorthand': WARN,
    'react-redux/mapDispatchToProps-returns-object': WARN,
    'react-redux/mapStateToProps-no-store': WARN,
    'react-redux/mapStateToProps-prefer-hoisted': WARN,
    'react-redux/mapStateToProps-prefer-parameters-names': WARN,
    'react-redux/mapStateToProps-prefer-selectors': WARN,
    'react-redux/no-unused-prop-types': SUCCESSOR('react/no-unused-prop-types'),
    'react-redux/prefer-separate-component-file': WARN,
    'react-redux/useSelector-prefer-selectors': WARN,

    // plugin:unicorn **********************************************************
    // rules URL: https://github.com/sindresorhus/eslint-plugin-unicorn#rules
    'unicorn/no-null': OFF('Return values of render functions may need to be null'),
  },
};
