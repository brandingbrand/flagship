# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0-alpha.8](https://github.com/brandingbrand/flagship/compare/v10.0.0-alpha.7...v10.0.0-alpha.8) (2020-10-07)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [10.0.0-alpha.7](https://github.com/brandingbrand/flagship/compare/v10.0.0-alpha.6...v10.0.0-alpha.7) (2020-10-06)


### Features

* add story to ChangePassword component (87d086b)





# [10.0.0-alpha.6](https://github.com/brandingbrand/flagship/compare/v10.0.0-alpha.5...v10.0.0-alpha.6) (2020-10-06)


### Bug Fixes

* **fsweb:** Update to newer version of async-storage (b2bbad0)


### Features

* replaced tcomb-form-native with bb fork (d9993ea)





# [10.0.0-alpha.5](https://github.com/brandingbrand/flagship/compare/v10.0.0-alpha.4...v10.0.0-alpha.5) (2020-09-25)


### Bug Fixes

* audit usenativedriver settings for animations (a3622c0)





# [10.0.0-alpha.4](https://github.com/brandingbrand/flagship/compare/v10.0.0-alpha.3...v10.0.0-alpha.4) (2020-09-24)


### Bug Fixes

* **fsproductindex:** Fix product index typing (dcc9286)


### Features

*  add story to SearchScreen component (5d31e1f)
* add knobs - Carousel story (e40f19e)
* add knobs - loginForm story (bbb1cb8)
* add knobs - MultiCarousel story (e317d52)
* add knobs - MultiCarousel story (b44cd43)
* add knobs - Totals story (12e3b31)
* add knobs - Totals story (6923e0c)
* add knobs for CMSFeedback story (835d647)
* Create UpdateNameOrEmail story (994ebe0)
* Create UpdateNameOrEmail story (6bc2e33)





# [10.0.0-alpha.3](https://github.com/brandingbrand/flagship/compare/v9.6.4...v10.0.0-alpha.3) (2020-09-23)


### Bug Fixes

* fix imports of tcomb-form-native (4dbcab9)
* remove unnecessary lodash omit from props (273bae6)
* **fscomponents:** Better backwards compatibility (da268d4)
* **fscomponents:** Fix empty stars for reviews (1b02443)
* **fscomponents:** Fix search history display (e57d0b5)
* **fscomponents:** Remove redundant code in SearchModal (d874255)


### Features

* upgrade to RN 0.63 (507d0e4)
* upgrade typescript to 4.0.2 (b6e6bac)
* **flagship:** RNDiff updates for RN63 (63b22b3)
* Replace all occurrences of "any" in fscomponents/ProductItem (7331806)


### Reverts

* Revert "chore(fscomponents): Remove tcomb-form-native" (396630c)


### BREAKING CHANGES

* major react native update
* This upgrades Typescript from 3.x to 4.x which includes changes that are for edge cases but still breaking nonetheless. The full changelog can be found here: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#breaking-changes

Fixed a couple instances where TypeScript recognized that we were always overriding variables by using the spread operator.





# [10.0.0-alpha.2](https://github.com/brandingbrand/flagship/compare/v10.0.0-alpha.1...v10.0.0-alpha.2) (2020-09-03)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [10.0.0-alpha.1](https://github.com/brandingbrand/flagship/compare/v10.0.0-alpha.0...v10.0.0-alpha.1) (2020-08-13)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [10.0.0-alpha.0](https://github.com/brandingbrand/flagship/compare/v9.6.2...v10.0.0-alpha.0) (2020-08-06)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [9.6.2](https://github.com/brandingbrand/flagship/compare/v9.6.1...v9.6.2) (2020-07-28)


### Bug Fixes

* **fscomponents:** Fix crashes with bad currency codes (07070ea)
* **fscomponents:** Fix currency conversion (f746451)





## [9.6.1](https://github.com/brandingbrand/flagship/compare/v9.6.0...v9.6.1) (2020-07-16)


### Bug Fixes

* **fscomponents:** Fix crash for empty carousel (53aee9f)
* **fscomponents:** Use React Children helper (0d33371)





# [9.6.0](https://github.com/brandingbrand/flagship/compare/v9.5.0...v9.6.0) (2020-07-09)


### Bug Fixes

* **fscomponents:** Ensure required props are serializable for Swatches (a8e4a8f)





# [9.5.0](https://github.com/brandingbrand/flagship/compare/v9.4.0...v9.5.0) (2020-06-04)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [9.4.0](https://github.com/brandingbrand/flagship/compare/v9.3.0...v9.4.0) (2020-06-02)


### Bug Fixes

* **fscomponents:** added styling props for IE11 UI fix (763365d)





# [9.3.0](https://github.com/brandingbrand/flagship/compare/v9.2.1...v9.3.0) (2020-05-14)


### Bug Fixes

* **fscomponents:** Fix circular dependency (4120e03)
* **fscomponents:** fix missing icon for paypal button on web (545cea6)
* **LocationItem:** put return at end of component (f020577)


### Features

* add knobs - CreditCardForm story (5710b5e)
* add knobs for CMSBannerCarousel story (b30f2e3)
* add knobs for ImageWithOverlay story (4c7f7b7)
* add knobs for location item (11a426d)
* add knobs for modal (0e0abdb)
* add knobs for MoreText story (29107d5)
* add knobs for Selector story (54db967)
* add knobs for stepper story (44f03a2)
* **fscomponents:** add knobs to review list (0edae45)
* add knobs for swatches story (32ddce3)
* add knobs for TabbedContainer story (c898759)
* add serializable props for LocationItem component (f40c317)
* add serializable props for ReviewIndicator (c073d4d)
* add serializable props to CartItem (2fdb47d)
* add serializable props to ShareButton component (e83c067)
* add serializable props to Swatch component (3774ad4)
* add serializable props to TabbedContainer component (d0c8916)





## [9.2.1](https://github.com/brandingbrand/flagship/compare/v9.2.0...v9.2.1) (2020-05-08)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [9.2.0](https://github.com/brandingbrand/flagship/compare/v9.1.0...v9.2.0) (2020-05-08)


### Features

* add serializable props for CategoryBox component (e6d53c6)
* add serializable props for CategoryLine component (b1dfbc2)
* add serializable props for MoreText component (8392ed5)
* add serializable props for ReviewsList (4ab1110)
* add serializable props for ReviewsSummary (a21f924)
* add serializable props for StatelessStepper component (b650f1a)
* add serializable props for Step and StepIndicator (9997c62)
* add serializable props for swatches (7fb6966)
* add serializable props to Alert component (76b0842)
* add serializable props to carousel component (dabcbcb)
* **fscomponents:** add knobs to alert stories (40e3092)
* add serializable props to CartCount component (1ecb808)
* add serializable props to PayPalCheckoutButton component (0b2d1e6)
* add serializable props to SearchModal Form component (59280fe)
* add serializable props to SearchScreen component (1388c05)
* add serializable props to Stepper component (52c3ab2)
* Create LoginFormFK story (a41723f)
* create RegistrationForm story (011107a)





# [9.1.0](https://github.com/brandingbrand/flagship/compare/v9.0.1...v9.1.0) (2020-04-15)


### Bug Fixes

* **flagship:** Unify qs versions to 6.9.1 (6f3a9da)
* **fscomponents:** Correct empty star order (27ee0ae)
* **fscomponents:** Fix circular require (29bdc5f)
* **fscomponents:** Fix other style order (ae5a252)
* **fscomponents:** Fix updating button title (9b924fc)
* **fscomponents:** Fix use of empty star style for reviews (63644aa)
* **fscomponents:** Name inner component functions (c45bfae)
* **fscomponents:** Remove any from CategoryBox (fc74c48)
* **fscomponents:** Remove ModalHalfScreen componentWillReceiveProps (14bd6fb)
* **fscomponents:** Update form tests (654569e)
* **fscomponents:** Updated Accordion component (e2a94b0)


