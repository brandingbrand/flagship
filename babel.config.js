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
          }
        }],
        "module:metro-react-native-babel-preset"
      ]
    }
  }
}
