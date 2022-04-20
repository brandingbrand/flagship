import { OFF, WARN } from './utils';

export = {
  plugins: ['storybook'],
  rules: {
    // plugin:import ***********************************************************
    // rules URL: https://github.com/benmosher/eslint-plugin-import#rules
    'import/no-anonymous-default-export': OFF('Stories are referenced from default exports'),

    // plugin:storybook ********************************************************
    // rules URL: https://github.com/storybookjs/eslint-plugin-storybook#supported-rules-and-configurations
    'storybook/await-interactions': WARN,
    'storybook/context-in-play-function': WARN,
    'storybook/csf-component': WARN,
    'storybook/default-exports': WARN,
    'storybook/hierarchy-separator': WARN,
    'storybook/no-redundant-story-name': WARN,
    'storybook/no-stories-of': WARN,
    'storybook/no-title-property-in-meta': WARN,
    'storybook/prefer-pascal-case': WARN,
    'storybook/story-exports': WARN,
    'storybook/use-storybook-expect': WARN,
    'storybook/use-storybook-testing-library': WARN,
  },
};
