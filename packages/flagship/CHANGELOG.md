# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [8.0.0](https://github.com/brandingbrand/flagship/compare/v7.10.0...v8.0.0) (2020-01-15)


### Features

* **flagship:** update podfile to use cocoapods cdn (c3259d7)


### BREAKING CHANGES

* **flagship:** This requires updating CocoaPods (including in CI) to v1.7.2+ in order for pod install to work with the CDN. This allows CocoaPods to pull from their own CDN which avoids rate limiting when pulling sources from GitHub instead.







**Note:** Version bump only for package @brandingbrand/flagship





# [7.10.0](https://github.com/brandingbrand/flagship/compare/v7.8.0...v7.10.0) (2020-01-14)


### Bug Fixes

* android fastline syntax error due to a trailing comma (e52d97f)


### Features

* **flagship:** add Android App Bundle (.aab) Support ([#950](https://github.com/brandingbrand/flagship/issues/950)) (7d9fc73)





# [7.8.0](https://github.com/brandingbrand/flagship/compare/v7.7.1...v7.8.0) (2019-12-18)

**Note:** Version bump only for package @brandingbrand/flagship





## [7.7.1](https://github.com/brandingbrand/flagship/compare/v7.7.0...v7.7.1) (2019-11-20)

**Note:** Version bump only for package @brandingbrand/flagship





# [7.7.0](https://github.com/brandingbrand/flagship/compare/v7.6.0...v7.7.0) (2019-11-20)


### Features

* **flagship:** deprecate appcenter.apiconfig configuration option ([55c4b61](https://github.com/brandingbrand/flagship/commit/55c4b61))





# [7.6.0](https://github.com/brandingbrand/flagship/compare/v7.5.4...v7.6.0) (2019-11-14)


### Features

* **flagship:** Add option to only include the default env ([#925](https://github.com/brandingbrand/flagship/issues/925)) ([f29ecfa](https://github.com/brandingbrand/flagship/commit/f29ecfa))





## [7.5.4](https://github.com/brandingbrand/flagship/compare/v7.5.3...v7.5.4) (2019-11-08)

**Note:** Version bump only for package @brandingbrand/flagship





## [7.5.3](https://github.com/brandingbrand/flagship/compare/v7.5.2...v7.5.3) (2019-11-08)

**Note:** Version bump only for package @brandingbrand/flagship





## [7.5.2](https://github.com/brandingbrand/flagship/compare/v7.5.1...v7.5.2) (2019-11-08)

**Note:** Version bump only for package @brandingbrand/flagship





## [7.5.1](https://github.com/brandingbrand/flagship/compare/v7.5.0...v7.5.1) (2019-11-07)

**Note:** Version bump only for package @brandingbrand/flagship





# [7.5.0](https://github.com/brandingbrand/flagship/compare/v7.4.3...v7.5.0) (2019-11-07)


### Bug Fixes

* **flagship:** add targeted device to both Debug and Release config ([70f9aaa](https://github.com/brandingbrand/flagship/commit/70f9aaa))
* **flagship:** fix fastlane build lane ([e6d64bf](https://github.com/brandingbrand/flagship/commit/e6d64bf))





## [7.4.3](https://github.com/brandingbrand/flagship/compare/v7.4.2...v7.4.3) (2019-10-30)


### Bug Fixes

* exclude kotlin intermediate build files  ([f2912e1](https://github.com/brandingbrand/flagship/commit/f2912e1))





## [7.4.2](https://github.com/brandingbrand/flagship/compare/v7.4.1...v7.4.2) (2019-10-29)


### Bug Fixes

* get default env from initial script ([af5d5ad](https://github.com/brandingbrand/flagship/commit/af5d5ad))
* Modify the podspec version to ve 2.6.2 ([#878](https://github.com/brandingbrand/flagship/issues/878)) ([c72f3c0](https://github.com/brandingbrand/flagship/commit/c72f3c0))
* **flagship:** Fix renaming edge case for android ([#898](https://github.com/brandingbrand/flagship/issues/898)) ([211209a](https://github.com/brandingbrand/flagship/commit/211209a))
* **fsweb:** Use yarn.lock for fsweb ([#906](https://github.com/brandingbrand/flagship/issues/906)) ([2405dda](https://github.com/brandingbrand/flagship/commit/2405dda))





## [7.4.1](https://github.com/brandingbrand/flagship/compare/v7.4.0...v7.4.1) (2019-10-09)


### Bug Fixes

* **flagship:** add support for new pods ([d2a0c28](https://github.com/brandingbrand/flagship/commit/d2a0c28))





# [7.4.0](https://github.com/brandingbrand/flagship/compare/v7.3.0...v7.4.0) (2019-10-08)


### Bug Fixes

* **flagship:** update string replace to work in new fastfile ([#864](https://github.com/brandingbrand/flagship/issues/864)) ([ae6b368](https://github.com/brandingbrand/flagship/commit/ae6b368))





# [7.3.0](https://github.com/brandingbrand/flagship/compare/v7.2.0...v7.3.0) (2019-10-08)


### Features

* add appcenter support to fastlane scripts ([00ede00](https://github.com/brandingbrand/flagship/commit/00ede00))





# [7.2.0](https://github.com/brandingbrand/flagship/compare/v7.1.1...v7.2.0) (2019-10-07)


### Bug Fixes

* **flagship:** ios background modes returning undefine ([70d93ce](https://github.com/brandingbrand/flagship/commit/70d93ce))


### Features

* **flagship:** support background modes ([1088366](https://github.com/brandingbrand/flagship/commit/1088366))





## [7.1.1](https://github.com/brandingbrand/flagship/compare/v7.1.0...v7.1.1) (2019-10-04)

**Note:** Version bump only for package @brandingbrand/flagship





# [7.1.0](https://github.com/brandingbrand/flagship/compare/v7.0.0...v7.1.0) (2019-10-02)

**Note:** Version bump only for package @brandingbrand/flagship





# [7.0.0](https://github.com/brandingbrand/flagship/compare/v6.3.0...v7.0.0) (2019-09-27)


### Bug Fixes

* **flagship:** Make android namespace match package name ([e53e362](https://github.com/brandingbrand/flagship/commit/e53e362))


### Features

* android init config ([d5ef942](https://github.com/brandingbrand/flagship/commit/d5ef942))


### BREAKING CHANGES

* **flagship:** If anything hard codes the android native project path (ie.
android/app/src/main/java/com/brandingbrand/reactnative/and/project-name), it will need to be
updated to account for the dynamic package name. Flagship now exports its own modules, so
`flagship.path.android.nativeProjectPath(config)` can be used to get the directory without hard
coding a path.





# [6.3.0](https://github.com/brandingbrand/flagship/compare/v6.2.0...v6.3.0) (2019-09-23)

**Note:** Version bump only for package @brandingbrand/flagship





# [6.2.0](https://github.com/brandingbrand/flagship/compare/v6.1.4...v6.2.0) (2019-09-19)


### Bug Fixes

* bump leanplum sdk version ([#823](https://github.com/brandingbrand/flagship/issues/823)) ([2b378c9](https://github.com/brandingbrand/flagship/commit/2b378c9))





## [6.1.4](https://github.com/brandingbrand/flagship/compare/v6.1.3...v6.1.4) (2019-09-17)


### Bug Fixes

* fix network security config for android emulators ([#817](https://github.com/brandingbrand/flagship/issues/817)) ([1b78195](https://github.com/brandingbrand/flagship/commit/1b78195))





## [6.1.3](https://github.com/brandingbrand/flagship/compare/v6.1.2...v6.1.3) (2019-09-12)

**Note:** Version bump only for package @brandingbrand/flagship





## [6.1.2](https://github.com/brandingbrand/flagship/compare/v6.1.1...v6.1.2) (2019-09-12)

**Note:** Version bump only for package @brandingbrand/flagship





## [6.1.1](https://github.com/brandingbrand/flagship/compare/v6.1.0...v6.1.1) (2019-09-12)

**Note:** Version bump only for package @brandingbrand/flagship





# [6.1.0](https://github.com/brandingbrand/flagship/compare/v6.0.0...v6.1.0) (2019-09-10)

**Note:** Version bump only for package @brandingbrand/flagship





# [6.0.0](https://github.com/brandingbrand/flagship/compare/v5.3.0...v6.0.0) (2019-09-04)

**Note:** Version bump only for package @brandingbrand/flagship





# [5.3.0](https://github.com/brandingbrand/flagship/compare/v5.2.0...v5.3.0) (2019-08-23)


### Features

* Add network security config for Android ([7aa9899](https://github.com/brandingbrand/flagship/commit/7aa9899))





# [5.2.0](https://github.com/brandingbrand/flagship/compare/v5.1.0...v5.2.0) (2019-08-21)

**Note:** Version bump only for package @brandingbrand/flagship





## [5.1.1](https://github.com/brandingbrand/flagship/compare/v5.1.0...v5.1.1) (2019-08-19)

**Note:** Version bump only for package @brandingbrand/flagship





# [5.1.0](https://github.com/brandingbrand/flagship/compare/v5.0.0...v5.1.0) (2019-08-14)

**Note:** Version bump only for package @brandingbrand/flagship





# [5.0.0](https://github.com/brandingbrand/flagship/compare/v3.2.1...v5.0.0) (2019-08-06)


### chore

* remove add-keys scripts in favor of more generic versions ([e7412f9](https://github.com/brandingbrand/flagship/commit/e7412f9))


### Features

* implement react native 0.59 ([0592aa2](https://github.com/brandingbrand/flagship/commit/0592aa2))


### BREAKING CHANGES

* This removes the add-keys-ios and add-keys-android scripts as they required an internal BB workflow to work. The new scripts, add-keys-ios-internal and add-keys-android-internal, can be configured with the environment files with passwords being passed in as environment variables.

For usage instructions, see the new wiki article: https://github.com/brandingbrand/flagship/wiki/Signing-Your-Apps
* This implements react native 0.59. Upgrading to this version will require dependency updates to be described in future documentation.





# [4.1.0](https://github.com/brandingbrand/flagship/compare/v3.2.1...v4.1.0) (2019-07-24)


### Features

* implement react native 0.59 ([0592aa2](https://github.com/brandingbrand/flagship/commit/0592aa2))


### BREAKING CHANGES

* This implements react native 0.59. Upgrading to this version will require dependency updates to be described in future documentation.





# [4.1.0](https://github.com/brandingbrand/flagship/compare/v3.2.1...v4.1.0) (2019-07-24)


### Features

* implement react native 0.59 ([0592aa2](https://github.com/brandingbrand/flagship/commit/0592aa2))


### BREAKING CHANGES

* This implements react native 0.59. Upgrading to this version will require dependency updates to be described in future documentation.





# [4.0.0](https://github.com/brandingbrand/flagship/compare/v3.2.0...v4.0.0) (2019-07-16)


### Features

* implement react native 0.59 ([ab18642](https://github.com/brandingbrand/flagship/commit/ab18642))


### BREAKING CHANGES

* This implements react native 0.59. Upgrading to this version will require dependency updates to be described in future documentation.





# [4.0.0-alpha.3](https://github.com/brandingbrand/flagship/compare/v3.1.1...v4.0.0-alpha.3) (2019-07-16)

**Note:** Version bump only for package @brandingbrand/flagship





# [3.2.0](https://github.com/brandingbrand/flagship/compare/v3.1.1...v3.2.0) (2019-07-03)

**Note:** Version bump only for package @brandingbrand/flagship





## [3.1.1](https://github.com/brandingbrand/flagship/compare/v3.1.0...v3.1.1) (2019-06-04)


### Bug Fixes

* update fs-extra to version 8.0.0 ([db734b9](https://github.com/brandingbrand/flagship/commit/db734b9))
* update replace-in-file to version 4.1.0 ([293629a](https://github.com/brandingbrand/flagship/commit/293629a))





# [3.1.0](https://github.com/brandingbrand/flagship/compare/v3.0.0...v3.1.0) (2019-06-03)


### Bug Fixes

* **flagship:** pass leanplum push url to expected launchOptions value ([5b1909c](https://github.com/brandingbrand/flagship/commit/5b1909c))
* **flagship:** put placeholders back for using exception domains ([acaf8d1](https://github.com/brandingbrand/flagship/commit/acaf8d1))
* **flagship:** remove minSdkVersion from Android versionCode ([0ca3913](https://github.com/brandingbrand/flagship/commit/0ca3913))
* **flagship:** restore minsdkversion gradle prop ([d10b0eb](https://github.com/brandingbrand/flagship/commit/d10b0eb))


### Features

* **flagship:** refactor module scripts and remove node-suspect ([c5bf0f8](https://github.com/brandingbrand/flagship/commit/c5bf0f8))





# [3.0.0](https://github.com/brandingbrand/flagship/compare/v2.0.0...v3.0.0) (2019-02-22)


### Bug Fixes

* Do not exit init process if missing app center token ([24c093e](https://github.com/brandingbrand/flagship/commit/24c093e))
* Require project to provide app center token ([e349966](https://github.com/brandingbrand/flagship/commit/e349966))
* **flagship:** Fix possible memory leak and refactor Android code ([f1b4023](https://github.com/brandingbrand/flagship/commit/f1b4023))
* **flagship:** pin android.support libs to 27 ([27a60cd](https://github.com/brandingbrand/flagship/commit/27a60cd))
* **flagship:** restore android init to prior version ([d249b92](https://github.com/brandingbrand/flagship/commit/d249b92)), closes [#280](https://github.com/brandingbrand/flagship/issues/280)
* **flagship:** run pod install after react-native link ([2e4a13c](https://github.com/brandingbrand/flagship/commit/2e4a13c))
* **flagship:** runs jscenter() last in build.gradle/repos ([1c7560c](https://github.com/brandingbrand/flagship/commit/1c7560c))
* **pirateship:** ignore yoga in template podspec ([36ff2d5](https://github.com/brandingbrand/flagship/commit/36ff2d5))


### Features

* **flagship:** Add support for react-native-adobe-analytics library ([c9218f7](https://github.com/brandingbrand/flagship/commit/c9218f7))
* **flagship:** additional pod sources ([fe4c42e](https://github.com/brandingbrand/flagship/commit/fe4c42e))
* **fsengagement:** add fsengagement package ([59c6be8](https://github.com/brandingbrand/flagship/commit/59c6be8))
* upgrade react native to 0.57.8 ([ab40ab1](https://github.com/brandingbrand/flagship/commit/ab40ab1))


### BREAKING CHANGES

* This upgrades RN to 0.57.8, React to 16.6.3, and other dependencies as necessary. Updates were made to the iOS and Android native templates according to RN's instructions.





# [3.0.0](https://github.com/brandingbrand/flagship/compare/v2.0.0...v3.0.0) (2019-02-22)


### Bug Fixes

* Do not exit init process if missing app center token ([24c093e](https://github.com/brandingbrand/flagship/commit/24c093e))
* Require project to provide app center token ([e349966](https://github.com/brandingbrand/flagship/commit/e349966))
* **flagship:** Fix possible memory leak and refactor Android code ([f1b4023](https://github.com/brandingbrand/flagship/commit/f1b4023))
* **flagship:** pin android.support libs to 27 ([27a60cd](https://github.com/brandingbrand/flagship/commit/27a60cd))
* **flagship:** restore android init to prior version ([d249b92](https://github.com/brandingbrand/flagship/commit/d249b92)), closes [#280](https://github.com/brandingbrand/flagship/issues/280)
* **flagship:** run pod install after react-native link ([2e4a13c](https://github.com/brandingbrand/flagship/commit/2e4a13c))
* **flagship:** runs jscenter() last in build.gradle/repos ([1c7560c](https://github.com/brandingbrand/flagship/commit/1c7560c))
* **pirateship:** ignore yoga in template podspec ([36ff2d5](https://github.com/brandingbrand/flagship/commit/36ff2d5))


### Features

* **flagship:** Add support for react-native-adobe-analytics library ([c9218f7](https://github.com/brandingbrand/flagship/commit/c9218f7))
* **flagship:** additional pod sources ([fe4c42e](https://github.com/brandingbrand/flagship/commit/fe4c42e))
* **fsengagement:** add fsengagement package ([59c6be8](https://github.com/brandingbrand/flagship/commit/59c6be8))
* upgrade react native to 0.57.8 ([ab40ab1](https://github.com/brandingbrand/flagship/commit/ab40ab1))


### BREAKING CHANGES

* This upgrades RN to 0.57.8, React to 16.6.3, and other dependencies as necessary. Updates were made to the iOS and Android native templates according to RN's instructions.





# [3.0.0](https://github.com/brandingbrand/flagship/compare/v2.0.0...v3.0.0) (2019-02-22)


### Bug Fixes

* Do not exit init process if missing app center token ([24c093e](https://github.com/brandingbrand/flagship/commit/24c093e))
* Require project to provide app center token ([e349966](https://github.com/brandingbrand/flagship/commit/e349966))
* **flagship:** Fix possible memory leak and refactor Android code ([f1b4023](https://github.com/brandingbrand/flagship/commit/f1b4023))
* **flagship:** pin android.support libs to 27 ([27a60cd](https://github.com/brandingbrand/flagship/commit/27a60cd))
* **flagship:** restore android init to prior version ([d249b92](https://github.com/brandingbrand/flagship/commit/d249b92)), closes [#280](https://github.com/brandingbrand/flagship/issues/280)
* **flagship:** run pod install after react-native link ([2e4a13c](https://github.com/brandingbrand/flagship/commit/2e4a13c))
* **flagship:** runs jscenter() last in build.gradle/repos ([1c7560c](https://github.com/brandingbrand/flagship/commit/1c7560c))
* **pirateship:** ignore yoga in template podspec ([36ff2d5](https://github.com/brandingbrand/flagship/commit/36ff2d5))


### Features

* **flagship:** Add support for react-native-adobe-analytics library ([c9218f7](https://github.com/brandingbrand/flagship/commit/c9218f7))
* **flagship:** additional pod sources ([fe4c42e](https://github.com/brandingbrand/flagship/commit/fe4c42e))
* **fsengagement:** add fsengagement package ([59c6be8](https://github.com/brandingbrand/flagship/commit/59c6be8))
* upgrade react native to 0.57.8 ([ab40ab1](https://github.com/brandingbrand/flagship/commit/ab40ab1))


### BREAKING CHANGES

* This upgrades RN to 0.57.8, React to 16.6.3, and other dependencies as necessary. Updates were made to the iOS and Android native templates according to RN's instructions.





# [3.0.0](https://github.com/brandingbrand/flagship/compare/v2.0.0...v3.0.0) (2019-02-22)


### Bug Fixes

* Do not exit init process if missing app center token ([24c093e](https://github.com/brandingbrand/flagship/commit/24c093e))
* Require project to provide app center token ([e349966](https://github.com/brandingbrand/flagship/commit/e349966))
* **flagship:** Fix possible memory leak and refactor Android code ([f1b4023](https://github.com/brandingbrand/flagship/commit/f1b4023))
* **flagship:** pin android.support libs to 27 ([27a60cd](https://github.com/brandingbrand/flagship/commit/27a60cd))
* **flagship:** restore android init to prior version ([d249b92](https://github.com/brandingbrand/flagship/commit/d249b92)), closes [#280](https://github.com/brandingbrand/flagship/issues/280)
* **flagship:** run pod install after react-native link ([2e4a13c](https://github.com/brandingbrand/flagship/commit/2e4a13c))
* **flagship:** runs jscenter() last in build.gradle/repos ([1c7560c](https://github.com/brandingbrand/flagship/commit/1c7560c))
* **pirateship:** ignore yoga in template podspec ([36ff2d5](https://github.com/brandingbrand/flagship/commit/36ff2d5))


### Features

* **flagship:** Add support for react-native-adobe-analytics library ([c9218f7](https://github.com/brandingbrand/flagship/commit/c9218f7))
* **flagship:** additional pod sources ([fe4c42e](https://github.com/brandingbrand/flagship/commit/fe4c42e))
* **fsengagement:** add fsengagement package ([59c6be8](https://github.com/brandingbrand/flagship/commit/59c6be8))
* upgrade react native to 0.57.8 ([ab40ab1](https://github.com/brandingbrand/flagship/commit/ab40ab1))


### BREAKING CHANGES

* This upgrades RN to 0.57.8, React to 16.6.3, and other dependencies as necessary. Updates were made to the iOS and Android native templates according to RN's instructions.





## [3.0.1-alpha.0](https://github.com/brandingbrand/flagship/compare/v3.0.0-alpha.0...v3.0.1-alpha.0) (2019-02-11)


### Bug Fixes

* **flagship:** update iphoneos deployment target to 10.3 ([d592fe8](https://github.com/brandingbrand/flagship/commit/d592fe8))





# [3.0.0-alpha.0](https://github.com/brandingbrand/flagship/compare/v2.0.0...v3.0.0-alpha.0) (2019-02-08)


### Bug Fixes

* Do not exit init process if missing app center token ([24c093e](https://github.com/brandingbrand/flagship/commit/24c093e))
* Require project to provide app center token ([e349966](https://github.com/brandingbrand/flagship/commit/e349966))
* **flagship:** Fix possible memory leak and refactor Android code ([f1b4023](https://github.com/brandingbrand/flagship/commit/f1b4023))
* **flagship:** restore android init to prior version ([d249b92](https://github.com/brandingbrand/flagship/commit/d249b92)), closes [#280](https://github.com/brandingbrand/flagship/issues/280)
* **flagship:** run pod install after react-native link ([2e4a13c](https://github.com/brandingbrand/flagship/commit/2e4a13c))
* **flagship:** runs jscenter() last in build.gradle/repos ([1c7560c](https://github.com/brandingbrand/flagship/commit/1c7560c))


### Features

* **flagship:** Add support for react-native-adobe-analytics library ([c9218f7](https://github.com/brandingbrand/flagship/commit/c9218f7))
* **flagship:** additional pod sources ([fe4c42e](https://github.com/brandingbrand/flagship/commit/fe4c42e))
* **fsengagement:** add fsengagement package ([59c6be8](https://github.com/brandingbrand/flagship/commit/59c6be8))
* upgrade react native to 0.57.8 ([77177b3](https://github.com/brandingbrand/flagship/commit/77177b3))


### BREAKING CHANGES

* This upgrades RN to 0.57.8, React to 16.6.3, and other dependencies as necessary. Updates were made to the iOS and Android native templates according to RN's instructions.





<a name="2.0.0"></a>
# 2.0.0 (2018-10-16)


### Bug Fixes

* **flagship:** add google repository required for latest gradle ([74aadba](https://github.com/brandingbrand/flagship/commit/74aadba))
* **flagship:** Add module support for react-native-camera ([cb1604d](https://github.com/brandingbrand/flagship/commit/cb1604d)), closes [#213](https://github.com/brandingbrand/flagship/issues/213)
* **flagship:** Disable AAPT2 for react-native-camera module ([8e9e5f7](https://github.com/brandingbrand/flagship/commit/8e9e5f7))
* **flagship:** downgrade gradle plugin to 2.3.3 ([d4d3143](https://github.com/brandingbrand/flagship/commit/d4d3143))
* **flagship:** fix typo ([7afadfe](https://github.com/brandingbrand/flagship/commit/7afadfe))
* **flagship:** Fix unsafe UIImplementation threading ([0bb130c](https://github.com/brandingbrand/flagship/commit/0bb130c))
* **flagship:** force subprojects to use sdk and build tools ([a6ee192](https://github.com/brandingbrand/flagship/commit/a6ee192))
* **flagship:** only enable rn link verbose for non-codepush projects ([b64e30d](https://github.com/brandingbrand/flagship/commit/b64e30d))
* **flagship:** remove unneeded override from mainapplication ([1adff63](https://github.com/brandingbrand/flagship/commit/1adff63))
* **flagship:** update react-native-leanplum module name ([bcdbbbc](https://github.com/brandingbrand/flagship/commit/bcdbbbc))
* **flagship:** updates/fixes to init script ([700551d](https://github.com/brandingbrand/flagship/commit/700551d))
* **flagship:** use pod helper to avoid ci errors in firebase ([864b0bb](https://github.com/brandingbrand/flagship/commit/864b0bb))
*  Define property googlePlayServicesVersion ([da0f2d1](https://github.com/brandingbrand/flagship/commit/da0f2d1))
* Get support libs from maven ([18acd09](https://github.com/brandingbrand/flagship/commit/18acd09))
* **pirateship:** disable strict version checking for google services ([b5f6b79](https://github.com/brandingbrand/flagship/commit/b5f6b79))
* **pirateship:** remove old react-native-navigation version ([41e794f](https://github.com/brandingbrand/flagship/commit/41e794f))
* **pirateship:** update android firebase init script ([c754ad3](https://github.com/brandingbrand/flagship/commit/c754ad3))
* revert changes to link.ts script ([0b0dd15](https://github.com/brandingbrand/flagship/commit/0b0dd15))
* update fs-extra to version 7.0.0 ([cd1cfac](https://github.com/brandingbrand/flagship/commit/cd1cfac))
* update react-native-svg to version 7.0.2 ([8f86677](https://github.com/brandingbrand/flagship/commit/8f86677)), closes [#207](https://github.com/brandingbrand/flagship/issues/207)


### Features

* inital commit ([039a84f](https://github.com/brandingbrand/flagship/commit/039a84f))
* **flagship:** add firebase plist placeholder to xcode project ([68b84b5](https://github.com/brandingbrand/flagship/commit/68b84b5))
* **flagship:** add module install script for react-native-firebase ([20a2b2e](https://github.com/brandingbrand/flagship/commit/20a2b2e))
* **flagship:** add targeted device prop to ios config ([3f287a0](https://github.com/brandingbrand/flagship/commit/3f287a0))
* **pirateship:** add fastlane build of pirateship into builds ([a834caa](https://github.com/brandingbrand/flagship/commit/a834caa))
* **pirateship:** redesigned sort and filter menu ([bd11590](https://github.com/brandingbrand/flagship/commit/bd11590))
* Update Android JavaScriptCore ([47bc20f](https://github.com/brandingbrand/flagship/commit/47bc20f))
* upgrade target Android SDK to 27 ([11865f5](https://github.com/brandingbrand/flagship/commit/11865f5))
