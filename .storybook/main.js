module.exports = {
  stories: [
    '../packages/**/*.@(story|stories).@(ts|tsx)'
  ],
  addons: [
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-viewport/register',
  ],
};
