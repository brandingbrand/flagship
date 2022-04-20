import { WARN } from './utils';

export = {
  plugins: ['json'],
  rules: {
    // plugin:json *************************************************************
    // rules URL: https://github.com/azeemba/eslint-plugin-json#individual-rules
    'json/undefined': WARN,
    'json/enum-value-mismatch': WARN,
    'json/unexpected-end-of-comment': WARN,
    'json/unexpected-end-of-string': WARN,
    'json/unexpected-end-of-number': WARN,
    'json/invalid-unicode': WARN,
    'json/invalid-escape-character': WARN,
    'json/invalid-character': WARN,
    'json/property-expected': WARN,
    'json/comma-expected': WARN,
    'json/colon-expected': WARN,
    'json/value-expected': WARN,
    'json/comma-or-close-backet-expected': WARN,
    'json/comma-or-close-brace-expected': WARN,
    'json/trailing-comma': WARN,
    'json/duplicate-key': WARN,
    'json/comment-not-permitted': WARN,
    'json/schema-resolve-error': WARN,
  },
};
