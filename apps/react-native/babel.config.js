module.exports = function(api) {
  api.cache(false);

  const plugins = [
    [
      '@brandingbrand/kernel-babel-plugin-dev', {
        'project': 'react-native', // project root folder name
        'screens': 'src/screens', // project screens to wrap with default dev menu on compile
        'devScreens': '__dev__', // (optional) custom project dev menus (relative to screensDirectory)
        'version': require('./package.json').version
      }
    ]
  ];

  const presets = ["module:metro-react-native-babel-preset"]

  return {
    plugins,
    presets
  }
}