### Features

* Add SerializableAccordionProps (ff68583)
* **fscomponents:** add ada label and initial value prop to searchbar (89d16ac)
* add story to cartItem component (218a717)
* add story to fadeInImage component (acf8c82)
* add story to PageIndicator component (9db9ed2)
* add story to PageIndicator component (2124350)
* Create CreditCardNumber story (6b04725)
* **fscomponents:** add knobs to accordian stories (b22371b)
* **fscomponents:** Added arrowRange prop (23ebe77)





## [9.0.1](https://github.com/brandingbrand/flagship/compare/v9.0.0...v9.0.1) (2020-04-03)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [9.0.0](https://github.com/brandingbrand/flagship/compare/v8.7.0...v9.0.0) (2020-03-30)


### Features

* flagship 9 with rn 61 and rn navigation 4 ([#1109](https://github.com/brandingbrand/flagship/issues/1109)) (6875b1b), closes [#816](https://github.com/brandingbrand/flagship/issues/816) [#871](https://github.com/brandingbrand/flagship/issues/871) [#872](https://github.com/brandingbrand/flagship/issues/872) [#873](https://github.com/brandingbrand/flagship/issues/873) [#923](https://github.com/brandingbrand/flagship/issues/923) [#958](https://github.com/brandingbrand/flagship/issues/958) [#915](https://github.com/brandingbrand/flagship/issues/915) [#877](https://github.com/brandingbrand/flagship/issues/877) [#878](https://github.com/brandingbrand/flagship/issues/878) [#867](https://github.com/brandingbrand/flagship/issues/867) [#898](https://github.com/brandingbrand/flagship/issues/898) [#906](https://github.com/brandingbrand/flagship/issues/906) [#905](https://github.com/brandingbrand/flagship/issues/905) [#889](https://github.com/brandingbrand/flagship/issues/889) [#925](https://github.com/brandingbrand/flagship/issues/925) [#926](https://github.com/brandingbrand/flagship/issues/926) [#924](https://github.com/brandingbrand/flagship/issues/924) [#932](https://github.com/brandingbrand/flagship/issues/932) [#936](https://github.com/brandingbrand/flagship/issues/936) [#922](https://github.com/brandingbrand/flagship/issues/922) [#929](https://github.com/brandingbrand/flagship/issues/929) [#930](https://github.com/brandingbrand/flagship/issues/930) [#944](https://github.com/brandingbrand/flagship/issues/944) [#952](https://github.com/brandingbrand/flagship/issues/952) [#877](https://github.com/brandingbrand/flagship/issues/877) [#878](https://github.com/brandingbrand/flagship/issues/878) [#867](https://github.com/brandingbrand/flagship/issues/867) [#898](https://github.com/brandingbrand/flagship/issues/898) [#906](https://github.com/brandingbrand/flagship/issues/906) [#905](https://github.com/brandingbrand/flagship/issues/905) [#889](https://github.com/brandingbrand/flagship/issues/889) [#925](https://github.com/brandingbrand/flagship/issues/925) [#926](https://github.com/brandingbrand/flagship/issues/926) [#924](https://github.com/brandingbrand/flagship/issues/924) [#932](https://github.com/brandingbrand/flagship/issues/932) [#936](https://github.com/brandingbrand/flagship/issues/936) [#922](https://github.com/brandingbrand/flagship/issues/922) [#929](https://github.com/brandingbrand/flagship/issues/929) [#930](https://github.com/brandingbrand/flagship/issues/930) [#944](https://github.com/brandingbrand/flagship/issues/944) [#954](https://github.com/brandingbrand/flagship/issues/954) [#947](https://github.com/brandingbrand/flagship/issues/947) [#913](https://github.com/brandingbrand/flagship/issues/913) [#957](https://github.com/brandingbrand/flagship/issues/957) [#950](https://github.com/brandingbrand/flagship/issues/950) [#959](https://github.com/brandingbrand/flagship/issues/959) [#960](https://github.com/brandingbrand/flagship/issues/960) [#962](https://github.com/brandingbrand/flagship/issues/962) [#953](https://github.com/brandingbrand/flagship/issues/953) [#961](https://github.com/brandingbrand/flagship/issues/961) [#956](https://github.com/brandingbrand/flagship/issues/956) [#911](https://github.com/brandingbrand/flagship/issues/911) [#972](https://github.com/brandingbrand/flagship/issues/972) [#970](https://github.com/brandingbrand/flagship/issues/970) [#969](https://github.com/brandingbrand/flagship/issues/969) [#893](https://github.com/brandingbrand/flagship/issues/893) [#910](https://github.com/brandingbrand/flagship/issues/910) [#988](https://github.com/brandingbrand/flagship/issues/988) [#983](https://github.com/brandingbrand/flagship/issues/983) [#984](https://github.com/brandingbrand/flagship/issues/984) [#985](https://github.com/brandingbrand/flagship/issues/985) [#986](https://github.com/brandingbrand/flagship/issues/986) [#1007](https://github.com/brandingbrand/flagship/issues/1007) [#1008](https://github.com/brandingbrand/flagship/issues/1008) [#1009](https://github.com/brandingbrand/flagship/issues/1009) [#1030](https://github.com/brandingbrand/flagship/issues/1030) [#1039](https://github.com/brandingbrand/flagship/issues/1039) [#1042](https://github.com/brandingbrand/flagship/issues/1042) [#1088](https://github.com/brandingbrand/flagship/issues/1088) [#877](https://github.com/brandingbrand/flagship/issues/877) [#878](https://github.com/brandingbrand/flagship/issues/878) [#867](https://github.com/brandingbrand/flagship/issues/867) [#898](https://github.com/brandingbrand/flagship/issues/898) [#906](https://github.com/brandingbrand/flagship/issues/906) [#905](https://github.com/brandingbrand/flagship/issues/905) [#889](https://github.com/brandingbrand/flagship/issues/889) [#925](https://github.com/brandingbrand/flagship/issues/925) [#926](https://github.com/brandingbrand/flagship/issues/926) [#924](https://github.com/brandingbrand/flagship/issues/924) [#932](https://github.com/brandingbrand/flagship/issues/932) [#936](https://github.com/brandingbrand/flagship/issues/936) [#922](https://github.com/brandingbrand/flagship/issues/922) [#929](https://github.com/brandingbrand/flagship/issues/929) [#930](https://github.com/brandingbrand/flagship/issues/930) [#944](https://github.com/brandingbrand/flagship/issues/944) [#954](https://github.com/brandingbrand/flagship/issues/954) [#947](https://github.com/brandingbrand/flagship/issues/947) [#957](https://github.com/brandingbrand/flagship/issues/957) [#950](https://github.com/brandingbrand/flagship/issues/950) [#959](https://github.com/brandingbrand/flagship/issues/959) [#960](https://github.com/brandingbrand/flagship/issues/960) [#962](https://github.com/brandingbrand/flagship/issues/962) [#953](https://github.com/brandingbrand/flagship/issues/953) [#961](https://github.com/brandingbrand/flagship/issues/961) [#956](https://github.com/brandingbrand/flagship/issues/956) [#911](https://github.com/brandingbrand/flagship/issues/911) [#972](https://github.com/brandingbrand/flagship/issues/972) [#970](https://github.com/brandingbrand/flagship/issues/970) [#969](https://github.com/brandingbrand/flagship/issues/969) [#893](https://github.com/brandingbrand/flagship/issues/893) [#910](https://github.com/brandingbrand/flagship/issues/910) [#988](https://github.com/brandingbrand/flagship/issues/988) [#983](https://github.com/brandingbrand/flagship/issues/983) [#984](https://github.com/brandingbrand/flagship/issues/984) [#985](https://github.com/brandingbrand/flagship/issues/985) [#986](https://github.com/brandingbrand/flagship/issues/986) [#1007](https://github.com/brandingbrand/flagship/issues/1007) [#1008](https://github.com/brandingbrand/flagship/issues/1008) [#1009](https://github.com/brandingbrand/flagship/issues/1009) [#1030](https://github.com/brandingbrand/flagship/issues/1030) [#1039](https://github.com/brandingbrand/flagship/issues/1039) [#1042](https://github.com/brandingbrand/flagship/issues/1042) [#1074](https://github.com/brandingbrand/flagship/issues/1074) [#1077](https://github.com/brandingbrand/flagship/issues/1077) [#1083](https://github.com/brandingbrand/flagship/issues/1083) [#1082](https://github.com/brandingbrand/flagship/issues/1082) [#1091](https://github.com/brandingbrand/flagship/issues/1091)


### BREAKING CHANGES

* splash screens will need to be converted to storyboards

* feat: update fsapp to use react-native-navigation 2

- Use global event handlers for popToRoot on tab press for Android and restoring screen on load
option
- Add requirement for tabs to have ids
* Tabs must now have ids defined in their configuration

* feat: update pirateship to use react-native-navigation 2

* refactor: Use react native community version of AsyncStorage

* feat(fsengagement): add new zones

* fix: fix codepush integration with RNN v2

* fix(fsapp): RNN v2 allow passing static styling as a function

RNN v2 by default is passing static styling as a function so passProps info can be included. Updated to support the default behavior. This is not breaking the backward-compatible logic

* feat(fsengagement): add gridwall and product carousel

* feat(fsengagement): cache last update + add isNew flag to each message
* This requires updating CocoaPods (including in CI) to v1.7.2+ in order for pod install to work with the CDN. This allows CocoaPods to pull from their own CDN which avoids rate limiting when pulling sources from GitHub instead.

* chore: ensure android ci step uses node 10
* This removes the add-keys-ios and add-keys-android scripts as they required an internal BB workflow to work. The new scripts, add-keys-ios-internal and add-keys-android-internal, can be configured with the environment files with passwords being passed in as environment variables.

For usage instructions, see the new wiki article: https://github.com/brandingbrand/flagship/wiki/Signing-Your-Apps

* chore: pin react-native-sensitive-info to 5.4.x

* feat(fscomponents): support more styling options for MultiCarousel

* feat(fscomponents): add hideZoomButton props to ZoomCarousel

* fix: Add 'Marquis' feature to Button with title dynamically reflecting CTA state

* chore(fscomponents): add missing typedef to modalhalfscreen component

* fix(flagship): update string replace to work in new fastfile

* fix: get default env from initial script

* build: upgrade deprecated webpack dev server

* fix(flagship): fix fastlane build lane

Added missing xcargs flags that tells xcode to make an unprovisioned build when "fastlane build" is executed.

* chore: tell greenkeeper to ignore more dependencies
react, metro-react-babel-preset, and babel should only be updated as part of coordinated React Native upgrades.
* This requires updating CocoaPods (including in CI) to v1.7.2+ in order for pod install to work with the CDN. This allows CocoaPods to pull from their own CDN which avoids rate limiting when pulling sources from GitHub instead.

* fix(flagship): Latest react-native-payments and react-native-swiper

Also:
- added supportLibVersion to the gradle file
- advises what to do instead of calling setOnNavigatorEvent
- fix for NativeModules.StatusBarManager.HEIGHT
- fix for instances.filter being called on an object instead of an array

* chore: empty commit to restart coveralls

* chore(release): publish v8.0.0

* fix(flagship): Updated modules and fixed pirateship Android

Jetifier doesn't run on hoisted modules, so this makes @brandingbrand/react-native-payments get updated. Also updated path-to-regexp to v6, react-native-svg to v10, react-native-webview to v8, react-native-video to 5, and removed the unused uglifyjs-webpack-plugin. Also updated all packages to the latest in-range version, excluding the @babel modules and modules that have it as a higher-versioned dependency, such as the @storybook modules.

* refactor(fscomponents): FLAGSHIP-59 Updating To Function Component

* refactor(fscomponents): FLAGSHIP-58 Updating To Function Component

* fix(fscomponents): FLAGSHIP-64 - Make Shelf a function component

* refactor(fscomponents): FLAGSHIP-60 Updating To Function Component

* feat(fscomponents): Add formik, yup to fscomponents and LoginForm

* refactor(fscomponents): FLAGSHIP-63 - Updating To Function Component

* fix(flagship): Run react-native link to link assets

Assets like fonts need to be linked so the application will have access to them.

* refactor(fscomponents): FLAGSHIP-50 Update to a function component

* refactor(fscomponents): FLAGSHIP-49 - Make AddressForm a function component
* This removes the add-keys-ios and add-keys-android scripts as they required an internal BB workflow to work. The new scripts, add-keys-ios-internal and add-keys-android-internal, can be configured with the environment files with passwords being passed in as environment variables.

For usage instructions, see the new wiki article: https://github.com/brandingbrand/flagship/wiki/Signing-Your-Apps

* chore: pin react-native-sensitive-info to 5.4.x

* feat(fscomponents): support more styling options for MultiCarousel

* feat(fscomponents): add hideZoomButton props to ZoomCarousel

* fix: Add 'Marquis' feature to Button with title dynamically reflecting CTA state

* chore(fscomponents): add missing typedef to modalhalfscreen component

* fix(flagship): update string replace to work in new fastfile

* build: upgrade deprecated webpack dev server

* fix(flagship): fix fastlane build lane

Added missing xcargs flags that tells xcode to make an unprovisioned build when "fastlane build" is executed.

* chore: tell greenkeeper to ignore more dependencies
react, metro-react-babel-preset, and babel should only be updated as part of coordinated React Native upgrades.
* This requires updating CocoaPods (including in CI) to v1.7.2+ in order for pod install to work with the CDN. This allows CocoaPods to pull from their own CDN which avoids rate limiting when pulling sources from GitHub instead.

* chore: empty commit to restart coveralls

* chore(release): publish v8.0.0

* refactor(fscomponents): FLAGSHIP-59 Updating To Function Component

* refactor(fscomponents): FLAGSHIP-58 Updating To Function Component

* fix(fscomponents): FLAGSHIP-64 - Make Shelf a function component

* refactor(fscomponents): FLAGSHIP-60 Updating To Function Component

* feat(fscomponents): Add formik, yup to fscomponents and LoginForm

* refactor(fscomponents): FLAGSHIP-63 - Updating To Function Component

* refactor(fscomponents): FLAGSHIP-50 Update to a function component

* refactor(fscomponents): FLAGSHIP-49 - Make AddressForm a function component





# [8.3.0-rnn2.0](https://github.com/brandingbrand/flagship/compare/v8.1.3-rnn2.0...v8.3.0-rnn2.0) (2019-10-17)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [8.1.3-rnn2.0](https://github.com/brandingbrand/flagship/compare/v8.1.1-rnn2.0...v8.1.3-rnn2.0) (2019-10-11)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [8.1.2-rnn2.0](https://github.com/brandingbrand/flagship/compare/v8.1.1-rnn2.0...v8.1.2-rnn2.0) (2019-10-11)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [8.1.1-rnn2.0](https://github.com/brandingbrand/flagship/compare/v7.4.1...v8.1.1-rnn2.0) (2019-10-11)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [8.7.0](https://github.com/brandingbrand/flagship/compare/v8.6.1...v8.7.0) (2020-03-26)


### Features

* **fscomponents:** Add knobs to zoom carousel ([#1099](https://github.com/brandingbrand/flagship/issues/1099)) (c7b8b07)
* **fscomponents:** custom a11yLabel for selector title ([#1097](https://github.com/brandingbrand/flagship/issues/1097)) (147da0c)
* **fscomponents:** ShareButton web support ([#1102](https://github.com/brandingbrand/flagship/issues/1102)) (4a369a4)





## [8.6.1](https://github.com/brandingbrand/flagship/compare/v8.6.0...v8.6.1) (2020-03-23)


### Bug Fixes

* **fscomponents:** add accessibilityRole to selector title ([#1096](https://github.com/brandingbrand/flagship/issues/1096)) (0110c2e)





# [8.6.0](https://github.com/brandingbrand/flagship/compare/v8.5.0...v8.6.0) (2020-03-23)


### Features

* **fscomponents:** Add image counter, new style options to ZoomCarousel ([#1093](https://github.com/brandingbrand/flagship/issues/1093)) (bb02ec7)





# [8.5.0](https://github.com/brandingbrand/flagship/compare/v8.4.0...v8.5.0) (2020-03-19)


### Features

* **fscomponents:** Add styling and prop options to ZoomCarousel ([#1087](https://github.com/brandingbrand/flagship/issues/1087)) (43c4bc5)





# [8.4.0](https://github.com/brandingbrand/flagship/compare/v8.3.0...v8.4.0) (2020-03-09)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [8.3.0](https://github.com/brandingbrand/flagship/compare/v8.2.0...v8.3.0) (2020-02-12)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [8.2.0](https://github.com/brandingbrand/flagship/compare/v8.1.0...v8.2.0) (2020-02-10)


### Bug Fixes

* adds translations for hints (2cb6a46)
* **fscomponents:** Move story files to all live in the same folder ([#1042](https://github.com/brandingbrand/flagship/issues/1042)) (040933d)


### Features

* **fscomponents:** FLAGSHIP-102 accessibility for Filter (9e6cf77)
* **fscomponents:** FLAGSHIP-104 accessibility for Zoom carousel (0c84ebc)





# [8.1.0](https://github.com/brandingbrand/flagship/compare/v8.0.0...v8.1.0) (2020-01-24)


### Bug Fixes

* **fscomponents:** FLAGSHIP-64 - Make Shelf a function component (80c8110)
* **fscomponents:** replace Arial with sans-serif ([#1030](https://github.com/brandingbrand/flagship/issues/1030)) (6caa10d)


### Features

* **fscomponents:** Add formik, yup to fscomponents and LoginForm (d172d25)





# [8.0.0](https://github.com/brandingbrand/flagship/compare/v7.10.0...v8.0.0) (2020-01-15)

**Note:** Version bump only for package @brandingbrand/fscomponents







**Note:** Version bump only for package @brandingbrand/fscomponents





# [7.10.0](https://github.com/brandingbrand/flagship/compare/v7.8.0...v7.10.0) (2020-01-14)


### Bug Fixes

* **fscomponents:** ModalHalfScreen listener height update ([#957](https://github.com/brandingbrand/flagship/issues/957)) (abbcf03)





# [7.8.0](https://github.com/brandingbrand/flagship/compare/v7.7.1...v7.8.0) (2019-12-18)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [7.7.1](https://github.com/brandingbrand/flagship/compare/v7.7.0...v7.7.1) (2019-11-20)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [7.7.0](https://github.com/brandingbrand/flagship/compare/v7.6.0...v7.7.0) (2019-11-20)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [7.6.0](https://github.com/brandingbrand/flagship/compare/v7.5.4...v7.6.0) (2019-11-14)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [7.5.4](https://github.com/brandingbrand/flagship/compare/v7.5.3...v7.5.4) (2019-11-08)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [7.5.3](https://github.com/brandingbrand/flagship/compare/v7.5.2...v7.5.3) (2019-11-08)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [7.5.2](https://github.com/brandingbrand/flagship/compare/v7.5.1...v7.5.2) (2019-11-08)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [7.5.1](https://github.com/brandingbrand/flagship/compare/v7.5.0...v7.5.1) (2019-11-07)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [7.5.0](https://github.com/brandingbrand/flagship/compare/v7.4.3...v7.5.0) (2019-11-07)


### Features

* **fscomponents:** add custom modal content logic and test view ([7baf939](https://github.com/brandingbrand/flagship/commit/7baf939))
* **fscomponents:** add hideZoomButton props to ZoomCarousel ([d342370](https://github.com/brandingbrand/flagship/commit/d342370))
* **fscomponents:** add nextArrowOnBlur prop to pass through ([f49960a](https://github.com/brandingbrand/flagship/commit/f49960a))
* **fscomponents:** add some option props to zoomCarousel ([722cd92](https://github.com/brandingbrand/flagship/commit/722cd92))
* **fscomponents:** extend changes to non web-specific zoomcarousel ([fddce73](https://github.com/brandingbrand/flagship/commit/fddce73))
* **fscomponents:** support more styling options for MultiCarousel ([cf964f9](https://github.com/brandingbrand/flagship/commit/cf964f9))





## [7.4.3](https://github.com/brandingbrand/flagship/compare/v7.4.2...v7.4.3) (2019-10-30)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [7.4.2](https://github.com/brandingbrand/flagship/compare/v7.4.1...v7.4.2) (2019-10-29)


### Bug Fixes

* Add 'Marquis' feature to Button with title dynamically reflecting CTA state ([9c49aa7](https://github.com/brandingbrand/flagship/commit/9c49aa7))
* remove unnecessary checks ([9789ff3](https://github.com/brandingbrand/flagship/commit/9789ff3))





## [7.4.1](https://github.com/brandingbrand/flagship/compare/v7.4.0...v7.4.1) (2019-10-09)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [7.4.0](https://github.com/brandingbrand/flagship/compare/v7.3.0...v7.4.0) (2019-10-08)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [7.3.0](https://github.com/brandingbrand/flagship/compare/v7.2.0...v7.3.0) (2019-10-08)


### Features

* add position property for half modal component ([9fb3e76](https://github.com/brandingbrand/flagship/commit/9fb3e76))





# [7.2.0](https://github.com/brandingbrand/flagship/compare/v7.1.1...v7.2.0) (2019-10-07)


### Bug Fixes

* create SyndicationIndicator component, simplify conditional ([96ad754](https://github.com/brandingbrand/flagship/commit/96ad754))
* excessive calls of handleContainerSizeChange in MultiCarousel ([7d820ba](https://github.com/brandingbrand/flagship/commit/7d820ba))
* fix infinite re-render bug when using renderSyndicatedIndicator prop ([ef03df5](https://github.com/brandingbrand/flagship/commit/ef03df5))
* remove unused function ([ff8ea15](https://github.com/brandingbrand/flagship/commit/ff8ea15))





## [7.1.1](https://github.com/brandingbrand/flagship/compare/v7.1.0...v7.1.1) (2019-10-04)


### Bug Fixes

* **fscomponents:** add arg to bv syndication badge render prop ([36d435f](https://github.com/brandingbrand/flagship/commit/36d435f))





# [7.1.0](https://github.com/brandingbrand/flagship/compare/v7.0.0...v7.1.0) (2019-10-02)


### Features

* update bv syndicated indicator style ([3f706e3](https://github.com/brandingbrand/flagship/commit/3f706e3))





# [7.0.0](https://github.com/brandingbrand/flagship/compare/v6.3.0...v7.0.0) (2019-09-27)


### Bug Fixes

* **fscomponents:** flatten validation for cc number to onblur ([175aabe](https://github.com/brandingbrand/flagship/commit/175aabe))


### Features

* update bv components w/ syndicated indicator ([9239ada](https://github.com/brandingbrand/flagship/commit/9239ada))





# [6.3.0](https://github.com/brandingbrand/flagship/compare/v6.2.0...v6.3.0) (2019-09-23)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [6.2.0](https://github.com/brandingbrand/flagship/compare/v6.1.4...v6.2.0) (2019-09-19)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [6.1.4](https://github.com/brandingbrand/flagship/compare/v6.1.3...v6.1.4) (2019-09-17)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [6.1.3](https://github.com/brandingbrand/flagship/compare/v6.1.2...v6.1.3) (2019-09-12)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [6.1.2](https://github.com/brandingbrand/flagship/compare/v6.1.1...v6.1.2) (2019-09-12)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [6.1.1](https://github.com/brandingbrand/flagship/compare/v6.1.0...v6.1.1) (2019-09-12)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [6.1.0](https://github.com/brandingbrand/flagship/compare/v6.0.0...v6.1.0) (2019-09-10)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [6.0.0](https://github.com/brandingbrand/flagship/compare/v5.3.0...v6.0.0) (2019-09-04)


### Bug Fixes

* **fscomponents:** fix price/originalPrice comparison ([0f9447f](https://github.com/brandingbrand/flagship/commit/0f9447f))


### BREAKING CHANGES

* **fscomponents:** Under the default render behavior, originalPrice will no longer be displayed unless
it is actually different from price.





# [5.3.0](https://github.com/brandingbrand/flagship/compare/v5.2.0...v5.3.0) (2019-08-23)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [5.2.0](https://github.com/brandingbrand/flagship/compare/v5.1.0...v5.2.0) (2019-08-21)


### Bug Fixes

* **fscomponents:** restore missing type for zoomcarousel ([236993f](https://github.com/brandingbrand/flagship/commit/236993f))
* Fix application of refinements ([82c9813](https://github.com/brandingbrand/flagship/commit/82c9813))


### Features

* **fscomponents:** add some option props to zoomCarousel ([45a054a](https://github.com/brandingbrand/flagship/commit/45a054a))
* **fscomponents:** add some option props to zoomCarousel ([a195337](https://github.com/brandingbrand/flagship/commit/a195337))
* **fscomponents:** extend changes to non web-specific zoomcarousel ([18743f8](https://github.com/brandingbrand/flagship/commit/18743f8))
* **fscomponents:** extend changes to non web-specific zoomcarousel ([c7129f5](https://github.com/brandingbrand/flagship/commit/c7129f5))
* **fscomponents:** fix app bug by removing view wrapper ([fbf66a8](https://github.com/brandingbrand/flagship/commit/fbf66a8))
* **fscomponents:** remove backtick ([23b9baa](https://github.com/brandingbrand/flagship/commit/23b9baa))





## [5.1.1](https://github.com/brandingbrand/flagship/compare/v5.1.0...v5.1.1) (2019-08-19)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [5.1.0](https://github.com/brandingbrand/flagship/compare/v5.0.0...v5.1.0) (2019-08-14)


### Bug Fixes

* **fscomponents:** restore missing type for zoomcarousel ([4150bc7](https://github.com/brandingbrand/flagship/commit/4150bc7))


### Features

* **fscomponents:** add some option props to zoomCarousel ([6d87b3e](https://github.com/brandingbrand/flagship/commit/6d87b3e))
* **fscomponents:** add some option props to zoomCarousel ([7178d1c](https://github.com/brandingbrand/flagship/commit/7178d1c))
* **fscomponents:** extend changes to non web-specific zoomcarousel ([88fe244](https://github.com/brandingbrand/flagship/commit/88fe244))
* **fscomponents:** extend changes to non web-specific zoomcarousel ([44eb31c](https://github.com/brandingbrand/flagship/commit/44eb31c))
* **fscomponents:** fix app bug by removing view wrapper ([61277d6](https://github.com/brandingbrand/flagship/commit/61277d6))
* **fscomponents:** remove backtick ([affeae3](https://github.com/brandingbrand/flagship/commit/affeae3))





# [5.0.0](https://github.com/brandingbrand/flagship/compare/v3.2.1...v5.0.0) (2019-08-06)


### Features

* implement react native 0.59 ([0592aa2](https://github.com/brandingbrand/flagship/commit/0592aa2))
* **fscomponents:** add hideZoomButton props to ZoomCarousel ([c9dbfe4](https://github.com/brandingbrand/flagship/commit/c9dbfe4))
* **fscomponents:** add nextArrowOnBlur prop to pass through ([e0aaf30](https://github.com/brandingbrand/flagship/commit/e0aaf30))
* **fscomponents:** add renderModalContent prop ([4105c44](https://github.com/brandingbrand/flagship/commit/4105c44))
* **fscomponents:** add some option props to zoomCarousel ([b7455e4](https://github.com/brandingbrand/flagship/commit/b7455e4))
* **fscomponents:** extend changes to non web-specific zoomcarousel ([18ce3a6](https://github.com/brandingbrand/flagship/commit/18ce3a6))


### BREAKING CHANGES

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


### Bug Fixes

* **fscomponents:** ease in carousel when there is itemUpdated ([b4fad17](https://github.com/brandingbrand/flagship/commit/b4fad17))


### Features

* implement react native 0.59 ([ab18642](https://github.com/brandingbrand/flagship/commit/ab18642))


### BREAKING CHANGES

* This implements react native 0.59. Upgrading to this version will require dependency updates to be described in future documentation.





# [4.0.0-alpha.3](https://github.com/brandingbrand/flagship/compare/v3.1.1...v4.0.0-alpha.3) (2019-07-16)


### Bug Fixes

* **fscomponents:** ease in carousel when there is itemUpdated ([98bde12](https://github.com/brandingbrand/flagship/commit/98bde12))





# [3.2.0](https://github.com/brandingbrand/flagship/compare/v3.1.1...v3.2.0) (2019-07-03)

**Note:** Version bump only for package @brandingbrand/fscomponents





## [3.1.1](https://github.com/brandingbrand/flagship/compare/v3.1.0...v3.1.1) (2019-06-04)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [3.1.0](https://github.com/brandingbrand/flagship/compare/v3.0.0...v3.1.0) (2019-06-03)


### Bug Fixes

* **fscomponents:** accessibilitylabel spelling fix ([91265a2](https://github.com/brandingbrand/flagship/commit/91265a2))
* **fscomponents:** add accessibility to searchbar ([69d808f](https://github.com/brandingbrand/flagship/commit/69d808f))
* **fscomponents:** Add classes to swatch scroller for css ([aa7d1f6](https://github.com/brandingbrand/flagship/commit/aa7d1f6))
* **fscomponents:** add key to SelectorList items ([48b4161](https://github.com/brandingbrand/flagship/commit/48b4161))
* **fscomponents:** add opt prop and color change for reviewIndicator ([e49f7c8](https://github.com/brandingbrand/flagship/commit/e49f7c8))
* **fscomponents:** fix linting of readme ([d14dd8c](https://github.com/brandingbrand/flagship/commit/d14dd8c))
* **fscomponents:** Fixes for IE11 ([6a3f2d0](https://github.com/brandingbrand/flagship/commit/6a3f2d0))
* **fscomponents:** Fixes for IE11 buttons ([1b4067a](https://github.com/brandingbrand/flagship/commit/1b4067a))
* **fscomponents:** hide web carousel if item width is 0 ([047d28b](https://github.com/brandingbrand/flagship/commit/047d28b))
* **fscomponents:** Move loadHistoryToState to componentDidMount ([2708bbd](https://github.com/brandingbrand/flagship/commit/2708bbd))
* **fscomponents:** Move Multicarousel opacity and initialized into state ([5628e2f](https://github.com/brandingbrand/flagship/commit/5628e2f))
* **fscomponents:** remove accessible prop to stop focus ([d861de6](https://github.com/brandingbrand/flagship/commit/d861de6))
* **fscomponents:** revert buggy button refactor ([23430f8](https://github.com/brandingbrand/flagship/commit/23430f8)), closes [#415](https://github.com/brandingbrand/flagship/issues/415) [#587](https://github.com/brandingbrand/flagship/issues/587)
* add a11yLabel/Role to Selector ([4f58087](https://github.com/brandingbrand/flagship/commit/4f58087))
* **fscomponents:** Round number of items for Multicarousel page width ([3a5ef38](https://github.com/brandingbrand/flagship/commit/3a5ef38))
* **fscomponents:** stepper as stateless functional component ([1944cda](https://github.com/brandingbrand/flagship/commit/1944cda))
* **fscomponents:** update item width with new prop ([e13849c](https://github.com/brandingbrand/flagship/commit/e13849c))
* **fscomponents:** Use onSubmit function for SearchBar button ([da4e807](https://github.com/brandingbrand/flagship/commit/da4e807))


### Features

* **fscomponents:** add accessibility for modalhalfscreen background ([86be4ad](https://github.com/brandingbrand/flagship/commit/86be4ad))
* upgrade storybook to 4.2.0 and rn-web to 0.11.1 to fix storybook ([dce1570](https://github.com/brandingbrand/flagship/commit/dce1570))
* **fscomponents:** add a11yRole/Label to CategoryLine/SelectableRow ([7b9118b](https://github.com/brandingbrand/flagship/commit/7b9118b))
* **fscomponents:** add ability to pass arrow styles for multicarousel ([200deb4](https://github.com/brandingbrand/flagship/commit/200deb4))
* **fscomponents:** add accessibility labels to button and swatches ([edfcbf1](https://github.com/brandingbrand/flagship/commit/edfcbf1))
* **fscomponents:** add accessibility role to categorybox and searchbar ([18ab22f](https://github.com/brandingbrand/flagship/commit/18ab22f))
* **fscomponents:** add button properties for carousel ([74836b6](https://github.com/brandingbrand/flagship/commit/74836b6))
* **fscomponents:** add completed state accessibility label in Step ([2434842](https://github.com/brandingbrand/flagship/commit/2434842))
* **fscomponents:** add function to generate dynamic label from cms ([f7b6c3f](https://github.com/brandingbrand/flagship/commit/f7b6c3f))
* **fscomponents:** add onblur and translations to multi carousel arrows ([6afdf0b](https://github.com/brandingbrand/flagship/commit/6afdf0b))
* **fscomponents:** Custom styling for swatch show more/less ([f0227bc](https://github.com/brandingbrand/flagship/commit/f0227bc))
* **fscomponents:** make review recommendations configurable ([4a701a0](https://github.com/brandingbrand/flagship/commit/4a701a0))





# [3.0.0](https://github.com/brandingbrand/flagship/compare/v2.0.0...v3.0.0) (2019-02-22)


### Bug Fixes

* **fscomponents:** Allow partial reviewIndicatorProps to be passed ([2c356ca](https://github.com/brandingbrand/flagship/commit/2c356ca))
* Make scrollToTop function public ([ced8b2f](https://github.com/brandingbrand/flagship/commit/ced8b2f))
* **fscomponents:** default show arrow on cms banner carousel story ([aa134e8](https://github.com/brandingbrand/flagship/commit/aa134e8))
* **fscomponents:** defend Selector against unsafe access ([e1f3654](https://github.com/brandingbrand/flagship/commit/e1f3654))
* **fscomponents:** fix android searchbar cancel ([3c9f282](https://github.com/brandingbrand/flagship/commit/3c9f282))
* **fscomponents:** fix review summary percent recommend ([7bf0e9d](https://github.com/brandingbrand/flagship/commit/7bf0e9d))
* **fscomponents:** Fix setting ReviewIndicator color ([108a0d1](https://github.com/brandingbrand/flagship/commit/108a0d1))
* **fscomponents:** make clear what is image and what is overlay ([165585d](https://github.com/brandingbrand/flagship/commit/165585d))
* **fscomponents:** remove outdated stylesheet on cmsfeedback component ([bab62c6](https://github.com/brandingbrand/flagship/commit/bab62c6))


### Features

* **fscomponents:**  add arrow knob to multicarousel storybook ([0b9cef9](https://github.com/brandingbrand/flagship/commit/0b9cef9))
* **fscomponents:** Allow turning off validate on blur ([4088712](https://github.com/brandingbrand/flagship/commit/4088712))
* **fscomponents:** increase customizability of search bar ([9fd5357](https://github.com/brandingbrand/flagship/commit/9fd5357))
* **fscomponents:** specify if searchbar input should clear after submit ([7a48cd3](https://github.com/brandingbrand/flagship/commit/7a48cd3))
* **fscomponents:** update how fieldsoptions are extended in addressform ([4ca8e46](https://github.com/brandingbrand/flagship/commit/4ca8e46))
* upgrade react native to 0.57.8 ([ab40ab1](https://github.com/brandingbrand/flagship/commit/ab40ab1))


### BREAKING CHANGES

* This upgrades RN to 0.57.8, React to 16.6.3, and other dependencies as necessary. Updates were made to the iOS and Android native templates according to RN's instructions.
* **fscomponents:** This changes how fieldsOptions in AddressForm is extended via props from assignment to merge. With the previous configuration, users would need to override the entire configuration for each field in order to simply add or modify one option. This change may lead to side effects in apps that already pass custom fieldsOptions to AddressForm.





# [3.0.0](https://github.com/brandingbrand/flagship/compare/v2.0.0...v3.0.0) (2019-02-22)


### Bug Fixes

* **fscomponents:** Allow partial reviewIndicatorProps to be passed ([2c356ca](https://github.com/brandingbrand/flagship/commit/2c356ca))
* Make scrollToTop function public ([ced8b2f](https://github.com/brandingbrand/flagship/commit/ced8b2f))
* **fscomponents:** default show arrow on cms banner carousel story ([aa134e8](https://github.com/brandingbrand/flagship/commit/aa134e8))
* **fscomponents:** defend Selector against unsafe access ([e1f3654](https://github.com/brandingbrand/flagship/commit/e1f3654))
* **fscomponents:** fix android searchbar cancel ([3c9f282](https://github.com/brandingbrand/flagship/commit/3c9f282))
* **fscomponents:** fix review summary percent recommend ([7bf0e9d](https://github.com/brandingbrand/flagship/commit/7bf0e9d))
* **fscomponents:** Fix setting ReviewIndicator color ([108a0d1](https://github.com/brandingbrand/flagship/commit/108a0d1))
* **fscomponents:** make clear what is image and what is overlay ([165585d](https://github.com/brandingbrand/flagship/commit/165585d))
* **fscomponents:** remove outdated stylesheet on cmsfeedback component ([bab62c6](https://github.com/brandingbrand/flagship/commit/bab62c6))


### Features

* **fscomponents:**  add arrow knob to multicarousel storybook ([0b9cef9](https://github.com/brandingbrand/flagship/commit/0b9cef9))
* **fscomponents:** Allow turning off validate on blur ([4088712](https://github.com/brandingbrand/flagship/commit/4088712))
* **fscomponents:** increase customizability of search bar ([9fd5357](https://github.com/brandingbrand/flagship/commit/9fd5357))
* **fscomponents:** specify if searchbar input should clear after submit ([7a48cd3](https://github.com/brandingbrand/flagship/commit/7a48cd3))
* **fscomponents:** update how fieldsoptions are extended in addressform ([4ca8e46](https://github.com/brandingbrand/flagship/commit/4ca8e46))
* upgrade react native to 0.57.8 ([ab40ab1](https://github.com/brandingbrand/flagship/commit/ab40ab1))


### BREAKING CHANGES

* This upgrades RN to 0.57.8, React to 16.6.3, and other dependencies as necessary. Updates were made to the iOS and Android native templates according to RN's instructions.
* **fscomponents:** This changes how fieldsOptions in AddressForm is extended via props from assignment to merge. With the previous configuration, users would need to override the entire configuration for each field in order to simply add or modify one option. This change may lead to side effects in apps that already pass custom fieldsOptions to AddressForm.





# [3.0.0](https://github.com/brandingbrand/flagship/compare/v2.0.0...v3.0.0) (2019-02-22)


### Bug Fixes

* **fscomponents:** Allow partial reviewIndicatorProps to be passed ([2c356ca](https://github.com/brandingbrand/flagship/commit/2c356ca))
* Make scrollToTop function public ([ced8b2f](https://github.com/brandingbrand/flagship/commit/ced8b2f))
* **fscomponents:** default show arrow on cms banner carousel story ([aa134e8](https://github.com/brandingbrand/flagship/commit/aa134e8))
* **fscomponents:** defend Selector against unsafe access ([e1f3654](https://github.com/brandingbrand/flagship/commit/e1f3654))
* **fscomponents:** fix android searchbar cancel ([3c9f282](https://github.com/brandingbrand/flagship/commit/3c9f282))
* **fscomponents:** fix review summary percent recommend ([7bf0e9d](https://github.com/brandingbrand/flagship/commit/7bf0e9d))
* **fscomponents:** Fix setting ReviewIndicator color ([108a0d1](https://github.com/brandingbrand/flagship/commit/108a0d1))
* **fscomponents:** make clear what is image and what is overlay ([165585d](https://github.com/brandingbrand/flagship/commit/165585d))
* **fscomponents:** remove outdated stylesheet on cmsfeedback component ([bab62c6](https://github.com/brandingbrand/flagship/commit/bab62c6))


### Features

* **fscomponents:**  add arrow knob to multicarousel storybook ([0b9cef9](https://github.com/brandingbrand/flagship/commit/0b9cef9))
* **fscomponents:** Allow turning off validate on blur ([4088712](https://github.com/brandingbrand/flagship/commit/4088712))
* **fscomponents:** increase customizability of search bar ([9fd5357](https://github.com/brandingbrand/flagship/commit/9fd5357))
* **fscomponents:** specify if searchbar input should clear after submit ([7a48cd3](https://github.com/brandingbrand/flagship/commit/7a48cd3))
* **fscomponents:** update how fieldsoptions are extended in addressform ([4ca8e46](https://github.com/brandingbrand/flagship/commit/4ca8e46))
* upgrade react native to 0.57.8 ([ab40ab1](https://github.com/brandingbrand/flagship/commit/ab40ab1))


### BREAKING CHANGES

* This upgrades RN to 0.57.8, React to 16.6.3, and other dependencies as necessary. Updates were made to the iOS and Android native templates according to RN's instructions.
* **fscomponents:** This changes how fieldsOptions in AddressForm is extended via props from assignment to merge. With the previous configuration, users would need to override the entire configuration for each field in order to simply add or modify one option. This change may lead to side effects in apps that already pass custom fieldsOptions to AddressForm.





# [3.0.0](https://github.com/brandingbrand/flagship/compare/v2.0.0...v3.0.0) (2019-02-22)


### Bug Fixes

* **fscomponents:** Allow partial reviewIndicatorProps to be passed ([2c356ca](https://github.com/brandingbrand/flagship/commit/2c356ca))
* Make scrollToTop function public ([ced8b2f](https://github.com/brandingbrand/flagship/commit/ced8b2f))
* **fscomponents:** default show arrow on cms banner carousel story ([aa134e8](https://github.com/brandingbrand/flagship/commit/aa134e8))
* **fscomponents:** defend Selector against unsafe access ([e1f3654](https://github.com/brandingbrand/flagship/commit/e1f3654))
* **fscomponents:** fix android searchbar cancel ([3c9f282](https://github.com/brandingbrand/flagship/commit/3c9f282))
* **fscomponents:** fix review summary percent recommend ([7bf0e9d](https://github.com/brandingbrand/flagship/commit/7bf0e9d))
* **fscomponents:** Fix setting ReviewIndicator color ([108a0d1](https://github.com/brandingbrand/flagship/commit/108a0d1))
* **fscomponents:** make clear what is image and what is overlay ([165585d](https://github.com/brandingbrand/flagship/commit/165585d))
* **fscomponents:** remove outdated stylesheet on cmsfeedback component ([bab62c6](https://github.com/brandingbrand/flagship/commit/bab62c6))


### Features

* **fscomponents:**  add arrow knob to multicarousel storybook ([0b9cef9](https://github.com/brandingbrand/flagship/commit/0b9cef9))
* **fscomponents:** Allow turning off validate on blur ([4088712](https://github.com/brandingbrand/flagship/commit/4088712))
* **fscomponents:** increase customizability of search bar ([9fd5357](https://github.com/brandingbrand/flagship/commit/9fd5357))
* **fscomponents:** specify if searchbar input should clear after submit ([7a48cd3](https://github.com/brandingbrand/flagship/commit/7a48cd3))
* **fscomponents:** update how fieldsoptions are extended in addressform ([4ca8e46](https://github.com/brandingbrand/flagship/commit/4ca8e46))
* upgrade react native to 0.57.8 ([ab40ab1](https://github.com/brandingbrand/flagship/commit/ab40ab1))


### BREAKING CHANGES

* This upgrades RN to 0.57.8, React to 16.6.3, and other dependencies as necessary. Updates were made to the iOS and Android native templates according to RN's instructions.
* **fscomponents:** This changes how fieldsOptions in AddressForm is extended via props from assignment to merge. With the previous configuration, users would need to override the entire configuration for each field in order to simply add or modify one option. This change may lead to side effects in apps that already pass custom fieldsOptions to AddressForm.





## [3.0.1-alpha.0](https://github.com/brandingbrand/flagship/compare/v3.0.0-alpha.0...v3.0.1-alpha.0) (2019-02-11)

**Note:** Version bump only for package @brandingbrand/fscomponents





# [3.0.0-alpha.0](https://github.com/brandingbrand/flagship/compare/v2.0.0...v3.0.0-alpha.0) (2019-02-08)


### Bug Fixes

* **fscomponents:** Allow partial reviewIndicatorProps to be passed ([2c356ca](https://github.com/brandingbrand/flagship/commit/2c356ca))
* **fscomponents:** defend Selector against unsafe access ([e1f3654](https://github.com/brandingbrand/flagship/commit/e1f3654))
* **fscomponents:** fix android searchbar cancel ([3c9f282](https://github.com/brandingbrand/flagship/commit/3c9f282))
* **fscomponents:** Fix setting ReviewIndicator color ([108a0d1](https://github.com/brandingbrand/flagship/commit/108a0d1))
* Make scrollToTop function public ([497c601](https://github.com/brandingbrand/flagship/commit/497c601))


### Features

* **fscomponents:** Allow turning off validate on blur ([4088712](https://github.com/brandingbrand/flagship/commit/4088712))
* **fscomponents:** specify if searchbar input should clear after submit ([8aaddba](https://github.com/brandingbrand/flagship/commit/8aaddba))
* **fscomponents:** update how fieldsoptions are extended in addressform ([4ca8e46](https://github.com/brandingbrand/flagship/commit/4ca8e46))
* upgrade react native to 0.57.8 ([77177b3](https://github.com/brandingbrand/flagship/commit/77177b3))


### BREAKING CHANGES

* This upgrades RN to 0.57.8, React to 16.6.3, and other dependencies as necessary. Updates were made to the iOS and Android native templates according to RN's instructions.
* **fscomponents:** This changes how fieldsOptions in AddressForm is extended via props from assignment to merge. With the previous configuration, users would need to override the entire configuration for each field in order to simply add or modify one option. This change may lead to side effects in apps that already pass custom fieldsOptions to AddressForm.





<a name="2.0.0"></a>
# 2.0.0 (2018-10-16)


### Bug Fixes

* **fscomponents:** add AddToCart determineVariant type ([9a00966](https://github.com/brandingbrand/flagship/commit/9a00966))
* **fscomponents:** add onChangeOption variant type ([fad0a27](https://github.com/brandingbrand/flagship/commit/fad0a27))
* **fscomponents:** Add truthy check to review text before rendering ([5ee6528](https://github.com/brandingbrand/flagship/commit/5ee6528))
* **fscomponents:** add type to AddToCart buttonProps ([6db4b83](https://github.com/brandingbrand/flagship/commit/6db4b83))
* **fscomponents:** add type to AddToCart stepperProps ([eec415a](https://github.com/brandingbrand/flagship/commit/eec415a))
* **fscomponents:** add type to AddToCart swatchesProps ([331c05e](https://github.com/brandingbrand/flagship/commit/331c05e))
* **fscomponents:** add typing to memoize one and func parameters ([02d98e3](https://github.com/brandingbrand/flagship/commit/02d98e3))
* **fscomponents:** fix auto-generated imports ([6433385](https://github.com/brandingbrand/flagship/commit/6433385))
* **fscomponents:** Fix invalid css that was causing errors ([3a450a5](https://github.com/brandingbrand/flagship/commit/3a450a5))
* **fscomponents:** Fix invalid TextInput style prop for native platforms ([9426f89](https://github.com/brandingbrand/flagship/commit/9426f89))
* **fscomponents:** Fix PromoForm props ([5809ff5](https://github.com/brandingbrand/flagship/commit/5809ff5))
* **fscomponents:** fix review stars being cut off ([3256171](https://github.com/brandingbrand/flagship/commit/3256171))
* **fscomponents:** Format review rating number output ([837469b](https://github.com/brandingbrand/flagship/commit/837469b))
* **fscomponents:** Implement button disabling ([83b6f01](https://github.com/brandingbrand/flagship/commit/83b6f01))
* **fscomponents:** make button contents flex row ([808ad2a](https://github.com/brandingbrand/flagship/commit/808ad2a))
* **fscomponents:** make grid column & row separators visible ([a564fd2](https://github.com/brandingbrand/flagship/commit/a564fd2))
* **fscomponents:** rename showImage & showAccessory props ([f546f31](https://github.com/brandingbrand/flagship/commit/f546f31))
* **fscomponents:** Update Reviews to use the actual Review type props ([e6a5d4d](https://github.com/brandingbrand/flagship/commit/e6a5d4d))
* **fscomponents:** use undefined as Swatches defaultValue ([159c4a6](https://github.com/brandingbrand/flagship/commit/159c4a6))
* **pirateship:** Add "View All" link next to Shop All Categories text ([8c03233](https://github.com/brandingbrand/flagship/commit/8c03233))
* **pirateship:** add category arrows to category screens ([bc7219c](https://github.com/brandingbrand/flagship/commit/bc7219c))
* **pirateship:** change checkout button text color ([943fe17](https://github.com/brandingbrand/flagship/commit/943fe17))
* update memoize-one to version 4.0.2 ([3bf49fb](https://github.com/brandingbrand/flagship/commit/3bf49fb)), closes [#189](https://github.com/brandingbrand/flagship/issues/189)
* update react-native-svg to version 7.0.2 ([0ee6775](https://github.com/brandingbrand/flagship/commit/0ee6775)), closes [#207](https://github.com/brandingbrand/flagship/issues/207)
* **pirateship:** fix undefined variable error on product grid ([7182086](https://github.com/brandingbrand/flagship/commit/7182086))
* **pirateship:** fixes [#130](https://github.com/brandingbrand/flagship/issues/130) text color on shop screen ([230cbfe](https://github.com/brandingbrand/flagship/commit/230cbfe))
* **pirateship:** fixes boolean label prop ([03d713b](https://github.com/brandingbrand/flagship/commit/03d713b))
* **pirateship:** fixes selected swatch labels ([17c8fe6](https://github.com/brandingbrand/flagship/commit/17c8fe6))


### Features

* implemented svg nav arrow component ([7f49f4e](https://github.com/brandingbrand/flagship/commit/7f49f4e))
* **fscomponents:** add form label position prop to descendent forms ([08ccbb7](https://github.com/brandingbrand/flagship/commit/08ccbb7))
* inital commit ([039a84f](https://github.com/brandingbrand/flagship/commit/039a84f))
* **fscomponents:** Add configurable PayPal button ([adccb56](https://github.com/brandingbrand/flagship/commit/adccb56))
* **fscomponents:** add custom disclosure icon option to accordion ([8ce3cc7](https://github.com/brandingbrand/flagship/commit/8ce3cc7))
* **fscomponents:** Add right icon/button support to search bar ([e326bce](https://github.com/brandingbrand/flagship/commit/e326bce))
* **fscomponents:** add textbox field status ([0852517](https://github.com/brandingbrand/flagship/commit/0852517))
* **fscomponents:** allow clearButtonMode in SearchBar ([d9a5600](https://github.com/brandingbrand/flagship/commit/d9a5600))
* **fscomponents:** allow custom heights to half modal ([a0872f5](https://github.com/brandingbrand/flagship/commit/a0872f5))
* **fscomponents:** make field templates w label positions ([692093f](https://github.com/brandingbrand/flagship/commit/692093f))
* **fscomponents:** refactor ProductItem component to be option based ([9eb16ef](https://github.com/brandingbrand/flagship/commit/9eb16ef))


### BREAKING CHANGES

* **fscomponents:** iconFormat property has new option name “arrow” which corresponds to what was previously “image”. “image” is now the property name which designates custom disclosure icon option. default is still “plusminus”.
* **fscomponents:** ReviewItem/ReviewList props have changed
* **fscomponents:** Individual ProductItemVertical, etc... components no longer exist
* **fscomponents:** Button props have been updated to match theme
Add theme to fscomponents
