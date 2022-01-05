#!/usr/bin/env node

const { types, scopes, ticketNumberPrefix } = require('./.cz-config.js');

const typeValues = types.map(({ value }) => value);
const scopeNames = scopes.map(({ name }) => name);

const Configuration = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',

  parserPreset: {
    parserOpts: {
      issuePrefixes: ticketNumberPrefix,
    },
  },

  rules: {
    'type-enum': [2, 'always', typeValues],
    'scope-enum': [2, 'always', scopeNames],
    'scope-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 72],
    'body-empty': [1, 'never'],
    'body-full-stop': [1, 'never'],
    'footer-leading-blank': [2, 'always'],
    'body-max-line-length': [0],
  },

  defaultIgnores: true,
  helpUrl: 'https://www.conventionalcommits.org/en/v1.0.0/',

  /**
   * Dependabot messages cannot be configured
   *
   * @link [dependabot-core/issues/1666](https://github.com/dependabot/dependabot-core/issues/1666)
   * @link [dependabot-core/issues/2455](https://github.com/dependabot/dependabot-core/issues/2455)
   */
  ignores: [(message) => /^Bumps \[.+]\(.+\) from .+ to .+\.$/m.test(message)],
};

module.exports = Configuration;
