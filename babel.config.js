module.exports = {
  "presets": [
    "module:metro-react-native-babel-preset"
  ],
  "sourceMaps": "inline",
  "env": {
    "test": {
      "presets": [
        [ "env", {
          "targets": {
            "node": "current"
          }
        }],
        "module:metro-react-native-babel-preset"
      ]
    }
  }
}
