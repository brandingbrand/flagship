module.exports = function(api) {
  api.cache(true);

  const presets = [
    "module:metro-react-native-babel-preset",
    [
      "@babel/preset-env", {
        "targets": {
          "esmodules": true,
          "node":true
        },
        //TODO: get a ton of errors in the console during yarn start without this
        "loose": true
      }
    ]
  ];

  const plugins = [
    [
      '@brandingbrand/kernel-babel-plugin-dev', {
        'project': 'react-native', // project root folder name
        'screensDirectory': 'src/screens', // project screens to wrap with default dev menu on compile
        'projectDevMenusDirectory': '__dev__', // (optional) custom project dev menus (relative to screensDirectory)
        'version': require('./package.json').version
      }
    ]
  ];

  return {
    plugins,
    presets
  }
}
