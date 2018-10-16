# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
