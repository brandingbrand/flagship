# Flagship

## Environment Requirements

* node 8+, yarn 1.5+
* watchman `brew install watchman`
* react-native-cli `yarn global add react-native-cli`
* iOS Development Environment
  * cocoapods v1.5+ `brew install cocoapods`
  * Xcode 9
* Android Development Environment
  * Follow the steps
    [here](http://facebook.github.io/react-native/docs/getting-started.html#android-development-environment)

## How to add icons and a launch screen

Launch screens and icons can be configured through the project's
`env/env.[env_name].js` file using the `appIconDir` and `launchScreen` keys:

```javascript
module.exports = {
  ....
  "appIconDir": {
    "ios": "src/assets/appIcon/ios",
    "android": "src/assets/appIcon/android"
  },
  "launchScreen": {
    "ios": {
      "images": "src/assets/launchScreen/ios/Images.xcassets",
      "xib": "src/assets/launchScreen/ios/LaunchScreen.xib"
    },
    "android": "src/assets/launchScreen/android"
  }
}
```

Upon running `flagship init` the specified files will be copied to the native
code and override the default icon and launch screen.

Files under `src/assets/appIcon/ios`

```bash
Contents.json
icon120x120.png   // 120 × 120
icon180x180.png   // 180 × 180
icon40x40.png     // 40 × 40
icon58x58.png     // 58 × 58
icon60x60.png     // 60 × 60
icon80x80.png     // 80 × 80
icon87x87.png     // 87 × 87
```

Files under `src/assets/appIcon/android`

```bash
mipmap-hdpi
└── ic_launcher.png   // 72 × 72
mipmap-mdpi
└── ic_launcher.png   // 48 × 48
mipmap-xhdpi
└── ic_launcher.png   // 96 × 96
mipmap-xxhdpi
└── ic_launcher.png   // 144 × 144
```

`src/assets/launchScreen/ios/Images.xcassets` should be an asset catalog of any
resources used in the launch screen xib file.

`src/assets/launchScreen/ios/LaunchScreen.xib` should be a launch screen xib
file.

Files under `src/assets/launchScreen/android`

```bash
drawable-hdpi
└── screen.png   // 480 × 800
drawable-mdpi
└── screen.png   // 320 × 480
drawable-xhdpi
└── screen.png   // 720 × 1280
drawable-xxhdpi
└── screen.png   // 960 × 1600
```
