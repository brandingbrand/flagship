const {getPackages} = require('@commitlint/config-lerna-scopes').utils;

module.exports = {
  extends: [
    '@commitlint/config-lerna-scopes',
    '@commitlint/config-conventional'
  ],
  rules: {
    'subject-case': [0],
    // greenkeeper-lockfile doesn't support customization of commit messages and always uses the
    // commit message "chore(package)..."
    'scope-enum': () => [2, 'always', [...getPackages(), 'package']]
  }
};
