<h1 align="center">
  <a href="https://brandingbrand.github.io/flagship/">
    <img alt="Flagship"
      src="https://user-images.githubusercontent.com/2915629/127563134-be64905e-d429-446d-9a53-a657c9613f6f.png"
      height="100">
  </a>
</h1>

<p align="center">
  A framework for building your best shopping app
</p>

# Flagship

## About Flagship

<img alt="Flagship accelerates development"
  src="https://user-images.githubusercontent.com/556070/38955661-4ff210c6-4323-11e8-960e-b568bc4b2bec.png"
  align="right">

Flagship accelerates development of the best omnichannel commerce experiences
by providing a full solution framework with routing solutions, components and
integrations. In short, it enables you to focus more on innovations that matter.

Flagship helps you to:

- Build progress web apps _and_ native apps in a singular codebase using
  components based on proven best practices
- Connect commerce APIs automatically using our API adapters
- Manage personalized engagement campaigns using the tools you already use or
  ours

It's written in TypeScript, and currently supports React Native.

## How It Works

<img alt="Building with Flagship"
  src="https://user-images.githubusercontent.com/556070/38953855-09901dc6-431e-11e8-9e50-26cb694c91e2.png"
  align="left">

Flagship is comprised of a core `flagship` Nx plugin and a number of
ancillary modules. These work together to help you build an ecommerce
experience.

You can use modules independently — with or without the `flagship` core
package. For example, [`fsproductindex`](packages/fsproductindex) displays a
product index which you can use as a screen or embed as part of a larger
screen.

Flagship core manages the boilerplate Android, iOS, and web code, similar in
concept to [Expo](https://expo.io). For a more detailed exploration of the
features of Flagship, see the [`flagship` package](libs/flagship).

<img alt="Flagship foundation architecture diagram"
  src="https://user-images.githubusercontent.com/2915629/68430966-26b39880-017f-11ea-880c-10a6466c8d3b.png"
  align="right">

Modules are built using a shared stack of foundation packages which provide a
unified interface for networking, analytics, commerce integrations, components,
and more across each of our [supported platforms](#platforms). Higher-level
modules do not need to implement platform-specific code.

Foundation packages provide a normalization over their integrations. For
example, [`fscommerce`](libs/fscommerce) provides a single interface to query
both [SFCC](https://www.salesforce.com) and
[Shopify](https://www.shopify.com). The higher-level
[`fsproductindex`](libs/fsproductindex) module doesn't need to know what the
data source is to display a grid of products.

These foundation packages are built on top of one another. For example,
[`fscomponents`](libs/fscomponents) has props that inherit from
[`fscommerce`](libs/fscommerce); [`fscommerce`](libs/fscommerce) sends
analytics using [`fsengage`](libs/fsengage); and [`fsengage`](libs/fsengage)
talks to the network using [`fsnetwork`](libs/fsnetwork). |

### Platforms

Supported platforms are:

- `android`
- `ios`
- `web`

### Nrwl Nx

In Flagship 11, we began integrating Nrwl Nx into the core of
Flagship. The existing `flagship` package can still be used without Nrwl Nx,
however we are very excited about the improvements that Nx brings to the
development workflow. The [`flagship-nx`](libs/flagship-nx) package includes
the Flagship Nx plugin. You can use the `init` executor in this package to
create an `ios` and `android` file for any nx project. The
[`webpack-nx`]('libs/webpack-nx') includes a ready-made webpack config which
supports all Flagship modules.

## Troubleshooting

<img alt="Troubleshooting Flagship"
  src="https://user-images.githubusercontent.com/556070/38958560-9f7aab28-432b-11e8-8e67-68d781f5681d.png"
  align="left">

If you encounter issues while using Flagship, please check out our
[Troubleshooting](TROUBLESHOOTING.md) guide where you might find the answer to
your problem. If you encounter something that is not listed there, [try
searching for the issue in
GitHub](https://github.com/wSedlacek/flagship-text/issues).

We want your feedback! Please [open a new
issue](https://github.com/shipyard/flagship/issues/new) to report a bug or
request a new feature.

Need more help? [Contact us](mailto:product@brandingbrand.com).
