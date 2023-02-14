<h1 align="center">
  <a href="https://brandingbrand.github.io/flagship/">
    <img alt="Flagship"
      src="https://user-images.githubusercontent.com/2915629/127563134-be64905e-d429-446d-9a53-a657c9613f6f.png"
      height="100">
  </a>
</h1>

<p align="center">
  Flagship Code is a configuration as code (CaC) toolkit which focuses on naitve code generation for React Native leveraging simplicity, extensibility and typesafety.
</p>

# Flagship Code

## About Flagship Code

<img alt="Flagship accelerates development"
  src="https://user-images.githubusercontent.com/556070/38955661-4ff210c6-4323-11e8-960e-b568bc4b2bec.png"
  align="right">

Flagship Code aims to solve two problems: typesafe build + runtime configurations and native code generation. To manage these two challenges a typesafe idempotnent CaC toolkit was created. This toolkit can be broken down into three models: core, cli and plugins.

### How It Works

The core sdk is contains utility functions, executors and a template. Utility functions are foundational functions that executors and more complex functions are built upon to manipulate or generate native code. Executors are complex functions that are executed at different native-specific lifecycles.

The cli sdk is a command line interface that listens for options that conditionally run executors.

Plugins are published or local native-specific scripts i.e. iOS and/or Android, that manipulate or generate native code for a specific third-party SDK. These plugins are run generically based upon a priority list captured in the _package.json_.

## Troubleshooting

<img alt="Troubleshooting Flagship"
  src="https://user-images.githubusercontent.com/556070/38958560-9f7aab28-432b-11e8-8e67-68d781f5681d.png"
  align="left">

If you encounter issues while using Flagship, please check out our
[Troubleshooting](TROUBLESHOOTING.md) guide where you might find the answer to
your problem. If you encounter something that is not listed there, [try
searching for the issue in
GitHub](https://github.com/brandingbrand/flagship/issues).

We want your feedback! Please [open a new
issue](https://github.com/brandingbrand/flagship/issues/new) to report a bug or
request a new feature.

Need more help? [Contact us](mailto:product@brandingbrand.com).
