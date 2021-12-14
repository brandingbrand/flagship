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
  },

  defaultIgnores: true,
  helpUrl: 'https://www.conventionalcommits.org/en/v1.0.0/',
};

module.exports = Configuration;
