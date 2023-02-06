---
title: FAQ
description: FAQ
layout: ../../layouts/docs.astro
lang: en
---

## FAQ

#### How does this help me?

`Flagship Kernel` provides you a typed configuration with idempotent native code generation. This is important for scalability, managing third-party dependencies, managing build configurations, managing runtime configurations and staying up to date with the latest stable release of React Native.

#### React Native Support Version?

We support the latest stable release of React Native which we define as latest released version minus one semantic minor version i.e. latest released is `0.71.2` and we support `0.70.6`. This will be the continuued pattern unless there is a necessary upgrade.

#### Can I opt-in at any time?

Yes, at any time you can opt-in. To opt-in you will stop persisting the `ios` and `android` directories, create a `kernel` runtime configuration directory with all necessary assets and add the necessary packages. To see a detailed implementation, head over to the [**integration**](/en/usage/integration) page.

#### Can I opt-out at any time?

Yes, at any time you can opt-out. To opt-out you will start persisting the `ios` and `android` directories and remove all `kernel` dependencies.
