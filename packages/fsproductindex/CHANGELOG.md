# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/brandingbrand/flagship/compare/v3.0.1-alpha.0...v3.0.0) (2019-02-14)

**Note:** Version bump only for package @brandingbrand/fsproductindex





## [3.0.1-alpha.0](https://github.com/brandingbrand/flagship/compare/v3.0.0-alpha.0...v3.0.1-alpha.0) (2019-02-11)

**Note:** Version bump only for package @brandingbrand/fsproductindex





# [3.0.0-alpha.0](https://github.com/brandingbrand/flagship/compare/v2.0.0...v3.0.0-alpha.0) (2019-02-08)


### Features

* upgrade react native to 0.57.8 ([77177b3](https://github.com/brandingbrand/flagship/commit/77177b3))


### BREAKING CHANGES

* This upgrades RN to 0.57.8, React to 16.6.3, and other dependencies as necessary. Updates were made to the iOS and Android native templates according to RN's instructions.





<a name="2.0.0"></a>
# 2.0.0 (2018-10-16)


### Bug Fixes

* **fsproductindex:** Fix commerceData errors ([f483bd8](https://github.com/brandingbrand/flagship/commit/f483bd8))
* **fsproductindex:** Fix infinite loop of requesting reviews ([a8f0128](https://github.com/brandingbrand/flagship/commit/a8f0128))
* **pirateship:** don't error on filter modal if no filters ([45d13b9](https://github.com/brandingbrand/flagship/commit/45d13b9))


### Code Refactoring

* Remove ReviewsProvider ([4b5794b](https://github.com/brandingbrand/flagship/commit/4b5794b))


### Features

* inital commit ([039a84f](https://github.com/brandingbrand/flagship/commit/039a84f))
* **fscomponents:** refactor ProductItem component to be option based ([9eb16ef](https://github.com/brandingbrand/flagship/commit/9eb16ef))


### BREAKING CHANGES

* Removed withReviewData HOC, removed second parameter from withProductDetailData/withProductIndexData
* **fscomponents:** Individual ProductItemVertical, etc... components no longer exist
* **fscomponents:** Button props have been updated to match theme
Add theme to fscomponents
