---
title: Introduction
description: Introduction to Flagship Code
layout: ../../layouts/docs.astro
lang: en
---

## Flagship Code

[**Flagship Code**](https://github.com/brandingbrand/flagship/tree/feat/flagship-12) is a configuration as code (CaC) toolkit which focuses on naitve code generation for React Native leveraging simplicity, extensibility and typesafety.

The core foundation is based upon [**React Native**](https://reactnative.dev/) and [**TypeScript**](https://typescriptlang.org/). To manage this foundation, we created this toolkit - CaC is the process of managing services via machine-readable definition files. Our configuration are typesafe javascript objects represented in typescript files.

## What are we solving?

Flagship Code aims to solve two problems: typesafe build + runtime configurations and native code generation. Native code generation is everything from React Native essentials to third-party dependencies that require native code changes. To manage these two challenges a typesafe idempotnent CaC toolkit was created. This toolkit can be broken down into three models: core, cli and plugins.

The core sdk is contains utility functions, executors and a template. Utility functions are foundational functions that executors and more complex functions are built upon to manipulate or generate native code. Executors are complex functions that are executed at different native-specific lifecycles.

The cli sdk is a command line interface that listens for options that conditionally run executors.

Plugins are published or local native-specific scripts i.e. iOS and/or Android, that manipulate or generate native code for a specific third-party SDK. These plugins are run generically based upon a priority list captured in the _package.json_.

## Usage

At any time in the phase of your React Native project you can opt-in to using Flagship Code; opting-in is as easy creating a typesafe configuration file + required plugins and adding the _ios_ and _android_ directories to your _.gitignore_.

If you are already using Flagship Code - at any time you can easily opt-out from continuuing using Flagship Code; opting-out from Flagship Code is as easy as removing your configuration folder and removing _ios_ and _android_ directories from your _.gitignore_.

Head over to the [**Integration**](/en/usage/integration) section for more detailed information.
