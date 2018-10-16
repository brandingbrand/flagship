# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
