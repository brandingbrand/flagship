# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/brandingbrand/flagship/compare/v3.0.1-alpha.0...v3.0.0) (2019-02-14)

**Note:** Version bump only for package @brandingbrand/fsengage





## [3.0.1-alpha.0](https://github.com/brandingbrand/flagship/compare/v3.0.0-alpha.0...v3.0.1-alpha.0) (2019-02-11)


### Bug Fixes

* **fsengage:** fix leanplum typings for storybook ([0fb4ff1](https://github.com/brandingbrand/flagship/commit/0fb4ff1))





# [3.0.0-alpha.0](https://github.com/brandingbrand/flagship/compare/v2.0.0...v3.0.0-alpha.0) (2019-02-08)


### Bug Fixes

* **fsengage:** Fix product serialization for Adobe Analytics ([9e4371b](https://github.com/brandingbrand/flagship/commit/9e4371b))


### Features

* **fsengage:** Allow arbitrary data in event interfaces ([30ab842](https://github.com/brandingbrand/flagship/commit/30ab842))
* **fsengage:** Implement an adapter for Adobe Analytics ([715d0ff](https://github.com/brandingbrand/flagship/commit/715d0ff))
* upgrade react native to 0.57.8 ([77177b3](https://github.com/brandingbrand/flagship/commit/77177b3))


### BREAKING CHANGES

* This upgrades RN to 0.57.8, React to 16.6.3, and other dependencies as necessary. Updates were made to the iOS and Android native templates according to RN's instructions.





<a name="2.0.0"></a>
# 2.0.0 (2018-10-16)


### Bug Fixes

* **fsengage:** Fix incorrect url-parse import ([3c023cb](https://github.com/brandingbrand/flagship/commit/3c023cb))
* **fsengage:** match variable names to GA variables ([83aba47](https://github.com/brandingbrand/flagship/commit/83aba47))
* update [@brandingbrand](https://github.com/brandingbrand)/react-native-leanplum to version 1.0.1 ([481a775](https://github.com/brandingbrand/flagship/commit/481a775)), closes [#224](https://github.com/brandingbrand/flagship/issues/224)


### Features

* inital commit ([039a84f](https://github.com/brandingbrand/flagship/commit/039a84f))


### BREAKING CHANGES

* **fsengage:** renamed group & subgroup properties to “eventAction” and “eventCategory”   & matched them to their GA event property analogues, effectively switching the values sent to GA.

ex:
`        Analytics.click.generic('Checkout', {
          identifier: 'Cart',
          name: 'Cart'
       });
`

previously sent ‘Checkout’ as a GA event action & ‘Click’ as GA event category
now ‘Checkout’ is sent as GA event category & ‘Click’ as GA event action
