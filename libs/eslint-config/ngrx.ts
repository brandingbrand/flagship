import { SUCCESSOR, WARN } from './utils';

export = {
  plugins: ['ngrx'],
  rules: {
    // plugin:ngrx **************************************************************
    // rules URL: https://github.com/timdeschryver/eslint-plugin-ngrx#rules
    'ngrx/avoid-combining-selectors': WARN,
    'ngrx/avoid-cyclic-effects': WARN,
    'ngrx/avoid-dispatching-multiple-actions-sequentially': WARN,
    'ngrx/avoid-duplicate-actions-in-reducer': WARN,
    'ngrx/avoid-mapping-selectors': WARN,
    'ngrx/good-action-hygiene': WARN,
    'ngrx/no-dispatch-in-effects': WARN,
    'ngrx/no-effect-decorator': WARN,
    'ngrx/no-effect-decorator-and-creator': SUCCESSOR('ngrx/no-effect-decorator'),
    'ngrx/no-effects-in-providers': WARN,
    'ngrx/no-multiple-actions-in-effects': WARN,
    'ngrx/no-multiple-global-stores': WARN,
    'ngrx/no-reducer-in-key-names': WARN,
    'ngrx/no-store-subscription': WARN,
    'ngrx/no-typed-global-store': WARN,
    'ngrx/on-function-explicit-return-type': WARN,
    'ngrx/prefer-action-creator-in-dispatch': WARN,
    'ngrx/prefer-action-creator-in-of-type': WARN,
    'ngrx/prefer-action-creator': WARN,
    'ngrx/prefer-concat-latest-from': WARN,
    'ngrx/prefer-effect-callback-in-block-statement': WARN,
    'ngrx/prefer-inline-action-props': WARN,
    'ngrx/prefer-one-generic-in-create-for-feature-selector': WARN,
    'ngrx/prefer-selector-in-select': WARN,
    'ngrx/prefix-selectors-with-select': WARN,
    'ngrx/select-style': WARN,
    'ngrx/updater-explicit-return-type': WARN,
    'ngrx/use-consistent-global-store-name': WARN,
    'ngrx/use-effects-lifecycle-interface': WARN,
  },
};
