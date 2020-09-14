<p align="center">
  <a href="https://brandingbrand.github.io/flagship/">
    <img alt="Flagship"
      src="https://user-images.githubusercontent.com/556070/39432976-bd8520f4-4c62-11e8-863b-fe7ee694a4a0.png"
      height="250">
  </a>
</p>

<p align="center">
  A tool for building your best shopping app
</p>

<p align="center">
  <a href="https://travis-ci.org/brandingbrand/flagship">
    <img alt="Travis Status"
      src="https://travis-ci.org/brandingbrand/flagship.svg?branch=master">
  </a>
  <a href="https://greenkeeper.io/">
    <img alt="Greenkeeper"
      src="https://badges.greenkeeper.io/brandingbrand/flagship.svg?ts=1523929763709">
  </a>
  <a href="https://lernajs.io/">
    <img alt="Lerna"
      src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg">
  </a>
</p>

# Flagship

* [About](#about)
* [How It Works](#how-it-works)
  * [Platforms](#platforms)
* [Troubleshooting](#troubleshooting)
* [Commands](#commands)
  * [`flagship init`](#init)
  * [`flagship clean`](#clean)
  * [`flagship env`](#env)
* [Packages](#packages)

**:computer: Check out our [Wiki](https://github.com/brandingbrand/flagship/wiki) for developer documentation!**

## About Flagship

<img alt="Flagship accelerates development"
  src="https://user-images.githubusercontent.com/556070/38955661-4ff210c6-4323-11e8-960e-b568bc4b2bec.png"
  align="right">

Flagship accelerates development of the best omnichannel commerce experiences by providing a library
of pre-built components and integrations. That way, you can focus more on innovations that matter.

Flagship helps you to:

* Build sites _and_ apps in a singular codebase using components based on proven best practices
* Connect commerce APIs automatically using our API adapters
* Manage personalized engagement campaigns using the tools you already use or ours

It's written in React Native and developed by [Branding Brand](https://www.brandingbrand.com/).

## How It Works

<img alt="Building with Flagship"
  src="https://user-images.githubusercontent.com/556070/38953855-09901dc6-431e-11e8-9e50-26cb694c91e2.png"
  align="left">

Flagship is comprised of a core `flagship` package and a number of ancillary modules which work
together to help you build an ecommerce experience.

You can use modules independently — with or without the `flagship` core package. For example,
[`fsproductindex`](packages/fsproductindex) displays a product index which you can use as a screen
or embed as part of a larger screen. See [packages](#packages) for an exhaustive list of modules.

Flagship core manages the boilerplate Android, iOS, and web code, similar in concept to
[Expo](https://expo.io). For a more detailed exploration of the features of Flagship, see the
[`flagship` package](packages/flagship).

<img alt="Flagship foundation architecture diagram"
  src="https://user-images.githubusercontent.com/2915629/68430966-26b39880-017f-11ea-880c-10a6466c8d3b.png"
  align="right">

Modules are built using a shared stack of foundation packages which provide a unified interface for
networking, analytics, commerce integrations, components, and more across each of our
[supported platforms](#platforms). Higher-level modules do not need to implement platform-specific
code.

Foundation packages provide a normalization over their integrations. For example,
[`fscommerce`](packages/fscommerce) provides a single interface to query both
[Demandware](https://www.demandware.com) and [Shopify](https://www.shopify.com). The higher-level
[`fsproductindex`](packages/fsproductindex) module doesn't need to know what the data source is to
display a grid of products.

These foundation packages are built on top of one another. For example,
[`fscomponents`](packages/fscomponents) has props that inherit from
[`fscommerce`](packages/fscommerce); [`fscommerce`](packages/fscommerce) sends analytics using
[`fsengage`](packages/fsengage); and [`fsengage`](packages/fsengage) talks to the network using
[`fsnetwork`](packages/fsnetwork).

### Foundation

Flagship's foundation is comprised of:

| Name | Responsibility |
| ---- | ---- |
| [`fscomponents`](packages/fscomponents) | reusable, cross-platform frontend components |
| [`fscommerce`](packages/fscommerce) | product catalog, search, order and user account management, and reviews |
| [`fsengage`](packages/fsengage) | analytics, content management, and A/B testing |
| [`fsnetwork`](packages/fsnetwork) | networking and caching |
| [`fsfoundation`](packages/fsfoundation) | baseline types used by other Flagship packages |

### Platforms

Supported platforms are:

* `android`
* `ios`
* `native` (both iOS and Android)
* `web`

## Troubleshooting

<img alt="Troubleshooting Flagship"
  src="https://user-images.githubusercontent.com/556070/38958560-9f7aab28-432b-11e8-8e67-68d781f5681d.png"
  align="left">

If you encounter issues while using Flagship, please check out our
[Troubleshooting](troubleshooting.md) guide where you might find the answer to your problem. If you
encounter something that is not listed there,
[try searching for the issue in GitHub](https://github.com/brandingbrand/flagship/issues).

We want your feedback! Please [open a new issue](https://github.com/brandingbrand/flagship/issues/new)
to report a bug or request a new feature.

Need more help? [Contact us](mailto:product@brandingbrand.com).

## Commands

### init

```sh
flagship init [platform] [options]
```

Copies and configures the native project for the given platform. If you don't specify a platform,
_all_ platforms will be initialized. See [Platforms](#platforms).

#### Options

| Option | Alias | Description |
| ---- | ---- | ---- |
| `--env` | `-e` | The name of the environment to build. Defaults to `prod`. See [Environments](#environments) |

### clean

```sh
flagship clean [platform]
```

Removes build and installation artifacts for the given platform. If you don't specify a platform,
build artifacts for _all_ platforms will be removed.  See [Platforms](#platforms).

### env

```sh
flagship env
```

Generates the environment index file. Use this if you've added a new environment since the last time
you ran `flagship init`. See [Environments](#environments).

## Packages

* [flagship](packages/flagship): a toolchain for Android, iOS, and web apps
* [fsapp](packages/fsapp): a management utility for [react-native-navigation](https://github.com/wix/react-native-navigation)
* [fsweb](packages/fsweb): a bootstrap package to run Flagship on the web

### Foundation Packages

* [fsfoundation](packages/fsfoundation): baseline types used by other Flagship packages
* [fsi18n](packages/fsi18n): internationalization and localizaiton
* [fsnetwork](packages/fsnetwork): networking and caching

### Engagement Packages

* [fsengage](packages/fsengage): analytics, content management, and A/B testing

### Commerce Packages

* [fscommerce](packages/fscommerce): product catalog, search, order and user account management, and
  reviews

### User Interface Packages

* [fscomponents](packages/fscomponents): reusable, cross-platform frontend components
* [fscart](packages/fscart): components for a cart
* [fscategory](packages/fscategory): components for a category index
* [fscheckout](packages/fscheckout): a state machine for managing checkout flow
* [fslocator](packages/fslocator): a configurable point of interest locator
* [fsproductdetail](packages/fsproductdetail): components for product detail pages
* [fsproductindex](packages/fsproductindex): components for a product index

### Utility Packages

* [fscodestyle](packages/fscodestyle): a coding style used throughout Flagship

### Example Projects

* [fstestproject](packages/fstestproject): a test project built using Flagship
* [pirateship](packages/pirateship): an example app built using Flagship
