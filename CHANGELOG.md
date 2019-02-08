# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
* **fsapp:** Don't navigate when switching envs ([987931a](https://github.com/brandingbrand/flagship/commit/987931a))
* **fsapp:** Don't use modals for dev menu on web ([742d478](https://github.com/brandingbrand/flagship/commit/742d478))
* **fsapp:** Fix parsing of query string passprops ([c0ceb59](https://github.com/brandingbrand/flagship/commit/c0ceb59))
* **fsbazaarvoice:** add BazaarvoiceReviewRequest ([b606797](https://github.com/brandingbrand/flagship/commit/b606797))
* **fsbazaarvoice:** Fix serialization of review ids in request ([f8fd92f](https://github.com/brandingbrand/flagship/commit/f8fd92f))
* **fsbazaarvoice:** Fix user data structure to match ReviewUser ([62eb71e](https://github.com/brandingbrand/flagship/commit/62eb71e))
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
* **fsengage:** Fix incorrect url-parse import ([3c023cb](https://github.com/brandingbrand/flagship/commit/3c023cb))
* **fsengage:** match variable names to GA variables ([83aba47](https://github.com/brandingbrand/flagship/commit/83aba47))
* **fslocator:** update types location in package.json ([d53bf42](https://github.com/brandingbrand/flagship/commit/d53bf42))
* **fsmockdatasources:** Add default category id if one is not provided ([0fa0fba](https://github.com/brandingbrand/flagship/commit/0fa0fba))
* **fsmockdatasources:** Fix handling of refinements ([3d30872](https://github.com/brandingbrand/flagship/commit/3d30872))
* **fsmockdatasources:** Fix pagination ([0874d73](https://github.com/brandingbrand/flagship/commit/0874d73))
* **fsmockdatasources:** Import from file rather than index ([9d47736](https://github.com/brandingbrand/flagship/commit/9d47736))
* **fsmockdatasources:** Recursively search categories for match ([442ed60](https://github.com/brandingbrand/flagship/commit/442ed60))
* **fsproductindex:** Fix commerceData errors ([f483bd8](https://github.com/brandingbrand/flagship/commit/f483bd8))
* **fsproductindex:** Fix infinite loop of requesting reviews ([a8f0128](https://github.com/brandingbrand/flagship/commit/a8f0128))
* **fssalesforce:** fix cart metadata being lost in update cart calls ([9fdfcea](https://github.com/brandingbrand/flagship/commit/9fdfcea))
* **fsshopify:** Add missing constructor and fix some types ([409f7e9](https://github.com/brandingbrand/flagship/commit/409f7e9))
* **fsshopify:** Fix react native link hanging ([be87dd0](https://github.com/brandingbrand/flagship/commit/be87dd0))
* **fsshopify:** fix shopifydatasource test ([9b3f5f4](https://github.com/brandingbrand/flagship/commit/9b3f5f4))
* **fsshopify:** Make fsshopify work on web ([049cae7](https://github.com/brandingbrand/flagship/commit/049cae7))
* **fstestproject:** Fix rendering of long content in the Data View ([bbd56b4](https://github.com/brandingbrand/flagship/commit/bbd56b4))
* **fsweb:** Fix deep linking in development ([598db34](https://github.com/brandingbrand/flagship/commit/598db34))
* **fsweb:** Fix js error in fsweb index page ([4ec5751](https://github.com/brandingbrand/flagship/commit/4ec5751))
* **fsweb:** Handle SVGs for web ([72c610d](https://github.com/brandingbrand/flagship/commit/72c610d))
* **pirateship:** Add "View All" link next to Shop All Categories text ([8c03233](https://github.com/brandingbrand/flagship/commit/8c03233))
* update style-loader to version 0.23.0 ([63325f6](https://github.com/brandingbrand/flagship/commit/63325f6))
* **pirateship:** add category arrows to category screens ([bc7219c](https://github.com/brandingbrand/flagship/commit/bc7219c))
* **pirateship:** change checkout button text color ([943fe17](https://github.com/brandingbrand/flagship/commit/943fe17))
* **pirateship:** change searchbar placeholder text ([41b456f](https://github.com/brandingbrand/flagship/commit/41b456f))
* **pirateship:** change shop top categories button ([e7dc743](https://github.com/brandingbrand/flagship/commit/e7dc743))
* **pirateship:** clean up demandware product descriptions ([4c834b5](https://github.com/brandingbrand/flagship/commit/4c834b5))
* **pirateship:** disable strict version checking for google services ([b5f6b79](https://github.com/brandingbrand/flagship/commit/b5f6b79))
* **pirateship:** don't error on filter modal if no filters ([45d13b9](https://github.com/brandingbrand/flagship/commit/45d13b9))
* **pirateship:** Don't pass review datasource to screen as a prop ([92e88d6](https://github.com/brandingbrand/flagship/commit/92e88d6))
* **pirateship:** fix checkoutButton color to palette accent yellow ([a232371](https://github.com/brandingbrand/flagship/commit/a232371))
* **pirateship:** fix color of cart total line to primary green ([93ebd49](https://github.com/brandingbrand/flagship/commit/93ebd49))
* **pirateship:** fix continue shopping button for web ([2370784](https://github.com/brandingbrand/flagship/commit/2370784))
* **pirateship:** Fix demo web app build script ([21c2f4f](https://github.com/brandingbrand/flagship/commit/21c2f4f))
* **pirateship:** Fix handling of variants from Mock DS on PDPs ([0b0d81f](https://github.com/brandingbrand/flagship/commit/0b0d81f))
* **pirateship:** fix quantity padding on product detail ([a00ee2a](https://github.com/brandingbrand/flagship/commit/a00ee2a))
* **pirateship:** Fix scrolling on web ([5f599f3](https://github.com/brandingbrand/flagship/commit/5f599f3))
* **pirateship:** fix shopify all categories page header ([e160e16](https://github.com/brandingbrand/flagship/commit/e160e16))
* **pirateship:** fix undefined variable error on product grid ([7182086](https://github.com/brandingbrand/flagship/commit/7182086))
* **pirateship:** fix view all alignment & green color on touch ([810c5dc](https://github.com/brandingbrand/flagship/commit/810c5dc))
* **pirateship:** fixes [#130](https://github.com/brandingbrand/flagship/issues/130) text color on shop screen ([230cbfe](https://github.com/brandingbrand/flagship/commit/230cbfe))
* **pirateship:** fixes boolean label prop ([03d713b](https://github.com/brandingbrand/flagship/commit/03d713b))
* **pirateship:** fixes empty cart signin button to secondary dark gray ([709ef37](https://github.com/brandingbrand/flagship/commit/709ef37))
* **pirateship:** fixes empty cart text color to secondary dark gray ([53dc226](https://github.com/brandingbrand/flagship/commit/53dc226))
* **pirateship:** fixes empty cart title color to secondary dark gray ([7ba6a94](https://github.com/brandingbrand/flagship/commit/7ba6a94))
* **pirateship:** fixes selected swatch labels ([17c8fe6](https://github.com/brandingbrand/flagship/commit/17c8fe6))
* **pirateship:** hide hidden categories for commercecloud ([b2a2bfc](https://github.com/brandingbrand/flagship/commit/b2a2bfc))
* **pirateship:** make text color of cart sign in button white ([a677e08](https://github.com/brandingbrand/flagship/commit/a677e08))
* **pirateship:** refactor recentlyViewedProvider ([0880a1b](https://github.com/brandingbrand/flagship/commit/0880a1b))
* **pirateship:** remove direct color definitions ([aedcb75](https://github.com/brandingbrand/flagship/commit/aedcb75))
* **pirateship:** remove old react-native-navigation version ([41e794f](https://github.com/brandingbrand/flagship/commit/41e794f))
* **pirateship:** update android firebase init script ([c754ad3](https://github.com/brandingbrand/flagship/commit/c754ad3))
* **pirateship:** update cart badge icon ([8195ad2](https://github.com/brandingbrand/flagship/commit/8195ad2))
* **pirateship:** update pirateship sign in form ([73676d2](https://github.com/brandingbrand/flagship/commit/73676d2))
*  Define property googlePlayServicesVersion ([da0f2d1](https://github.com/brandingbrand/flagship/commit/da0f2d1))
* attempt to fix greenkeeper-lockfile ci issues ([3f838cc](https://github.com/brandingbrand/flagship/commit/3f838cc))
* Fix react-native link hanging when initializing ([e00d47b](https://github.com/brandingbrand/flagship/commit/e00d47b))
* **pirateship:** use theme variables where appropriate ([f2e2b1e](https://github.com/brandingbrand/flagship/commit/f2e2b1e))
* Fix react-native-navigation version ([8cc8368](https://github.com/brandingbrand/flagship/commit/8cc8368))
* Get support libs from maven ([18acd09](https://github.com/brandingbrand/flagship/commit/18acd09))
* revert changes to link.ts script ([0b0dd15](https://github.com/brandingbrand/flagship/commit/0b0dd15))
* update [@brandingbrand](https://github.com/brandingbrand)/react-native-leanplum to version 1.0.1 ([74b8b7f](https://github.com/brandingbrand/flagship/commit/74b8b7f)), closes [#224](https://github.com/brandingbrand/flagship/issues/224)
* update [@brandingbrand](https://github.com/brandingbrand)/react-native-leanplum to version 1.0.1 ([481a775](https://github.com/brandingbrand/flagship/commit/481a775)), closes [#224](https://github.com/brandingbrand/flagship/issues/224)
* update autoprefixer to version 9.1.5 ([a96082b](https://github.com/brandingbrand/flagship/commit/a96082b)), closes [#62](https://github.com/brandingbrand/flagship/issues/62)
* update css-loader to version 1.0.0 ([0f20dbf](https://github.com/brandingbrand/flagship/commit/0f20dbf)), closes [#27](https://github.com/brandingbrand/flagship/issues/27) [#69](https://github.com/brandingbrand/flagship/issues/69) [#145](https://github.com/brandingbrand/flagship/issues/145)
* update fs-extra to version 7.0.0 ([cd1cfac](https://github.com/brandingbrand/flagship/commit/cd1cfac))
* update memoize-one to version 4.0.2 ([3bf49fb](https://github.com/brandingbrand/flagship/commit/3bf49fb)), closes [#189](https://github.com/brandingbrand/flagship/issues/189)
* **pirateship:** update shop tab icon with transparency ([ea7666b](https://github.com/brandingbrand/flagship/commit/ea7666b))
* update react-native-htmlview to version 0.13.0 ([f33a6b0](https://github.com/brandingbrand/flagship/commit/f33a6b0))
* update react-native-restart to version 0.0.7 ([688cee0](https://github.com/brandingbrand/flagship/commit/688cee0))
* update react-native-safe-area to version 0.5.0 ([27bb3bd](https://github.com/brandingbrand/flagship/commit/27bb3bd))
* update react-native-svg to version 7.0.2 ([0ee6775](https://github.com/brandingbrand/flagship/commit/0ee6775)), closes [#207](https://github.com/brandingbrand/flagship/issues/207)
* update react-native-svg to version 7.0.2 ([8f86677](https://github.com/brandingbrand/flagship/commit/8f86677)), closes [#207](https://github.com/brandingbrand/flagship/issues/207)
* update react-native-svg to version 7.0.2 ([2d0d6be](https://github.com/brandingbrand/flagship/commit/2d0d6be)), closes [#207](https://github.com/brandingbrand/flagship/issues/207)
* update react-native-web-image-loader to version 0.0.6 ([414d45f](https://github.com/brandingbrand/flagship/commit/414d45f))
* update style-loader to version 0.22.1 ([d2eafc2](https://github.com/brandingbrand/flagship/commit/d2eafc2)), closes [#134](https://github.com/brandingbrand/flagship/issues/134)


### Code Refactoring

* Remove ReviewsProvider ([4b5794b](https://github.com/brandingbrand/flagship/commit/4b5794b))


### Features

* Add flags for setting env/dev when using webpack ([1db13cb](https://github.com/brandingbrand/flagship/commit/1db13cb))
* implemented svg nav arrow component ([7f49f4e](https://github.com/brandingbrand/flagship/commit/7f49f4e))
* **fstestproject:** Add mock review data source to test project ([8e3eb4f](https://github.com/brandingbrand/flagship/commit/8e3eb4f))
* inital commit ([039a84f](https://github.com/brandingbrand/flagship/commit/039a84f))
* **fscomponents:** make field templates w label positions ([692093f](https://github.com/brandingbrand/flagship/commit/692093f))
* switch to combined versioned releases ([b72762d](https://github.com/brandingbrand/flagship/commit/b72762d))
* **pirateship:** implemented promo products on landing screen ([3971d89](https://github.com/brandingbrand/flagship/commit/3971d89))
* Update Android JavaScriptCore ([47bc20f](https://github.com/brandingbrand/flagship/commit/47bc20f))
* **flagship:** add firebase plist placeholder to xcode project ([68b84b5](https://github.com/brandingbrand/flagship/commit/68b84b5))
* **flagship:** add module install script for react-native-firebase ([20a2b2e](https://github.com/brandingbrand/flagship/commit/20a2b2e))
* **flagship:** add targeted device prop to ios config ([3f287a0](https://github.com/brandingbrand/flagship/commit/3f287a0))
* **fsapp:** Add environment switcher for web ([50d491f](https://github.com/brandingbrand/flagship/commit/50d491f))
* **fscomponents:** Add configurable PayPal button ([adccb56](https://github.com/brandingbrand/flagship/commit/adccb56))
* **fscomponents:** add custom disclosure icon option to accordion ([8ce3cc7](https://github.com/brandingbrand/flagship/commit/8ce3cc7))
* **fscomponents:** add form label position prop to descendent forms ([08ccbb7](https://github.com/brandingbrand/flagship/commit/08ccbb7))
* **fscomponents:** Add right icon/button support to search bar ([e326bce](https://github.com/brandingbrand/flagship/commit/e326bce))
* **fscomponents:** add textbox field status ([0852517](https://github.com/brandingbrand/flagship/commit/0852517))
* **fscomponents:** allow clearButtonMode in SearchBar ([d9a5600](https://github.com/brandingbrand/flagship/commit/d9a5600))
* **fscomponents:** allow custom heights to half modal ([a0872f5](https://github.com/brandingbrand/flagship/commit/a0872f5))
* **fscomponents:** refactor ProductItem component to be option based ([9eb16ef](https://github.com/brandingbrand/flagship/commit/9eb16ef))
* **fsmockdatasources:** Add commerce mock data source ([8a7ae86](https://github.com/brandingbrand/flagship/commit/8a7ae86))
* **fsmockdatasources:** Implement mock review data source ([77a7a3b](https://github.com/brandingbrand/flagship/commit/77a7a3b))
* **fstestproject:** Add commerce mock data source to testproject ([175e14b](https://github.com/brandingbrand/flagship/commit/175e14b))
* **pirateship:** add fastlane build of pirateship into builds ([a834caa](https://github.com/brandingbrand/flagship/commit/a834caa))
* **pirateship:** add flagship logo to shop screen ([2383e1a](https://github.com/brandingbrand/flagship/commit/2383e1a))
* **pirateship:** Add header/drawer for web ([958db4a](https://github.com/brandingbrand/flagship/commit/958db4a))
* **pirateship:** Add mock commerce data source to pirateship ([ff4a0ad](https://github.com/brandingbrand/flagship/commit/ff4a0ad))
* **pirateship:** Add mock review data source to pirateship ([b4a85e8](https://github.com/brandingbrand/flagship/commit/b4a85e8))
* upgrade target Android SDK to 27 ([11865f5](https://github.com/brandingbrand/flagship/commit/11865f5))
* **pirateship:** add separate shopify and demandware envs ([8cbd65a](https://github.com/brandingbrand/flagship/commit/8cbd65a))
* **pirateship:** Enable building of demo web app for docs ([3bfde09](https://github.com/brandingbrand/flagship/commit/3bfde09))
* **pirateship:** Enable web ([95583dd](https://github.com/brandingbrand/flagship/commit/95583dd))
* **pirateship:** implement shopify data source ([33643ce](https://github.com/brandingbrand/flagship/commit/33643ce))
* **pirateship:** Pass navigator to PSScreenWrapper ([8fd0a0b](https://github.com/brandingbrand/flagship/commit/8fd0a0b))
* **pirateship:** redesigned sort and filter menu ([bd11590](https://github.com/brandingbrand/flagship/commit/bd11590))


### BREAKING CHANGES

* **fscomponents:** iconFormat property has new option name “arrow” which corresponds to what was previously “image”. “image” is now the property name which designates custom disclosure icon option. default is still “plusminus”.
* **fscomponents:** ReviewItem/ReviewList props have changed
* Removed withReviewData HOC, removed second parameter from withProductDetailData/withProductIndexData
* **fsengage:** renamed group & subgroup properties to “eventAction” and “eventCategory”   & matched them to their GA event property analogues, effectively switching the values sent to GA.

ex:
`        Analytics.click.generic('Checkout', {
          identifier: 'Cart',
          name: 'Cart'
       });
`

previously sent ‘Checkout’ as a GA event action & ‘Click’ as GA event category
now ‘Checkout’ is sent as GA event category & ‘Click’ as GA event action
* **fscomponents:** Individual ProductItemVertical, etc... components no longer exist
* **fscomponents:** Button props have been updated to match theme
Add theme to fscomponents
* **pirateship:** labels in fscomponent form component are now inline by default and  default stylesheet is now the modified one found in the fscomponents/src/components/Form/Templates folder
