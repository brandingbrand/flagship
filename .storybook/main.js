module.exports = {
  stories: [
    '../packages/**/*.@(story|stories).@(ts|tsx)'
  ],
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register'
  ],
};
