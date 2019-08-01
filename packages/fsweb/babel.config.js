module.exports = {
  "presets": [
    "module:metro-react-native-babel-preset",
    ["@babel/env", {
      "targets": {
        "browsers": ["last 2 versions", "ie >= 11"]
      },
      "modules": false
    }]
  ],
  "plugins": [
    "react-native-web"
  ]
};
