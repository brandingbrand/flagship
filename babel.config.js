module.exports = {
  "presets": [
    "module:metro-react-native-babel-preset"
  ],
  "sourceMaps": "inline",
  "env": {
    "test": {
      "presets": [
        [ "@babel/preset-env", {
          "targets": {
            "node": "current"
          },
          "corejs": "^3.0.0",
        }],
        "module:metro-react-native-babel-preset"
      ]
    }
  }
}
