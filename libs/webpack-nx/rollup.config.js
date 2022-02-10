module.exports = (config) => ({
  ...config,
  output: {
    ...config.output,
    exports: 'default',
  },
});
