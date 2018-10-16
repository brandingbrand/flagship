# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
